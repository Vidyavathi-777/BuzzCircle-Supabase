import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { Link } from 'react-router'

const CommunityList = () => {
    const [communities, setCommunities] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchCommunities = async() =>{
        try{
            setLoading(true)
            setError(null)

            const {data,error} = await supabase.from("communities").select("*").order("created_at",{ascending:false})

            if (error) throw error
            setCommunities(data || [])
        }catch(err){
            setError(err.message)
        }finally{
            setLoading(false)
        }
    }

    useEffect(() =>{
        fetchCommunities()
    },[])

    if (loading) return <div className="text-center py-4">Loading communities...</div>
    if (error) return <div className="text-center text-red-500 py-4">Error: {error}</div>
  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {communities.map((community) => (
        <div
          key={community.id}
          className="border border-white/10 p-4 rounded hover:-translate-y-1 transition transform"
        >
          <Link
            to={`/community/${community.id}`}
            className="text-2xl font-bold text-purple-500 hover:underline"
          >
            {community.name}
          </Link>
          <p className="text-gray-400 mt-2">{community.description}</p>
        </div>
      ))}
    </div>
  )
}

export default CommunityList
