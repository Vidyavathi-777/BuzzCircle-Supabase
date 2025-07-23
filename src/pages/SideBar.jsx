import React, { useState, useEffect } from 'react';
import {
  HomeIcon,
  PencilSquareIcon,
  UsersIcon,
  PlusCircleIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';

const SideBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState([])
  const { user } = useAuth()

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("users")
          .select("is_admin")
          .eq("id", user.id)
          .single()

        if (error) throw error

        setIsAdmin(data?.is_admin === true)
      } catch (error) {
        console.log("Error fetching user:", error.message)
      }
    }

    fetchProfile()
  }, [user])

  const icons = [
    { icon: <HomeIcon className="w-6 h-6" />, tooltip: 'Home', link: '/' },
    { icon: <PencilSquareIcon className="w-6 h-6" />, tooltip: 'Create Post', link: '/create' },
    { icon: <UsersIcon className="w-6 h-6" />, tooltip: 'Communities', link: '/communities' },
  ];

  if (user && isAdmin) {
    icons.push({
      icon: <PlusCircleIcon className="w-6 h-6" />,
      tooltip: 'Create Community',
      link: '/community/create'
    });
  }
  return (
    <>

      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden fixed top-2 left-4 z-50 text-white bg-purple-600 hover:bg-purple-700 p-2 mt-10  rounded-lg transition-colors"
      >
        {menuOpen ? <div className=''><XMarkIcon className="w-5 h-5 " /></div> : <Bars3Icon className="w-5 h-5" />}
      </button>


      {menuOpen && (
        <div
          className="fixed inset-0  bg-opacity-40 z-30"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <div
        className={`
          fixed top-0 left-0 h-screen bg-gradient-to-b from-purple-900 to-purple-800 shadow-xl z-40 mt-10
          transform transition-transform duration-300 ease-in-out
          ${menuOpen ? 'translate-x-0' : '-translate-x-full'}
          w-64 md:translate-x-0 md:w-20 lg:w-64
        `}
      >

        <div className="p-6 border-b border-purple-700">
          {/* <h2 className="text-white font-bold text-xl md:hidden lg:block">Menu</h2> */}
          <div className="hidden md:block lg:hidden w-8 h-8 bg-purple-600 rounded-full"></div>
        </div>


        <nav className="flex flex-col space-y-2 p-4">
          {icons.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              onClick={() => setMenuOpen(false)}
              className="group relative flex items-center space-x-3 text-purple-100 hover:text-white hover:bg-purple-700 p-3 rounded-lg transition-all duration-200"
            >
              <div className="flex-shrink-0">{item.icon}</div>
              <span className="md:hidden lg:block font-medium">{item.tooltip}</span>

              <div className="hidden md:block lg:hidden absolute left-full ml-2 px-2 py-1 bg-black bg-opacity-80 text-white text-sm rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                {item.tooltip}
              </div>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};

export default SideBar;
