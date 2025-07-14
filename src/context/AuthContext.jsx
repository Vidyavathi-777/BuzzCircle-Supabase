import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";


const AuthContext = createContext()

export const AuthProvider = ({children}) =>{
    const [user,setUser] = useState(null)

    useEffect(()=>{
        supabase.auth.getSession().then(({data:{session}}) =>{
            setUser(session?.user ?? null)
        })

        const {data:listener} = supabase.auth.onAuthStateChange((_,session) =>{
            setUser(session?.user ?? null)
        })
        return ()=>{
            listener.subscription.unsubscribe();
        }

    },[])

    const signUpUser = async(email,password,name) => {
        try{
            const {data,error} = await supabase.auth.signUp({
                email,password,
                options:{
                    data:{
                        name:name,
                    }
                }
            })
            if (error){
                console.log("Sign Up error:" , error.message)
                return{success:false,error:error.message}
            }
            return{success:true,data}
        }catch(error){
            return{ success:false,error:"An unexpected error occured"}
        }
    }

    const signInUser = async(email,password) =>{
        try{
            const {data,error} = await supabase.auth.signInWithPassword({email,password})
            if (error){
                console.log("Sign in error:",error.message)
                return {success:false,error:error.message}
            }
            return {success:true,data}
        }catch(error){
            return{ success:false,error:"An Unexpected error ocurred"}
        }
    }

    const signInWithGoogle=() =>{
        supabase.auth.signInWithOAuth({provider:'google'})

    }

    const signInWithGitHub = () =>{
        supabase.auth.signInWithOAuth({provider: 'github'})
    }

    const signOut = () => {
        supabase.auth.signOut()
    }

    return (
        <AuthContext.Provider value={{user,signInWithGitHub,signOut,signInWithGoogle,signUpUser,signInUser}}>{children}</AuthContext.Provider>
    )

}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if(context === undefined){
        throw new Error("UseAuth must be used within the Authprovider")
    }
    return context
}