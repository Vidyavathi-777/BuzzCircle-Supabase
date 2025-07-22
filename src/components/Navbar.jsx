import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { UserCircleIcon } from '@heroicons/react/24/solid'
import { supabase } from '../supabaseClient'
import { SearchIcon } from 'lucide-react'


const Navbar = () => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("users")
          .select("name, avatar_url")
          .eq("id", user.id)
          .single()

        if (error) {
          console.error("Error fetching profile:", error)
        } else {
          setProfile(data)
        }
        setLoading(false)
      } else {
        setProfile(null)
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user])

  return (
    <nav className='fixed top-0 w-full h-15 z-50 bg-white shadow-md border-b border-white/20'>
      <div className='max-w-8xl mx-auto px-8 py-2 flex items-center justify-between'>
        {/* Logo */}
        <div className='flex gap-2'>
          <Link to="/" className='font-mono text-xl font-bold text-black'>
            Buzz<span className='text-purple-500'>Circle</span>
          </Link>
          <Link to={"/search"}>
            <label className='flex '>
              {/* <input type="text" className='border-b' placeholder='Search Your Friends' /> */}
              <SearchIcon className='w-5 h-5' />
            </label>
          </Link>
        </div>


        {/* Right Side - Avatar or Auth */}
        <div className=''>
          {loading ? null : user ? (
            <Link to="/profile" className='flex items-center gap-2'>
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="avatar"
                  className='w-10 h-10 rounded-full object-cover border border-purple-400 shadow'
                />
              ) : (
                <div className='w-8 h-8 rounded-full bg-purple-300 flex items-center justify-center text-white font-semibold'>
                  {profile?.username?.charAt(0)?.toUpperCase() }
                </div>
              )}
              <span className='text-sm font-large text-gray-700 hover:text-purple-600 transition'>
                {profile?.name}
              </span>
            </Link>
          ) : (
            <Link to="/signUp">
              <UserCircleIcon className='w-7 h-7 text-gray-700 hover:text-purple-600 transition' />
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
