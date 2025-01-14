import React from 'react'
import ShopNow from '../components/User/Shop'
import { SiteHeader } from '../components/ui/header'
import { SiteFooter } from '../components/ui/footer'
function ShopPage() {
  return (
    <div>
       <SiteHeader/>
       <ShopNow/>
       <SiteFooter/>
    </div>
  )
}

export default ShopPage