import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import PostItem from './PostItem'


const PostList = () => {
    const [posts,setPosts] = useState([])
    const [loading,setLoading] = useState(true)
    const [error,setError] = useState(null)

    const fetchPosts = async () =>{
        setLoading(true)
        setError(null)

        try{
            const {data,error} = await supabase.rpc("get_posts_with_counts")

            if(error) throw new Error(error.message) 
            console.log(data)
            setPosts(data || [])
        }catch(err){
            setError(err.message)
        }finally{
            setLoading(false)
        }
    }
    useEffect(() =>{
        fetchPosts()
    },[])

    if (loading) return <div className='text-center py-10'>Loading Posts......</div>
    if(error) return <div className='text-red-500 text-center py-10'>Error : {error}</div>
  return (
    <div className='flex flex-wrap gap-2 justify-center'>
        {/* <img src={posts[1].image_url}/> */}
      {posts.map((post,index) =>(
        <PostItem key={index} post={post} />
      ))}
    </div>
  )
}

export default PostList
