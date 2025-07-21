import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import PostItem from './PostItem'
import { Link } from 'react-router-dom'
import { PlusCircleIcon } from 'lucide-react'
const CommunityDisplay = ({ communityId }) => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetCommunityPost = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase.from("posts").select("*,communities(name)").eq("community_id", communityId).order("created_at", { ascending: false })

      if (error) throw error
      setPosts(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetCommunityPost()
  }, [communityId])

  if (loading) return <div className="text-center py-4">Loading communities...</div>
  if (error) return <div className="text-center text-red-500 py-4">Error: {error}</div>
  return (
    <div>
      <h2 className="text-6xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        {posts[0]?.communities?.name || "Unknown"} Community Posts
      </h2>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-6 px-4">
          {posts.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400">
          No posts in this community yet.
        </p>
      )}
      <Link to="/create" className="group">
        <div className="fixed bottom-10 right-10 z-50">
          <div className="relative">
            <PlusCircleIcon className="w-12 h-12 text-purple-600 hover:text-purple-800 transition duration-300 drop-shadow-lg" />
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-sm px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              Create Post
            </span>
          </div>
        </div>
      </Link>

    </div>
  )
}

export default CommunityDisplay
