import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../supabaseClient'
import CommentItem from './CommentItem'

const CommentsSection = ({ postId }) => {
    const { user } = useAuth()
    const [newComment, setNewComment] = useState("")
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [posting, setPosting] = useState(false)

    const fetchComments = async () => {
        setLoading(true)
        setError(null)

        try {
            const { data, error } = await supabase.from("comments").select("*").eq("post_id", postId).order("created_at", { ascending: true })
            if (error) throw error
            setComments(data)
        } catch (err) {
            setError(err)
        } finally {
            setLoading(false)
        }
    }
    // useEffect(() => {
    //     fetchComments();
    //     const interval = setInterval(fetchComments, 5000); 
    //     return () => clearInterval(interval);
    // }, [postId]);
    useEffect (() =>{
        fetchComments()

        const subscription = supabase.channel('comments-channel').on('postgres_changes',{
            event:'INSERT',
            schema:'public',
            table:'comments',
            filter:'post_id=eq.${postId}'
        },
        (payload) =>{
            fetchComments()
        }
    ).subscribe()
    return () =>{
        supabase.removeChannel(subscription)
    }
    },[postId])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!newComment.trim()) return

        if (!user) {
            setError("You must be logged in to comment")
            return
        }
        setPosting(true)
        try {
            const { error } = await supabase.from("comments").insert({
                post_id: postId,
                content: newComment,
                parent_comment_id: null,
                user_id: user.id,
                author: user.user_metadata?.name || user.user_metadata?.user_name || user.email,
            })
            if (error) throw error
            setNewComment("")
            fetchComments()
        } catch (err) {
            setError(err.message)
        } finally {
            setPosting(false)
        }



    }

    const buildCommentTree = (flatComments) => {
        const map = new Map();
        const roots = [];

        flatComments.forEach((comment) => {
            map.set(comment.id, { ...comment, children: [] });
        });

        flatComments.forEach((comment) => {
            if (comment.parent_comment_id) {
                const parent = map.get(comment.parent_comment_id);
                if (parent) {
                    parent.children.push(map.get(comment.id));
                }
            } else {
                roots.push(map.get(comment.id));
            }
        });

        return roots;
    };

    const commentTree = buildCommentTree(comments);
  return (
        <div className="mt-8">
            <div className="mb-6">
                <h3 className="text-2xl font-bold text-black mb-1">
                    Comments ({comments.length})
                </h3>
                <div className="h-px bg-gray-200 "></div>
            </div>

            {user ? (
                <div className="mb-8 bg-white  rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="comment" className="block text-sm font-medium text-black  mb-2">
                                Add a comment
                            </label>
                            <textarea
                                id="comment"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="w-full border border-gray-300 dark:border-gray-600 bg-white   p-4 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-colors"
                                placeholder="Share your thoughts..."
                                rows={4}
                                disabled={posting}
                            />
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Posting as {user.user_metadata?.name || user.user_metadata?.user_name || user.email}
                            </p>
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 disabled:cursor-not-allowed"
                                disabled={posting || !newComment.trim()}
                            >
                                {posting ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Posting...
                                    </span>
                                ) : "Post Comment"}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200  p-6 text-center">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Join the conversation! Sign in to share your thoughts.
                    </p>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                        Sign In
                    </button>
                </div>
            )}

            {error && (
                <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-red-800 dark:text-red-200 text-sm font-medium">
                        {error}
                    </p>
                </div>
            )}

            <div className="space-y-4">
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="text-center">
                            <svg className="animate-spin h-8 w-8 text-gray-400 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p className="text-gray-500 dark:text-gray-400">Loading comments...</p>
                        </div>
                    </div>
                ) : commentTree.length > 0 ? (
                    commentTree.map((comment) => (
                        <CommentItem key={comment.id} comment={comment} postId={postId} />
                    ))
                ) : (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">💬</div>
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            No comments yet
                        </h4>
                        <p className="text-gray-500 dark:text-gray-400">
                            Be the first to share your thoughts!
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CommentsSection
