import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";

const CreatePost = () => {
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [communityId, setCommunityId] = useState(null);
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  
  const fetchCommunities = async () => {
    try {
      const { data, error } = await supabase
        .from("communities")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCommunities(data || []);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleCommunityChange = (e) => {
    const value = e.target.value;
    setCommunityId(value ? Number(value) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!selectedFile) {
      setError("Please select an image");
      return;
    }

    setLoading(true);
    try {
      
      const filePath = `${title}-${Date.now()}-${selectedFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("post-images")
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      const { data: publicURLData } = supabase.storage
        .from("post-images")
        .getPublicUrl(filePath);

      // Insert post record into Supabase
      const { error: insertError } = await supabase.from("posts").insert([
        {
          title,
          content,
          image_url: publicURLData.publicUrl,
          community_id: communityId,
        },
      ]);

      if (insertError) throw insertError;

      setTitle("");
      setContent("");
      setSelectedFile(null);
      setCommunityId(null);
      alert("Post created successfully!");
    } catch (err) {
      console.error("Post creation failed:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
      <h2 className="text-6xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        Create New Post
      </h2>

      <div>
        <label htmlFor="title" className="block mb-2 font-medium">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          required
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-white/10 bg-transparent p-2 rounded"
        />
      </div>

      <div>
        <label htmlFor="content" className="block mb-2 font-medium">
          Content
        </label>
        <textarea
          id="content"
          value={content}
          required
          rows={5}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border border-white/10 bg-transparent p-2 rounded"
        />
      </div>

      <div>
        <label>Select Community</label>
        <select
          id="community"
          onChange={handleCommunityChange}
          value={communityId || ""}
          className="w-full bg-transparent  border border-white/10 p-2 rounded"
        >
          <option value="" className="text-black">-- Choose a Community --</option>
          {communities.map((community) => (
            <option key={community.id} value={community.id} className="text-black">
              {community.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="image" className="block mb-2 font-medium">
          Upload Image
        </label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full text-gray-200"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-purple-500 text-white px-4 py-2 rounded cursor-pointer disabled:opacity-60"
      >
        {loading ? "Creating..." : "Create Post"}
      </button>

      {error && <p className="text-red-500 mt-2">Error: {error}</p>}
    </form>
  );
};

export default CreatePost;
