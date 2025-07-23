import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";


const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [profile, setProfile] = useState('')
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [followersCount, setFollowersCount] = useState(0)
    const [followingCount, setFollowingCount] = useState(0)
    const [post, setPost] = useState([])
    const [community, setCommunity] = useState([])
    const [likedPosts, setLikedPosts] = useState([])
        const [query, setQuery] = useState('');
        const [results, setResults] = useState([]);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
        })

        const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
            setUser(session?.user ?? null)
        })
        return () => {
            listener.subscription.unsubscribe();
        }

    }, [])



    const signUpUser = async (email, password, name) => {
        const deafult_avatar = "https://xqinkgfpevxlhwzeeypm.supabase.co/storage/v1/object/public/avatar-url/avatar.jpeg"
        try {
            const { data, error } = await supabase.auth.signUp({
                email, password,
                options: {
                    data: {
                        name: name,
                        avatar_url: deafult_avatar,
                    }
                }
            })
            if (error) {
                console.log("Sign Up error:", error.message)
                return { success: false, error: error.message }
            }
            return { success: true, data }
        } catch (error) {
            return { success: false, error: "An unexpected error occured" }
        }
    }

    const signInUser = async (email, password) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password })
            if (error) {
                console.log("Sign in error:", error.message)
                return { success: false, error: error.message }
            }
            return { success: true, data }
        } catch (error) {
            return { success: false, error: "An Unexpected error ocurred" }
        }
    }

    const signInWithGoogle = () => {
        supabase.auth.signInWithOAuth({ provider: 'google' })

    }

    const signInWithGitHub = () => {
        supabase.auth.signInWithOAuth({ provider: 'github' })
    }

    const signOut = () => {
        supabase.auth.signOut()
    }

    const fetchProfile = async (id = user?.id) => {
        setLoading(true)
        setError(null)
        try {
            const { data, error } = await supabase.from("users").select("*").eq("id", id).single();
            if (error) throw error
            setProfile(data)
            // console.log("user",data)
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }

    }

    const fetchCount = async () => {
        const [{ count: followers }, { count: following }] = await Promise.all([
            supabase.from('followers').select("*", { count: 'exact', head: true }).eq('following_id', user.id),
            supabase.from('followers').select("*", { count: 'exact', head: true }).eq('follower_id', user.id),
        ])
        setFollowersCount(followers || 0)
        setFollowingCount(following || 0)
        // console.log(setFollowersCount, setFollowingCount)
    }

    const fetchPost = async () => {
        setError(null)
        try {
            const { data, error } = await supabase.from("posts").select("*").eq("user_id", user.id);
            // const {data,error} = await supabase.rpc("get_posts_with_counts")
            if (error) throw error
            // console.log(data)
            setPost(data)

        } catch (error) {
            setError(error.message)
        }
    }

    const fetchCommunity = async () => {
        setError(null)
        try {
            const { data: memebersData, error: membersError } = await supabase.from("community_members").select("community_id").eq("user_id", user.id);
            if (membersError) throw membersError
            // console.log(data)
            // setCommunity(data)
            const communityId = memebersData.map(member => member.community_id)
            if (communityId.length === 0) {
                setCommunity([])
                return
            }
            const { data: communitiesData, error: communitiesError } = await supabase.from("communities").select("*").in("id", communityId)
            if (communitiesError) throw communitiesError
            // console.log(communitiesData)
            setCommunity(communitiesData)
        } catch (error) {
            setError(error.message)
        }
    }

      const fetchLikedPosts = async () => {
        setError(null)
        try {
          const { data: likedVotes, error: votesError } = await supabase.from("votes").select("post_id").eq("user_id", user.id).eq("vote", 1)
          if (votesError) throw votesError
          // console.log(likedVotes)
    
          const likedPostsId = likedVotes.map(entry => entry.post_id)
    
          if (likedPostsId === 0) {
            setLikedPosts([])
            return
          }
          const { data: likedPostData, error: likedPostError } = await supabase.from("posts").select("*").in("id", likedPostsId)
          if (likedPostError) throw likedPostError
          // console.log(likedPostData)
          setLikedPosts(likedPostData)
        } catch (error) {
          setError(error)
        }
      }



    return (
        <AuthContext.Provider value={{ user, signInWithGitHub, signOut, signInWithGoogle, signUpUser, signInUser, fetchProfile, profile, loading, error, fetchCount, followersCount, followingCount, fetchPost, fetchCommunity,post,community,fetchLikedPosts,likedPosts }}>{children}</AuthContext.Provider>
    )

}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("UseAuth must be used within the Authprovider")
    }
    return context
}