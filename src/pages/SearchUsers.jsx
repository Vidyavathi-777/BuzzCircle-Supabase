import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import { Link, useNavigate } from 'react-router';
import { ChevronLeft } from 'lucide-react'

const SearchUsers = () => {
    const { user } = useAuth();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [followingMap, setFollowingMap] = useState({});
    const navigate = useNavigate()

    const fetchFollowing = async () => {
        if (!user) return;
        const { data, error } = await supabase
            .from("followers")
            .select("following_id")
            .eq("follower_id", user.id);

        if (error) {
            console.error("Error fetching following list:", error);
        } else {
            const map = {};
            data.forEach(f => {
                map[f.following_id] = true;
            });
            setFollowingMap(map); 
        }
    };

    const handleSearch = async () => {
        const { data, error } = await supabase
            .from("users")
            .select("*")
            .ilike("name", `%${query}%`)
            .neq("id", user.id);

        // console.log(data)

        if (error) {
            console.error("Search error:", error);
        } else {
            setResults(data);

        }
    };

    const handleFollow = async (e,targetUserId) => {
        e.preventDefault();
        e.stopPropagation();
        const { error } = await supabase.from("followers").insert({
            follower_id: user.id,
            following_id: targetUserId
        });

        if (!error) {
            setFollowingMap(prev => ({ ...prev, [targetUserId]: true }));
        } else {
            console.error("Follow error:", error);
        }
    };

    const handleUnFollow = async (e,targetUserId) => {
        e.preventDefault();
        e.stopPropagation();
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
        } else {
            console.error("Unfollow error:", error);
        }
    };

    useEffect(() => {
        if (user?.id) {
            fetchFollowing();
        }
    }, [user]);

    return (
        <div className="p-4 max-w-xl mx-auto  mt-8">
            <div className='flex items-center mb-6'>
                <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
                    <ChevronLeft className="w-6 h-6 text-gray-700" />
                </button>
                <h2 className="text-2xl font-bold text-gray-800 ml-3">Search Users</h2>
            </div>

            <div className="flex gap-3 mb-4">
                <input
                    type="text"
                    className="flex-1 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                    placeholder="Search users by name..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button
                    onClick={handleSearch}
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md"
                >
                    Search
                </button>
            </div>


            <div className="space-y-4">
                {results.length === 0 && query && (
                    <p className="text-gray-500">No users found.</p>
                )}

                {results.map((u) => (
                    <Link to={`/another-user/${u.id}`}>
                        <div
                            key={u.id}
                            className="flex items-center justify-between  gap-4 p-3 border rounded shadow-sm bg-white"
                        >
                            <div className='flex items-center justify-between gap-5'>
                                <img
                                    src={u.avatar_url}
                                    alt={u.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <span className="text-lg font-medium">{u.name}</span>
                            </div>
                            {followingMap[u.id] ? (
                                <button
                                    onClick={(e) => handleUnFollow(e,u.id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded"
                                >
                                    Unfollow
                                </button>
                            ) : (
                                <button
                                    onClick={(e) => handleFollow(e,u.id)}
                                    className="bg-green-600 text-white px-3 py-1 rounded"
                                >
                                    Follow
                                </button>
                            )}
                        </div>
                    </Link>
                ))}

            </div>
        </div>
    );
};

export default SearchUsers;
