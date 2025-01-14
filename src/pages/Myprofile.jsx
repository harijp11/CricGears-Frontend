import React from 'react'
import Myprofile from '../components/User/profile/viewProfile'
import { SiteFooter } from '../components/ui/footer'
import { SiteHeader } from '../components/ui/header'

function MyProfile() {
  return (
    <div>
      <SiteHeader/>
      <Myprofile/>
    </div>
  )
}

export default MyProfile