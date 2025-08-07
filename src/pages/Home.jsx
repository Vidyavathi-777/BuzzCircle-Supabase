import React from 'react'
import PostList from '../components/PostList'
import { Helmet } from 'react-helmet-async'
import SEO from '../components/SEO'

const Home = () => {
  return (
    <>
    {/* <Helmet>
      <title>BuzzCircle - Connect and Share</title>
      <meta name='description' content='Join BuzzCircle, a new Social media platform to connect,share and engage'/>
    </Helmet> */}
    <SEO
      title="Connect and Share"
      description="Join BuzzCircle, a new social media platform to connect,share and engage"
      url="https://buzz-circle-supabase.vercel.app/"
    />
    <div className="pt-10">
      <h2 className="text-6xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        Recent Posts
      </h2>
      <div>
        <PostList />
      </div>
    </div>
    </>
  )
}

export default Home
