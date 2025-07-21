import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const PostItem = ({ post }) => {
  const formattedDate = new Date(post.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
  })
  const [month, day] = formattedDate.toUpperCase().split(' ')

return (
  <div className="w-full p-5 group relative overflow-hidden">
    
    <Link to={`/post/${post.id}`}>
      <div className="relative bg-white flex flex-col  rounded-2xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-1">
        
        {post.image_url && (
          <div className="relative overflow-hidden">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        )}
        

        <div className="p-5 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute -inset-0.5 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300"></div>
                <div className="relative w-12 h-12 rounded-full bg-gradient-to-tr from-[#8A2BE2] to-[#491F70] shadow-lg"></div>
              </div>
              
              <div className="flex-1">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {`${month} ${day}`}
                </div>
              </div>
            </div>

            {/* <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
            </div> */}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-gray-900  leading-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
              {post.title}
            </h3>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-4">
              {/* Likes */}
              <div className="flex items-center gap-2 text-pink-600 dark:text-pink-500 transition-colors duration-300 hover:text-pink-700 dark:hover:text-pink-400">
                <Heart className="w-5 h-5 fill-current" />
                <span className="font-semibold text-sm">{post.like_count ?? 0}</span>
              </div>
              
              {/* Comments */}
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 transition-colors duration-300 hover:text-gray-700 dark:hover:text-gray-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="font-medium text-sm">24</span>
              </div>
              
            </div>
            
            {/* Read time */}
            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              3 min read
            </div>
          </div>
        </div>
        
        {/* Shine effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out"></div>
        </div>
      </div>
    </Link>
  </div>
)
}

export default PostItem
