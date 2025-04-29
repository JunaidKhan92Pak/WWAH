import Footer from '@/components/Footer';
import MobileNavbar from '@/components/MobileNavbar';
import Navbar from '@/components/Navbar';
import SuccessChances from '@/components/SuccessChances'
import React from 'react'

function Page() {
    return (
      <div>
        <MobileNavbar />
        <Navbar />
        <SuccessChances />
        <Footer />
        
      </div>
    );
}

export default Page