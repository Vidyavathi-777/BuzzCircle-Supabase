import React from 'react'
import CommunityDisplay from '../components/CommunityDisplay'
import { useParams } from 'react-router'

const CommunityPage = () => {
    const{id} = useParams()
  return (
    <div>
      <CommunityDisplay communityId={parseInt(id)} />
    </div>
  )
}

export default CommunityPage
