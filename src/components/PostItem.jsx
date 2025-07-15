import React from 'react'

import { Link } from 'react-router'

const PostItem = ({post}) => {
    // console.log("data",post)
      const formattedDate = new Date(post.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
  })
    const [month, day] = formattedDate.toUpperCase().split(' ')
  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden transition hover:shadow-xl">
        <div className='ansolute -inset-1 rounded-[20px] bg-gradient-to-r from-pink-600 to-purple-600 blur-sm opacity-0 group-hover::opacity-50 transition duration-300 pointer-events-none'></div>
        <Link to={`/post/${post.id}`} className='flex flex-col sm:flex-row items-stretch'>
            <div className='w-80 h-76 bg-[rgb(24,27,32)] border border-[rgb(84,90,106)] rounded-[20px] text-white flex flex-col p-5 overflow-hidden transition-colors duration-300 group-hover:bg-gray-800'>
               
                <div className='flex items-center space-x-2'>
                    <div className="w-[35px] h-[35px] rounded-full bg-gradient-to-tl from-[#8A2BE2] to-[#491F70]" ></div>
                    <div className='flex flex-col flex-1'>
                        <div className='text-[20px] leading-[22px] font-semibold mt-2'>
                            {post.title}
                        </div>
                    </div> 
                </div>
               
                <div className='mt-2 flex-1'>
                    <img src={post.image_url} alt={post.title} className='w-full rounded-[20px] object-cover max-h-[150px] mx-auto' />
                </div>
                <div className='cursor-pointer h-10 w-[100px] px-1 flex items-center justify-center font-extrabold rounded-lg'>
                    <span >
                        ❤️ <span className="ml-2">{post.like_count ?? 0}</span>
                    </span>
                </div>
            </div>
            
        </Link>
    </div>

 )
}

export default PostItem
