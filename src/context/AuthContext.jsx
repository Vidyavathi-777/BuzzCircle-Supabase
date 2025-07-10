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

    const signInWithGitHub = () =>{
        supabase.auth.signInWithOAuth({provider: 'github'})
    }

    const signOut = () => {
        supabase.auth.signOut()
    }

    return (
        <AuthContext.Provider value={{user,signInWithGitHub,signOut}}>{children}</AuthContext.Provider>
    )

}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if(context === undefined){
        throw new Error("UseAuth must be used within the Authprovider")
    }
    return context
}