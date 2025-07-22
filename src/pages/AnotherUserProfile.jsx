import React, { useEffect, useState } from 'react';
import { ChevronLeft, Settings, Heart, Bookmark, Users, MessageCircle, Grid3X3, PencilIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import { Link, useNavigate, useParams } from 'react-router-dom';

const AnotherUserProfile = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('Posts');
    const [profile, setProfile] = useState({});
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null);
    const [post, setPost] = useState([]);
    const [followingMap, setFollowingMap] = useState({});
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const navigate = useNavigate();

    const tabs = ['Posts', 'Communities'];

    const { id } = useParams();

    
    const fetchProfile = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data, error } = await supabase.from("users").select("*").eq("id", id).single();
            if (error) throw error;
            setProfile(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    
    const fetchCount = async () => {
        try {
            const [{ count: followers }, { count: following }] = await Promise.all([
                supabase.from('followers').select("*", { count: 'exact', head: true }).eq('following_id', id),
                supabase.from('followers').select("*", { count: 'exact', head: true }).eq('follower_id', id),
            ]);
            setFollowersCount(followers || 0);
            setFollowingCount(following || 0);
        } catch (error) {
            console.error("Error fetching counts:", error.message);
        }
    };

    
    const fetchPost = async () => {
        setError(null);
        try {
            const { data, error } = await supabase.from("posts").select("*").eq("user_id", id).order('created_at', { ascending: false }); // Ordered by most recent
            if (error) throw error;
            setPost(data);
        } catch (error) {
            setError(error.message);
        }
    };


    const fetchFollowing = async () => {
        if (!user) return; 
        try {
            const { data, error } = await supabase
                .from("followers")
                .select("following_id")
                .eq("follower_id", user.id)
                .eq("following_id", id); 

            if (error) {
                console.error("Error fetching following status:", error);
            } else {
                
                setFollowingMap(prev => ({ ...prev, [id]: data.length > 0 }));
            }
        } catch (error) {
            console.error("Error in fetchFollowing:", error.message);
        }
    };


    
    const handleFollow = async (targetUserId) => {
        if (!user) {
            alert("You need to be logged in to follow users.");
            return;
        }
        try {
            const { error } = await supabase.from("followers").insert({
                follower_id: user.id,
                following_id: targetUserId
            });

            if (!error) {
                setFollowingMap(prev => ({ ...prev, [targetUserId]: true }));
                setFollowersCount(prev => prev + 1); 
            } else {
                throw error;
            }
        } catch (error) {
            console.error("Follow error:", error.message);
            setError("Failed to follow: " + error.message);
        }
    };

    
    const handleUnFollow = async (targetUserId) => {
        if (!user) {
            alert("You need to be logged in to unfollow users.");
            return;
        }
        try {
            const { error } = await supabase
                .from("followers")
                .delete()
                .eq("follower_id", user.id)
                .eq("following_id", targetUserId);

            if (!error) {
                setFollowingMap(prev => {
                    const updated = { ...prev };
                    delete updated[targetUserId];
                    return updated;
                });
                setFollowersCount(prev => Math.max(0, prev - 1)); 
            } else {
                throw error;
            }
        } catch (error) {
            console.error("Unfollow error:", error.message);
            setError("Failed to unfollow: " + error.message);
        }
    };

    
    useEffect(() => {
        if (id) {
            fetchProfile();
            fetchPost();
        }
    }, [id]);

    
    useEffect(() => {
        if (id) {
            fetchCount();
        }
    }, [id]);

    
    useEffect(() => {
        if (id && user?.id) {
            fetchFollowing();
        } else if (!user) {
            
            setFollowingMap({});
        }
    }, [id, user]);

    const renderTabContent = () => {
        if (loading) return <div className="text-center text-gray-600 mt-8">Loading posts...</div>;
        if (error) return <div className="text-center text-red-500 mt-8">Error: {error}</div>;

        switch (activeTab) {
            case 'Posts':
                if (post.length === 0) {
                    return <div className="text-center text-gray-500 mt-8">No posts yet.</div>;
                }
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                        {post.map(post => (
                            <Link to={`/post/${post.id}`} key={post.id}>
                                <div className="relative group bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
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
                    <div className="text-center text-gray-500 mt-8">
                        Community content not yet available.
                    </div>
                );
            default:
                return null;
        }
    };

    if (loading && !profile.name) { 
        return (
            <div className="flex items-center justify-center min-h-screen bg-white text-black">
                <p>Loading profile...</p>
            </div>
        );
    }

    if (error && !profile.name) { 
        return (
            <div className="flex items-center justify-center min-h-screen bg-white text-red-500">
                <p>Error loading profile: {error}</p>
            </div>
        );
    }


    if (!profile.name && !loading && !error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white text-gray-700">
                <p>User profile not found.</p>
            </div>
        );
    }

    return (
        <div className="bg-white text-black min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <button onClick={() => navigate(-1)} className="p-1 rounded-full hover:bg-gray-100">
                    <ChevronLeft className="w-6 h-6 text-black" />
                </button>
                <h1 className="text-lg font-semibold">{profile.name}</h1>
                <div className="w-6 h-6"></div> 
            </div>

            {/* Profile Section */}
            <div className="p-6">
                <div className="flex items-start gap-4">
                    <div className="relative">
                        <img
                            src={profile.avatar_url } 
                            alt="Profile"
                            className="w-24 h-24 rounded-full object-cover border-2 border-purple-500"
                        />
                    </div>
                    <div className="flex-1 mt-2">
                        <h2 className="text-2xl font-bold text-black">{profile.name}</h2>
                        
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-black">{post.length}</div> 
                        <div className="text-sm text-gray-500">Posts</div>
                    </div>
                    <div className="text-center">

                            <div className="text-2xl font-bold text-black">{followersCount}</div>
                            <div className="text-sm text-gray-500">Followers</div>

                    </div>
                    <div className="text-center">

                            <div className="text-2xl font-bold text-black">{followingCount}</div>
                            <div className="text-sm text-gray-500">Following</div>

                    </div>
                </div>

                {/* Bio */}
                <div className="mt-6">
                    <p className="text-gray-800 text-sm leading-relaxed">
                        {profile.bio }
                    </p>
                </div>

                {/* Follow/Unfollow Button */}
                {profile.id && user?.id && user.id !== profile.id && ( 
                    followingMap[profile.id] ? (
                        <button
                            onClick={() => handleUnFollow(profile.id)}
                            className="mt-4 w-full bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors duration-200"
                        >
                            Unfollow
                        </button>
                    ) : ( 
                        <button
                            onClick={() => handleFollow(profile.id)}
                            className="mt-4 w-full bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors duration-200"
                        >
                            Follow
                        </button>
                    )
                )}

            </div>

            {/* Tabs */}
            <div className="px-6 mt-6">
                <div className="flex border-b border-gray-200">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-3 text-sm font-medium transition-colors relative ${activeTab === tab
                                ? 'text-purple-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-full" />
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

export default AnotherUserProfile;