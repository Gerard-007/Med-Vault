import React from 'react'
import UserTypeOnboardingCard from '../auth/userTypeOnboardCard/UserTypeOnboardingCard'
import DoctorSignupScreen from '../auth/DoctorSignupScreen/DoctorSignupScreen'
import HealthRecordHeroSection from '../components/healthRecordHeroSection/HealthRecordHeroSection'
import HealthRecordFeaturedCard from '../components/HealthRecordFeaturedCard/HealthRecordFeaturedCard'
import ContactCTA from '../components/contactCTA/ContactCTA'
import AtHomeCareSection from '../components/athomecaresection/AtHomeCareSection'
import CoreValuesSection from '../components/corevaluesection/CoreValuesSection'
const LandingPage = () => {
  return (
    <div>
      {/* <Signup/> */} 
     {/* <DoctorSignupScreen/> */}
      {/* <UserTypeOnboardingCard/> */}
      <HealthRecordHeroSection/>
      <AtHomeCareSection/>
      <CoreValuesSection/>  
      <HealthRecordFeaturedCard/>
      <ContactCTA/>
    
    
      
    </div>
  )
}

export default LandingPage
