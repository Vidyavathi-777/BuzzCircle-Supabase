import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import { PlusCircleIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CommunityList = () => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joinedIds, setJoinedIds] = useState(new Set());
  const { user } = useAuth();
  // console.log("HIIIII")
  // console.log(user.id)

  // const {data:authUser} = await supabase.auth.getUser()
  const fetchCommunities = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("communities")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCommunities(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchJoinedCommunities = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("community_members")
      .select("community_id")
      .eq("user_id", user.id);

    if (!error && data) {
      const ids = new Set(data.map((item) => item.community_id));
      setJoinedIds(ids);
    }
  };

  const handleJoin = async (communityId) => {
    if (!user) {
      alert("You must be logged in to join a community");
      return;
    }

    const { error } = await supabase.from("community_members").insert([
      {
        community_id: communityId,
        user_id: user.id,
      },
    ]);

    if (error) {
      setError(`Failed to Join: ${error.message}`);
    } else {
      setJoinedIds((prev) => new Set(prev).add(communityId));
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  useEffect(() => {
    if (user) {
      fetchJoinedCommunities();
    }
  }, [user]);


  if (loading) {
    return <div className="text-center py-4">Loading communities...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-4">Error: {error}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {communities.map((community) => (
        <div
          key={community.id}
          className="border border-b  p-4 rounded hover:-translate-y-1 transition transform"
        >
          <div className="flex justify-between items-center">
            <Link
              to={`/community/${community.id}`}
              className="text-2xl font-bold text-purple-500 hover:underline"
            >
              {community.name}
            </Link>

             {joinedIds.has(community.id) ? (
              <span className="text-green-500 text-sm font-medium">Joined</span>
            ) : (
              <button
                onClick={() => handleJoin(community.id)}
                className="text-sm px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 flex items-center gap-1"
              >
                <PlusCircleIcon className="w-5 h-5" />
                Join
              </button>
            )} 
          </div>

          <p className="text-gray-400 mt-2">{community.description}</p>
        </div>
      ))}
    </div>
  );
};

export default CommunityList;
