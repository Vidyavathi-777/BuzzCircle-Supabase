import React, { useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const { signInWithGitHub, signOut, user } = useAuth()

  const displayName = user?.user_metadata?.user_name ||  user?.user_metadata?.name || user?.email 

  return (
    <nav className='fixed top-0 w-full z-40 bg-[rgba(10,10,10,0.8)] backdrop-blur-lg border-b border-white/10 shadow-lg'>
      <div className='max-w-6xl mx-auto px-4'>
        <div className='flex justify-between items-center h-16'>
          {/* Brand */}
          <Link to="/" className='font-mono text-xl font-bold text-white'>
            Buzz<span className='text-purple-500'>Circle</span>
          </Link>

          {/* Desktop Links */}
          <div className='hidden md:flex items-center space-x-6'>
            <Link to="/" className='text-gray-300 hover:text-white transition'>Home</Link>
            <Link to="/create" className='text-gray-300 hover:text-white transition'>Create Post</Link>
            <Link to="/communities" className='text-gray-300 hover:text-white transition'>Communities</Link>
            <Link to="/community/create" className='text-gray-300 hover:text-white transition'>Create Community</Link>
          </div>

          {/* Desktop Auth */}
          <div className='hidden md:flex items-center space-x-4'>
            {user ? (
              <div className='flex items-center space-x-3'>
                {user.user_metadata?.avatar_url && (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="avatar"
                    className='w-8 h-8 rounded-full object-cover border border-gray-600'
                  />
                )}
                <span className='text-sm text-gray-300'>{displayName}</span>
                <button
                  onClick={signOut}
                  className='bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded transition'
                >
                  Sign out
                </button>
              </div>
            ) : (
              // <button
              //   onClick={signInWithGitHub}
              //   className='bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded transition'
              // >
              //   Sign in with GitHub
              // </button>
              <Link to={"/signup"} className='bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded transition'>Sign In</Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className='md:hidden'>
            <button
              onClick={() => setMenuOpen(prev => !prev)}
              className='p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none'
            >
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                {menuOpen ? (
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                ) : (
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className='md:hidden absolute top-16 left-0 w-full z-50 bg-[rgba(10,10,10,0.95)] backdrop-blur-md shadow-md border-t border-gray-700'>
          <div className='flex flex-col py-4 px-4 space-y-2'>
            <Link to="/" className='px-4 py-2 rounded-md text-base text-gray-300 hover:text-white hover:bg-gray-700'>Home</Link>
            <Link to="/create" className='px-4 py-2 rounded-md text-base text-gray-300 hover:text-white hover:bg-gray-700'>Create Post</Link>
            <Link to="/communities" className='px-4 py-2 rounded-md text-base text-gray-300 hover:text-white hover:bg-gray-700'>Communities</Link>
            <Link to="/community/create" className='px-4 py-2 rounded-md text-base text-gray-300 hover:text-white hover:bg-gray-700'>Create Community</Link>

            <div className='mt-4'>
              {user ? (
                <div className='flex items-center space-x-3'>
                  {user.user_metadata?.avatar_url && (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt="avatar"
                      className='w-8 h-8 rounded-full object-cover border border-gray-600'
                    />
                  )}
                  <span className='text-sm text-gray-300'>{displayName}</span>
                  <button
                    onClick={signOut}
                    className='ml-auto bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded transition'
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <button
                  onClick={signInWithGitHub}
                  className='w-full bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-2 rounded transition'
                >
                  Sign in with GitHub
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
