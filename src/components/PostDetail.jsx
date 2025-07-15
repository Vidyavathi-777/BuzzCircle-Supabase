import React, { useEffect, useState } from 'react'

import { supabase } from '../supabaseClient'
import LikeButton from './LikeButton'

const PostDetail = ({postId}) => {
    const [post,setPost] = useState(null)
    const [loading,setLoading] = useState(true)
    const [error,setError] = useState(null)

    const fetchPost = async () =>{
        setLoading(true)
        setError(null)
        try{
            const{data,error} =await supabase.from("posts").select("*").eq("id",postId).single()

            if (error) throw error
            setPost(data)
        }catch(err){
            setError(err.message)
        }finally{
            setLoading(false)
        }
    }
    useEffect(()=>{
        fetchPost()
    },[postId])

    if(loading){
        return <div className='text-center py-10'>Loading Post</div>
    }
    if(error){
        return <div className='text-red-500 text-center py-10'>Error:{error}</div>
    }
  return (
       <div className="space-y-6 max-w-full mx-auto px-4">
      <h2 className="text-4xl md:text-6xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        {post?.title}
      </h2>

      {post?.image_url && ( 
        <div className="w-full max-h-[1000px] h-full overflow-hidden rounded-lg border border-white/10 shadow-lg">
        <img
          src={post.image_url}
          alt={post?.title}
          className="w-full h-full object-cover"
        />
      </div>
      )}

      <p className="text-gray-400 leading-relaxed text-lg">{post?.content}</p>

      <p className="text-gray-500 text-sm">
        Posted on: {new Date(post?.created_at).toLocaleDateString()}
      </p>
      <LikeButton postId={postId} />
    </div>
  )
}

export default PostDetail
