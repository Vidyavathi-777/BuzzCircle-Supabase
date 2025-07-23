import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';

const FollowingPage = () => {
  const { user } = useAuth();
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFollowing = async () => {
    const { data, error } = await supabase
      .from('followers')
      .select('following_id, users:following_id(*)')
      .eq('follower_id', user.id);

    if (error) {
      console.error('Error fetching following:', error);
    } else {
      setFollowing(data.map(f => f.users));
    }
    setLoading(false);
  };
 
  useEffect(() => {
    if (user?.id) fetchFollowing();
  }, [user?.id]);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Users You Follow</h2>
      {loading ? (
        <p>Loading...</p>  
      ) : following.length === 0 ? (
        <p>You’re not following anyone yet.</p>
      ) : (
        <div className="space-y-4">
          {following.map((followedUser) => (
            <div
              key={followedUser.id}
              className="flex items-center gap-4 p-3 border rounded bg-white shadow"
            >
              <img
                src={followedUser.avatar_url}
                alt={followedUser.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <span className="text-lg font-medium">{followedUser.name}</span>
              {/* <Link
                to={`/profile/${followedUser.id}`}
                className="ml-auto text-blue-500 hover:underline"
              >
                View Profile
              </Link> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FollowingPage;
