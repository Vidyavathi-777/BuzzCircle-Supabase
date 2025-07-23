import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { UserCircleIcon } from '@heroicons/react/24/solid'
import { supabase } from '../supabaseClient'
import { SearchIcon, MessageSquareMore } from 'lucide-react'

const Navbar = () => {
  // const [profile, setProfile] = useState(null)
  // const [loading, setLoading] = useState(true)
  const { user ,fetchProfile,loading,profile} = useAuth()

  useEffect(() => {
    fetchProfile()
  }, [user])

  return (
    <nav className='fixed top-0 w-full h-16 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200'>
      <div className='max-w-8xl mx-auto px-6 py-3 flex items-center justify-between h-full'>
        {/* Logo Section */}
        <div className='flex items-center gap-6'>
          <Link to="/" className='font-mono text-2xl font-bold text-gray-800 hover:text-purple-600 transition-colors duration-200'>
            Buzz<span className='text-purple-600'>Circle</span>
          </Link>
          
          <Link 
            to="/search" 
            className='flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-purple-100 transition-all duration-200 group'
          >
            <SearchIcon className='w-5 h-5 text-gray-600 group-hover:text-purple-600 transition-colors duration-200' />
          </Link>
        </div>

        {/* Right Side - Navigation Items */}
        <div className='flex items-center gap-4'>
          {/* Chat Icon */}
          <Link 
            to="/chat-page"
            className='flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-purple-100 transition-all duration-200 group relative'
          >
            <MessageSquareMore className='w-5 h-5 text-gray-600 group-hover:text-purple-600 transition-colors duration-200'/>
          </Link>

          {/* User Profile Section */}
          {loading ? (
            <div className='w-10 h-10 rounded-full bg-gray-200 animate-pulse'></div>
          ) : user ? (
            <Link 
              to="/profile" 
              className='flex items-center gap-3 px-3 py-2 rounded-full hover:bg-gray-50 transition-all duration-200 group'
            >
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="User avatar"
                  className='w-10 h-10 rounded-full object-cover border-2 border-purple-200 shadow-md group-hover:border-purple-400 transition-all duration-200'
                />
              ) : (
                <div className='w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold shadow-md group-hover:shadow-lg transition-all duration-200'>
                  {profile?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
              
              {profile?.name && (
                <span className='text-sm font-medium text-gray-700 group-hover:text-purple-600 transition-colors duration-200 hidden sm:block'>
                  {profile.name}
                </span>
              )}
            </Link>
          ) : (
            <Link 
              to="/signUp"
              className='flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-purple-100 transition-all duration-200 group'
            >
              <UserCircleIcon className='w-6 h-6 text-gray-600 group-hover:text-purple-600 transition-colors duration-200' />
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar