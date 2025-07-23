import React, { use, useEffect, useState } from 'react';
import { ChevronLeft, Settings, Heart, Bookmark, Users, MessageCircle, Grid3X3, PencilIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import { Link, useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('Posts');
  const navigate = useNavigate()

  const tabs = ['Posts', 'Communities', 'Liked', 'Saved'];
  const { 
    signOut, 
    fetchProfile, 
    loading, 
    error, 
    profile, 
    fetchCount, 
    followersCount, 
    followingCount, 
    post, 
    community, 
    fetchPost, 
    fetchCommunity, 
    fetchLikedPosts, 
    likedPosts } = useAuth()


  useEffect(() => {
    if (user?.id) {
      fetchProfile(user.id)
      fetchPost()
      fetchCommunity()
      fetchLikedPosts()

    }
  }, [user])
  useEffect(() => {
    fetchCount()
  }, [user?.id])

  const handleLogout = async () => {
    await signOut()
    navigate('/signIn')
  }


  const renderTabContent = () => {
    switch (activeTab) {
      case 'Posts':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {post.map(post => (
              <Link to={`/post/${post.id}`}>
                <div key={post.id} className="relative group bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">

                  <div className="aspect-square w-full">
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>



                  <div className="p-2">
                    <h3 className="text-lg font-semibold text-white truncate">
                      {post.title}
                    </h3>
                  </div>

                </div>
              </Link>
            ))}
          </div>
        );

      case 'Communities':
        return (
          <div className="mt-4 space-y-3  ">
            {community.map(community => (
              <Link to={`/community/${community.id}`}>
                <div key={community.id} className="flex items-center gap-3 bg-purple-800 rounded-lg p-3 hover:bg-purple-500 transition-colors">
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{community.name}</h4>
                    <p className="text-gray-400 text-sm">{community.members} members</p>
                  </div>
                  <button className="text-purple-400 hover:text-purple-300 transition-colors">
                    <Users className="w-5 h-5" />
                  </button>
                </div>
                <div className='mb-1'></div>
              </Link>
            ))}
          </div>
        );

      case 'Liked':
        return (
          <div className="grid grid-cols-3 gap-1 mt-4">
            {likedPosts.slice(0, 4).map(post => (
              <Link to={`/post/${post.id}`}>
                <div key={post.id} className="relative group aspect-square bg-gray-800 rounded-lg overflow-hidden">
                  <img
                    src={post.image_url}
                    alt={`Liked post ${post.id}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <Heart className="w-4 h-4 text-red-500 fill-current" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        );

      // case 'Saved':
      //   return (
      //     <div className="grid grid-cols-3 gap-1 mt-4">
      //       {posts.slice(2, 5).map(post => (
      //         <div key={post.id} className="relative group aspect-square bg-gray-800 rounded-lg overflow-hidden">
      //           <img
      //             src={post.image}
      //             alt={`Saved post ${post.id}`}
      //             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      //           />
      //           <div className="absolute top-2 right-2">
      //             <Bookmark className="w-4 h-4 text-yellow-500 fill-current" />
      //           </div>
      //         </div>
      //       ))}
      //     </div>
      //   );

      default:
        return null;
    }
  };

  return (
    <div className=" bg-whitw text-black">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <button onClick={() => navigate(-1)} className="p-1 rounded-full hover:bg-gray-100">
          <ChevronLeft className="w-6 h-6 text-black" />
        </button>
        <h1 className="text-lg font-semibold">{profile.name}</h1>
        <Settings className="w-6 h-6 text-white" />
        <button
          onClick={handleLogout}
          className='ml-auto bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded transition'
        >
          Log out
        </button>
      </div>

      {/* Profile Section */}
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="relative">
            <img
              src={profile.avatar_url}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border-2 border-purple-500"
            />

          </div>

          <div className="flex-1">
            <h2 className="text-xl font-bold text-black">{profile.name}</h2>

          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-black">{profile.post_count}</div>
            <div className="text-sm text-gray-400">Posts</div>
          </div>
          <div className="text-center">
            <Link to={"/followers"}>
              <div className="text-2xl font-bold text-black">{followersCount}</div>
              <div className="text-sm text-gray-400">Followers</div>
            </Link>
          </div>
          <div className="text-center">
            <Link to={"/following"}>
              <div className="text-2xl font-bold text-black">{followingCount}</div>
              <div className="text-sm text-gray-400">Following</div>
            </Link>
          </div>
        </div>

        {/* Bio */}
        <div className="mt-6">
          <p className="text-gray-800 text-sm leading-relaxed">
            {profile.bio}
          </p>
        </div>
        <Link to={"/edit-profile"}>
          <button
            className="w-[600px]  bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition font-medium"
          >
            Edit Profile
          </button>
        </Link>

      </div>

      {/* Tabs */}
      <div className="px-6">
        <div className="flex border-b border-gray-800">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-medium transition-colors relative ${activeTab === tab
                ? 'text-purple-400'
                : 'text-gray-400 hover:text-gray-300'
                }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-400 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>



      {/* Content */}
      <div className="px-6 pb-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ProfilePage;