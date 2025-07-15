import React, { useEffect, useState } from 'react'
// import { Link } from 'react-router'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../supabaseClient'
import { Camera,X,Save } from 'lucide-react'
import { useNavigate } from 'react-router'

const EditProfilePage = () => {
    const [profile, setProfile] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null);
    const [name,setName] = useState(null)
    const [bio,setBio] = useState(null)
    const navigate = useNavigate()
    const { user } = useAuth()

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault()
        setError(null)
        setLoading(true)
        let avatarUrl = null

        try{
            if(selectedFile){
                const filePath = `avatars/${user.id}-${Date.now()}-${selectedFile.name}`;
                const {error:uploadError} = await supabase.storage.from("avatar-url").upload(filePath,selectedFile)

                if(uploadError) throw uploadError

                const{data:publicUrlData} = supabase.storage.from("avatar-url").getPublicUrl(filePath)

                avatarUrl = publicUrlData.publicUrl
            }
            const updates = {
                name,bio
            }
            if(avatarUrl){
                updates.avatar_url = avatarUrl
            }

            const {data,error:updatedError} = await supabase.from("users").update(updates).eq("id",user.id).select()

            if (updatedError) throw updatedError
            alert("Profile Updated")
            setProfile(data)
            setSelectedFile(null)
            navigate("/profile")
        }catch(err){
            setError(`Profile update Failed ${err.message}`)
        }finally{
            setLoading(false)
        }

    }

    useEffect(() =>{
        const fetchProfile = async() =>{
            const {data,error} = await supabase.from("users").select("name,bio,avatar_url").eq("id",user.id).single()
            if(error) {
                setError("Failed to load profile")
            }else{
                setProfile(data)
                setName(data.name)
                setBio(data.bio)
            }
        }
        if(user) fetchProfile()
    },[user])
    return (
        <form onSubmit={handleUpdate}>
            <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                    <input
                        type="file"
                        id='image'
                        accept="image/*"
                        onChange={handleFileChange}
                        className='hidden'
                    />
                    <img src={selectedFile ? URL.createObjectURL(selectedFile) : (profile?.avatar_url || '/default-avatar.png')} alt="Profile" className="w-20 h-20 rounded-full object-cover border-2 border-purple-500" />
                    <button type='button' onClick={() => document.getElementById('image').click()} 
                    className="absolute -bottom-1 -right-1 bg-purple-600 hover:bg-purple-700 text-white p-1 rounded-full transition">
                        <Camera className="w-4 h-4" />
                    </button>
                </div>
                <div className="flex-1">
                    <p className="text-sm text-gray-600">Click the camera icon to change your profile picture</p>
                </div>
            </div>
            <div className="space-y-4">
                {/* Name */}
                <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e)=> setName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter your name"
                    />
                </div>

                {/* Bio */}
                <div>
                    <label className="block text-sm font-medium mb-1">Bio</label>
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                        rows="3"
                        placeholder="Tell us about yourself"
                    />
                </div>



            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
                <button
                    type='submit'
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition font-medium flex items-center justify-center gap-2"
                >
                    {loading ? ( 
                       <> Saving.... </>
                    ):(
                        <>
                        <Save className="w-4 h-4" />
                        Save Changes
                        </>
                    )}
                </button>
                <div
                    
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg transition font-medium flex items-center justify-center gap-2"
                >
                    <X className="w-4 h-4" />
                    Cancel
                </div>
            </div>
                  {error && <p className="text-red-500 mt-4">{error}</p>}
        </form>


    )
}

export default EditProfilePage
