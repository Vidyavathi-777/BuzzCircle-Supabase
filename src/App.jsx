import React from 'react'
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

const App = () => {
  return (
    <div className='min-h-screen bg-white text-black transition-opacity duration-700 pt-20 pb-16'>
      <Navbar />
      <div className='max-w-6xl mx-auto px-4 py-6'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/create' element={<CreatePostPage />} />
          <Route path='/post/:id' element={<PostPage />} />
          <Route path='/community/create' element={<CreateCommunityPage />} />
          <Route path='/communities' element={<CommunitiesPage />} />
          <Route path='/community/:id' element={<CommunityPage />} />
          <Route path='/signin' element={<SignIn />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/profile' element={<Profile/>} />
          <Route path='/edit-profile' element={<EditProfilePage/>} />
        </Routes>
      </div>
    </div>
  )
}

export default App
