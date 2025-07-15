import React, { useEffect, useState } from 'react';
import { ChevronLeft, Settings,  Heart, Bookmark, Users, MessageCircle, Grid3X3, PencilIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import { Link, useNavigate } from 'react-router';

const ProfilePage = () => {
    const { user } = useAuth()
    const [activeTab, setActiveTab] = useState('Posts');
    const [profile, setProfile] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const tabs = ['Posts', 'Communities', 'Liked', 'Saved'];
    const { signOut } = useAuth()
    const fetchProfile = async () => {
        setLoading(true)
        setError(null)
        try {
            const { data, error } = await supabase.from("users").select("*").eq("id", user.id).single();
            if (error) throw error
            setProfile(data)
            // console.log("user",data)
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (user?.id) {
            fetchProfile()
        }
    }, [user])

    const handleLogout = async () =>{
        await signOut()
        navigate('/signIn')
    }






    //   const renderTabContent = () => {
    //     switch(activeTab) {
    //       case 'Posts':
    //         return (
    //           <div className="grid grid-cols-3 gap-1 mt-4">
    //             {posts.map(post => (
    //               <div key={post.id} className="relative group aspect-square bg-white rounded-lg overflow-hidden">
    //                 <img 
    //                   src={post.image} 
    //                   alt={`Post ${post.id}`}
    //                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
    //                 />
    //                 <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
    //                   <div className="flex items-center gap-4 text-white text-sm">
    //                     <span className="flex items-center gap-1">
    //                       <Heart className="w-4 h-4" />
    //                       {post.likes}
    //                     </span>
    //                     <span className="flex items-center gap-1">
    //                       <MessageCircle className="w-4 h-4" />
    //                       {post.comments}
    //                     </span>
    //                   </div>
    //                 </div>
    //               </div>
    //             ))}
    //           </div>
    //         );

    //       case 'Communities':
    //         return (
    //           <div className="mt-4 space-y-3">
    //             {communities.map(community => (
    //               <div key={community.id} className="flex items-center gap-3 bg-gray-800/50 rounded-lg p-3 hover:bg-gray-800 transition-colors">
    //                 <img 
    //                   src={community.image} 
    //                   alt={community.name}
    //                   className="w-12 h-12 rounded-full object-cover"
    //                 />
    //                 <div className="flex-1">
    //                   <h4 className="text-white font-medium">{community.name}</h4>
    //                   <p className="text-gray-400 text-sm">{community.members} members</p>
    //                 </div>
    //                 <button className="text-purple-400 hover:text-purple-300 transition-colors">
    //                   <Users className="w-5 h-5" />
    //                 </button>
    //               </div>
    //             ))}
    //           </div>
    //         );

    //       case 'Liked':
    //         return (
    //           <div className="grid grid-cols-3 gap-1 mt-4">
    //             {posts.slice(0, 4).map(post => (
    //               <div key={post.id} className="relative group aspect-square bg-gray-800 rounded-lg overflow-hidden">
    //                 <img 
    //                   src={post.image} 
    //                   alt={`Liked post ${post.id}`}
    //                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
    //                 />
    //                 <div className="absolute top-2 right-2">
    //                   <Heart className="w-4 h-4 text-red-500 fill-current" />
    //                 </div>
    //               </div>
    //             ))}
    //           </div>
    //         );

    //       case 'Saved':
    //         return (
    //           <div className="grid grid-cols-3 gap-1 mt-4">
    //             {posts.slice(2, 5).map(post => (
    //               <div key={post.id} className="relative group aspect-square bg-gray-800 rounded-lg overflow-hidden">
    //                 <img 
    //                   src={post.image} 
    //                   alt={`Saved post ${post.id}`}
    //                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
    //                 />
    //                 <div className="absolute top-2 right-2">
    //                   <Bookmark className="w-4 h-4 text-yellow-500 fill-current" />
    //                 </div>
    //               </div>
    //             ))}
    //           </div>
    //         );

    //       default:
    //         return null;
    //     }
    //   };

    return (
        <div className=" bg-whitw text-black">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <ChevronLeft className="w-6 h-6 text-black" />
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
                        <div className="text-2xl font-bold text-black">{profile.follower_count}</div>
                        <div className="text-sm text-gray-400">Followers</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-black">{profile.following_count}</div>
                        <div className="text-sm text-gray-400">Following</div>
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
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition font-medium"
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
            {/* <div className="px-6 pb-6">
        {renderTabContent()}
      </div> */}
        </div>
    );
};

export default ProfilePage;