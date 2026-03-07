import React from 'react'
import HeroSection from '../components/HeroSection'
import PartnersSlider from '../components/PartnersSlider'
import HowItWorksAndBestsellers from '../components/HowItWorksAndBestsellers'
import Testimonials from '../components/Testimonials'
import TrustEcosystem from '../components/TrustEcosystem'

const HomePage = () => {
  return (
    <div>
        <HeroSection    />
        <PartnersSlider />
        <HowItWorksAndBestsellers />
        <Testimonials/>
        <TrustEcosystem />
    </div>
  )
}

export default HomePage