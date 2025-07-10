import React, {useState, useRef } from 'react'
import { useNavigate } from 'react-router';
import { supabase } from '../supabaseClient';

const CreateCommunity = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const fileInput = useRef()

  const handleSubmit =async (e)=>{
    e.preventDefault()
    setLoading(true)
    setError(null)

    try{
        const{data,error} = await supabase.from("communities").insert([{name,description}])
        if (error) throw error
        setName("")
        setDescription("")
        if(fileInput.current){
            fileInput.current.value = ""
        }
        navigate("/communities")
    }catch(err){
        setError(err.message)
    }finally{
        setLoading(false)
    }
  }
  return (
   <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
      <h2 className="text-6xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        Create New Community
      </h2>

      <div>
        <label htmlFor="name" className="block mb-2 font-medium">
          Community Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-white/10 bg-transparent p-2 rounded"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block mb-2 font-medium">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-white/10 bg-transparent p-2 rounded"
          rows={3}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-purple-500 text-white px-4 py-2 rounded cursor-pointer disabled:opacity-60"
      >
        {loading ? "Creating..." : "Create Community"}
      </button>

      {error && <p className="text-red-500 mt-2">Error: {error}</p>}
    </form>

  )
}

export default CreateCommunity
