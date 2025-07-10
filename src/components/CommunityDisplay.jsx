import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import PostItem from './PostItem'

const CommunityDisplay = ({communityId}) => {
    const [posts,setPosts] = useState([])
    const [loading,setLoading] = useState(true)
    const [error,setError] = useState(null)

    const fetCommunityPost = async() =>{
        try{
            setLoading(true)
            setError(null)

            const {data,error} = await supabase.from("posts").select("*,communities(name)").eq("community_id",communityId).order("created_at",{ascending:false})

            if (error) throw error
            setPosts(data || [])
        }catch(err){
            setError(err.message)
        }finally{
            setLoading(false)
        }
    }

    useEffect(() =>{
        fetCommunityPost()
    },[communityId])

    if (loading) return <div className="text-center py-4">Loading communities...</div>
    if (error) return <div className="text-center text-red-500 py-4">Error: {error}</div>
  return (
      <div>
      <h2 className="text-6xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        {posts[0]?.communities?.name || "Unknown"} Community Posts
      </h2>

      {posts.length > 0 ? (
        <div className="flex flex-wrap gap-6 justify-center">
          {posts.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400">
          No posts in this community yet.
        </p>
      )}
    </div>
  )
}

export default CommunityDisplay
