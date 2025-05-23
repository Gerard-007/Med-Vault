import React from 'react'
import doctorImage from '../../assets/images/doctor-writing-about-routine-medical-checkup.jpg'
const AtHomeCareSection = () => {
  return (
    <section className="flex flex-col-reverse lg:flex-row items-center justify-between px-6 sm:px-12 lg:px-24 py-25 bg-white">
      
    {/* Left Text Content */}
    <div className="w-full lg:w-1/2 text-center lg:text-left space-y-6">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
        Enhance your at-home care for your patients.
      </h2>

      <p className="text-sm sm:text-base text-gray-700 leading-relaxed max-w-md mx-auto lg:mx-0">
        Manage the diagnostic care of your patients from your customized dashboard and have their lab samples taken at home with results sent to you within 24–72 hours.
      </p>

      <button className="mt-4 px-6 py-3 bg-blue-900 text-white font-medium rounded-md hover:bg-blue-800 transition">
        Sign up
      </button>
    </div>

    {/* Right Image */}
    <div className="w-full lg:w-1/2 mb-10 lg:mb-0 flex justify-center">
      <div className="relative">
        <img
          src={doctorImage}
          alt="Smiling doctor"
          className="rounded-xl w-64 sm:w-80 lg:w-[400px] object-cover"
        />
        <div className="absolute -z-10 top-4 left-4 w-full h-full bg-blue-500 rounded-xl transform rotate-6"></div>
      </div>
    </div>
  </section>
  )
}

export default AtHomeCareSection
