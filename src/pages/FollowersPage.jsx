import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';

const FollowersPage = () => {
  const { user } = useAuth();
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFollowers = async () => {
    const { data, error } = await supabase
      .from('followers')
      .select('follower_id, users:follower_id(*)')  // joins users table
      .eq('following_id', user.id);

    if (error) {
      console.error('Error fetching followers:', error);
    } else {
      setFollowers(data.map(f => f.users));
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user?.id) fetchFollowers();
  }, [user?.id]);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Your Followers</h2>
      {loading ? (
        <p>Loading...</p>
      ) : followers.length === 0 ? (
        <p>You don’t have any followers yet.</p>
      ) : (
        <div className="space-y-4">
          {followers.map((follower) => (
            <div
              key={follower.id}
              className="flex items-center gap-4 p-3 border rounded bg-white shadow"
            >
              <img
                src={follower.avatar_url}
                alt={follower.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <span className="text-lg font-medium">{follower.name}</span>
              {/* <Link
                to={`/profile/${follower.id}`}
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

export default FollowersPage;
