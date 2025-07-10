import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../supabaseClient'

const LikeButton = ({ postId }) => {
    const { user } = useAuth()

    const [votes, setVotes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchVotes = async () => {
        setLoading(true)
        try {
            const { data, error } = await supabase.from("votes").select("*").eq("post_id", postId)
            if (error) throw error;

            setVotes(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleVote = async (voteVlaue) => {
        if (!user) {
            alert("You must be logged in to vote!")
        }
        try {
            const { data: existingvote } = await supabase.from("votes").select("*").eq("post_id", postId).eq("user_id", user.id).maybeSingle()


            if (existingvote) {
                if (existingvote.vote === voteVlaue) {
                    const { error } = await supabase.from("votes").delete().eq("id", existingvote.id)
                    if (error) throw error
                } else {
                    const { error } = await supabase.from("votes").update({ vote: voteVlaue }).eq("id", existingvote.id)
                    if (error) throw error
                }
            } else {
                const { error } = await supabase.from("votes").insert({ post_id: postId, user_id: user.id, vote: voteVlaue })
                if (error) throw error
            }

            fetchVotes()
        } catch (err) {
            setError(err.message)
        }
    }

    useEffect(() => {
        fetchVotes()
        const interval = setInterval(fetchVotes, 5000)
        return () => clearInterval(interval)
    }, [postId])


    if (error) return <div className="text-red-500">Error: {error}</div>;

    const likes = votes.filter((v) => v.vote === 1).length
    const dislike = votes.filter((v) => v.vote === -1).length
    const userVote = votes.find((v) => v.user_id === user?.id)?.vote
    return (
        <div className="flex items-center gap-6 my-6">
            {/* Like Button */}
            <button
                onClick={() => handleVote(1)}
                className={`flex items-center gap-2 px-5 py-2 rounded-full border transition-all duration-200 
                ${userVote === 1
                        ? "bg-green-500 border-green-500 text-white"
                        : "bg-transparent border-gray-400 text-gray-300 hover:bg-green-100/10 hover:border-green-400"
                    }`}
            >
                👍 <span className="font-semibold">{likes}</span>
            </button>

            {/* Dislike Button */}
            <button
                onClick={() => handleVote(-1)}
                className={`flex items-center gap-2 px-5 py-2 rounded-full border transition-all duration-200 
                ${userVote === -1
                        ? "bg-red-500 border-red-500 text-white"
                        : "bg-transparent border-gray-400 text-gray-300 hover:bg-red-100/10 hover:border-red-400"
                    }`}
            >
                👎 <span className="font-semibold">{dislike}</span>
            </button>
        </div>

    )
}

export default LikeButton
