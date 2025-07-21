import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';

const SearchUsers = () => {
    const { user } = useAuth();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [followingMap, setFollowingMap] = useState({});

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

        if (error) {
            console.error("Search error:", error);
        } else {
            setResults(data);
        }
    };

    const handleFollow = async (targetUserId) => {
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

    const handleUnFollow = async (targetUserId) => {
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
        <div className="p-6 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Search Users</h2>

            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    className="border border-gray-300 px-4 py-2 rounded w-full"
                    placeholder="Search users by name..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button
                    onClick={handleSearch}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Search
                </button>
            </div>

            <div className="space-y-4">
                {results.length === 0 && query && (
                    <p className="text-gray-500">No users found.</p>
                )}
                {results.map((u) => (
                    <div
                        key={u.id}
                        className="flex items-center gap-4 p-3 border rounded shadow-sm bg-white"
                    >
                        <img
                            src={u.avatar_url}
                            alt={u.name}
                            className="w-12 h-12 rounded-full object-cover"
                        />
                        <span className="text-lg font-medium">{u.name}</span>

                        {followingMap[u.id] ? (
                            <button
                                onClick={() => handleUnFollow(u.id)}
                                className="bg-red-500 text-white px-3 py-1 rounded"
                            >
                                Unfollow
                            </button>
                        ) : (
                            <button
                                onClick={() => handleFollow(u.id)}
                                className="bg-green-600 text-white px-3 py-1 rounded"
                            >
                                Follow
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchUsers;
