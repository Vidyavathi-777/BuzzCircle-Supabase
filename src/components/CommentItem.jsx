import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';

const CommentItem = ({ comment, postId }) => {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [error, setError] = useState(null);
  const [posting, setPosting] = useState(false);

  const { user } = useAuth();

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    if (!user) {
      setError('You must be logged in to reply');
      return;
    }

    setPosting(true);
    setError(null);

    try {
      const { error } = await supabase.from('comments').insert({
        post_id: postId,
        content: replyText,
        parent_comment_id: comment.id,
        user_id: user.id,
        author: user.user_metadata?.name || user.user_metadata?.user_name || user.email,
      });

      if (error) throw error;

      setReplyText('');
      setShowReply(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="bg-white  rounded-xl border border-gray-700 p-4 mb-3 ml-4">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-purple-400 text-black font-bold rounded-full flex items-center justify-center">
          {/* {comment.author?.charAt(0)?.toUpperCase()} */}
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-semibold text-gray-900 ">
              {comment.author}
            </h4>
            <span className="text-xs text-gray-500">
              {new Date(comment.created_at).toLocaleString()}
            </span>
          </div>

          <p className="text-gray-700 border-t  text-sm mb-2">
            {comment.content}
          </p>

          
          {user && (
            <button
              onClick={() => setShowReply((prev) => !prev)}
              className="text-sm text-blue-500 hover:underline"
            >
              {showReply ? 'Cancel' : 'Reply'}
            </button>
          )}

    
          {showReply && user && (
            <form onSubmit={handleReply} className="mt-2">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="w-full border border-gray-600 rounded-md p-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                rows={2}
              />
              <button
                type="submit"
                className="mt-2 bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-1 rounded"
                disabled={posting}
              >
                {posting ? 'Posting...' : 'Post Reply'}
              </button>
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </form>
          )}

       
          {comment.children && comment.children.length > 0 && (
            <div className="mt-3">
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="text-sm text-gray-500 hover:text-gray-700 "
              >
                {isCollapsed ? 'Show Replies' : 'Hide Replies'}
              </button>

              {!isCollapsed && (
                <div className="mt-2 space-y-2">
                  {comment.children.map((child) => (
                    <CommentItem key={child.id} comment={child} postId={postId} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
