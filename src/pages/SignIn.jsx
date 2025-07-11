import React from 'react'
import { useAuth } from '../context/AuthContext'

const SignIn = () => {
    const {signInWithGoogle,signInWithGitHub} = useAuth()
    return (
        <div className='min-h-screen flex items-center justify-center bg-black text-white  px-4'>
            <div className='w-full max-w-md space-y-6'>

                <h2 className='text-2xl font-bold text-center'>Sign Up Account</h2>
                <p className='text-gray-400 text-center'>Enter Your personal data to create your account</p>
                {/* o auth buttons */}
                <div className='flex space-x-4 justify-center'>
                    <button className='flex-1 border border-white/10 py-2 rounded-lg hover:bg-white/10 transition' onClick={signInWithGoogle} >
                        <span className='flex items-center justify-center gap-2'>
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className='h-5 w-5' alt="" />
                            Google
                        </span>
                    </button>
                    <button className='flex-1 border border-white/10 py-2 rounded-lg hover:bg-white/10 transition' onClick={signInWithGitHub}>
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
                <form action="" className='space-y-4'>
                    <div >
                        <label htmlFor="" className='block text-sm mb-1'>Name</label>
                        <input 
                        className='w-full p-2 bg-gray-900 border border-white/10 rounded'
                        type="text" required placeholder='Your Name'  />
                    </div>
                    <div >
                        <label htmlFor="" className='block text-sm mb-1'>Email</label>
                        <input 
                        placeholder='Your Email'
                        className='w-full p-2 bg-gray-900 border border-white/10 rounded'
                        type="email" name="email" id="email" required />
                    </div>
                    <div >
                        <label htmlFor="" className='block text-sm mb-1'>Password</label>
                        <input 
                        placeholder='Your password'
                        className='w-full p-2 bg-gray-900 border border-white/10 rounded'
                        type="password" name="password" id="password" required/>
                    </div>
                    <button type='submit'>Sign In</button>
                </form>
                <p className='text-center text-m text-gray-400'>Don't have an account?{" "}
                    <a href="" className='text-white underline'>Sign up</a>
                </p>
            </div>
        </div>
    )
}

export default SignIn
