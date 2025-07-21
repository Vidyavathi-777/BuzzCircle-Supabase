import React, { useState,useEffect } from 'react'
import { Route, Routes } from 'react-router'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import CreatePostPage from './pages/CreatePostPage'
import PostPage from './pages/PostPage'
import CreateCommunityPage from './pages/CreateCommunityPage'
import CommunitiesPage from './pages/CommunitiesPage'
import CommunityPage from './pages/CommunityPage'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Profile from './pages/Profile'
import EditProfilePage from './pages/EditProfilePage'
import SideBar from './pages/SideBar'
import { useAuth } from './context/AuthContext'
import { supabase } from './supabaseClient'
import SearchUsers from './pages/SearchUsers'
import FollowersPage from './pages/FollowersPage'
import FollowingPage from './pages/FollowingPage'

const App = () => {
    const { user } = useAuth()
    const [isAdmin, setIsAdmin] = useState([])

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
    return (
        <div className=' min-h-screen bg-white text-black transition-opacity duration-700 relative'>
            <Navbar />
            <div className=' '>
                <SideBar />

                {/* Main Content Area */}
                <div className='md:ml-20 lg:ml-64 pt-10 pb-16'>
                    <div className=' max-w-6xl mx-auto px-4 py-6'>
                        <Routes>
                            <Route path='/' element={<Home />} />
                            <Route path='/create' element={<CreatePostPage />} />
                            <Route path='/post/:id' element={<PostPage />} />
                            {isAdmin && (
                                <Route path='/community/create' element={<CreateCommunityPage />} />
                            )}
                            <Route path='/search' element={<SearchUsers />} />
                            <Route path='/communities' element={<CommunitiesPage />} />
                            <Route path='/community/:id' element={<CommunityPage />} />
                            <Route path='/signin' element={<SignIn />} />
                            <Route path='/signup' element={<SignUp />} />
                            <Route path='/profile' element={<Profile />} />
                            <Route path='/edit-profile' element={<EditProfilePage />} />
                            <Route path='/followers' element={<FollowersPage/>} />
                            <Route path='/following' element={<FollowingPage />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App