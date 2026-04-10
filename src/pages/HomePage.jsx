import React from 'react'
import HeroSection from '../components/HeroSection'
// import PartnersSlider from '../components/PartnersSlider'
import HowItWorksAndBestsellers from '../components/WhatWeDoAndHowItWorks'
import Testimonials from '../components/Testimonials'
import TrustEcosystem from '../components/TrustEcosystem'
import DocumentRibbon from '../components/DocumentRibbon'

const HomePage = () => {
  return (
    <div>
        <HeroSection    />
        <DocumentRibbon />
        {/* <PartnersSlider /> */}
        <HowItWorksAndBestsellers />
        <Testimonials/>
        <TrustEcosystem />
    </div>
  )
}

export default HomePage