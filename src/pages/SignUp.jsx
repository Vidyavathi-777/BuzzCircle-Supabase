import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate,Link } from 'react-router'

const SignUp = () => {
    const [name,setName] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [error,setError] = useState(null)
    const [loading,setLoading] = useState(false)
    const navigate = useNavigate()

    const {signInWithGoogle,signInWithGitHub,signUpUser} = useAuth()

    const handleSignUp = async (e) =>{
        e.preventDefault()
        setLoading(true)
        setError(null)
        try{
            const res = await signUpUser(email,password,name)
            if (res.success){
                navigate("/")
            }else{
                setError(res.error)
            }
        }catch(err){
            setError('Something went wrong , Try again')
        }finally{
            setLoading(false)
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center text-black  px-4'>
            <div className='w-full max-w-md space-y-6'>

                <h2 className='text-2xl font-bold text-center'>Sign Up Account</h2>
                <p className='text-gray-400 text-center'>Enter Your personal data to create your account</p>
                {/* o auth buttons */}
                <div className='flex space-x-4 justify-center'>
                    <button className='flex-1 border border-black/50 py-2 rounded-lg hover:bg-white/10 transition' onClick={signInWithGoogle} >
                        <span className='flex items-center justify-center gap-2'>
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className='h-5 w-5' alt="" />
                            Google
                        </span>
                    </button>
                    <button className='flex-1 border border-black/50 py-2 rounded-lg hover:bg-white/10 transition' onClick={signInWithGitHub}>
                        <span className='flex items-center justify-center gap-2'>
                            <img src="https://www.svgrepo.com/show/512317/github-142.svg" className='h-5 2-5 invert' alt="" />
                            GitHub
                        </span>
                    </button>
                </div>
                <div className='flex items-center justify-center text-gray-500'>
                    <hr className='w-full border-white/10'/>
                    <span className='px-2 text-sm'>or</span>
                    <hr className='w-full border-white/10'/>
                </div>
                {/* sig in form */}
                <form onSubmit={handleSignUp} className='space-y-4'>
                    <div >
                        <label htmlFor="" className='block text-sm mb-1'>Name</label>
                        <input  value={name} onChange={(e) => setName(e.target.value)}
                        className='w-full p-2 bg-white border border-black/50 rounded'
                        type="text" required placeholder='Your Name'  />
                    </div>
                    <div >
                        <label htmlFor="" className='block text-sm mb-1'>Email</label>
                        <input 
                        placeholder='Your Email' value={email} onChange={(e) => setEmail(e.target.value)}
                        className='w-full p-2 bg-white border border-black/50 rounded'
                        type="email" name="email" id="email" required />
                    </div>
                    <div >
                        <label htmlFor="" className='block text-sm mb-1'>Password</label>
                        <input 
                        placeholder='Your password' value={password} onChange={(e)=> setPassword(e.target.value)}
                        className='w-full p-2 bg-white border border-black/50 rounded'
                        type="password" name="password" id="password" required/>
                    </div>
                    <button type='submit' className='w-full bg-purple-400 text-black py-2 rounded font-semibold hover:bg-gray-200 transition'>
                        {loading ? 'Signing Up.....' : "Sign Up"}
                    </button>
                    {error && <p className='text-red-600 text-center pt-4'>{error}</p>}
                </form>
                <p className='text-center text-m text-gray-400'>Already have an account?{" "}
                    <Link to={"/signin"} className='text-black underline'>Sign In</Link>
                </p>
            </div>
        </div>
    )
}

export default SignUp
