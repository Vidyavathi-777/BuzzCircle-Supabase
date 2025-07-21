import React, { useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../context/AuthContext'
import {
  HomeIcon,
  PencilSquareIcon,
  UsersIcon,
  PlusCircleIcon,
  UserCircleIcon
} from '@heroicons/react/24/solid'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const { signInWithGitHub, signOut, user } = useAuth()
  // console.log(user)

  const displayName = user?.user_metadata?.user_name || user?.user_metadata?.name || user?.email


  return (
    <nav className='fixed top-0 w-full z-50 bg-white shadow-md border-b border-white/20'>
      <div className='max-w-8xl mx-auto px-8 py-2 flex  items-center justify-between '>
        <div>
          <Link to="/" className='font-mono text-xl font-bold text-black'>
            Buzz<span className='text-purple-500'>Circle</span>
          </Link>
        </div>
        <div className=''>
          {user ? (
            <Link to={"/profile"} >
              <UserCircleIcon className='w-7 h-7 text-gray-700 hover:text-purple-600 transition ' />
            </Link>
          ) : (
            <Link to={"/signUp"} >
              <UserCircleIcon className='w-7 h-7 text-gray-700 hover:text-purple-600 transition ' />
            </Link>
          )}
        </div>
      </div>

    </nav>
  )
}

export default Navbar
