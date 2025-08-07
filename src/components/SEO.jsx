import React from 'react'
import { Helmet } from 'react-helmet-async'

const SEO = ({title,description,url}) => {
    const siteName = "BuzzCircle"
    const fullTitle = title ?  `${title} | ${siteName} ` : siteName 
  return (
    <Helmet>
        <title>{fullTitle}</title>
        {description && <meta name="description" content={description} />}
        <meta property="og:title" content={fullTitle} />
        {description && <meta property="og:description" content={description} />}
        <meta property="og:type" content="website" />
        {url && <meta property="og:url" content={url} />}
        <link rel="canonical" href={url || "https://buzz-circle-supabase.vercel.app/"} /> 
    </Helmet>
  )
}

export default SEO
