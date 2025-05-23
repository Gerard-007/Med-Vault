import React from 'react';
import HealthRecordHeader from '../healthRecordHeader/HealthRecordHeader';
import GlobeImageBackground from '../../assets/images/portrait-3d-male-doctor.jpg';
import { Link } from 'react-router-dom';

export default function HealthRecordHeroSection() {
  return (
    <section className="relative flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden">
      {/* Header */}
      <HealthRecordHeader />

      {/* Background Blobs */}
      <div className="absolute -top-24 -left-24 w-72 h-72 sm:w-96 sm:h-96 bg-blue-300 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute -bottom-32 -right-16 w-60 h-60 sm:w-80 sm:h-80 bg-blue-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-20 py-20 sm:py-24 flex flex-col items-center justify-center gap-12">
        
        {/* Text Content */}
        <div className="text-center max-w-3xl space-y-6 sm:space-y-8">
          <span className="inline-block bg-blue-200 text-blue-800 text-xs sm:text-sm font-semibold px-4 py-1.5 sm:px-5 sm:py-2 rounded-full shadow-md">
            {`Trusted by 150+ Providers`}
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-gray-900">
      {`Everyone`} <span className="text-blue-600">{`Values Privacy`} </span><br className="hidden sm:block" />
     {` Your Data Stays Secure `} 
      {/* <span className="text-blue-600">MedValut</span> */}
    </h1>

    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed px-2 sm:px-0">
      {`At MedValut, your health data is safeguarded.`}<br />
     {` We equip providers with fast, secure, and intuitive tools to deliver compassionate care.`}
    </p>


          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button className="bg-blue-600 text-white font-semibold px-6 py-3 sm:px-8 sm:py-4 rounded-xl shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out text-sm sm:text-base"
            >
              <Link to={'/usertypeonboarding'} >
              {`Get Started`}
              </Link>
            </button>
            <button className="border-2 border-blue-600 text-blue-600 font-semibold px-6 py-3 sm:px-8 sm:py-4 rounded-xl hover:bg-blue-100 transition duration-300 ease-in-out text-sm sm:text-base">
              {`Learn More`}
            </button>
          </div>
        </div>
      </div>

      {/* Decorative Wave */}
      <svg
        className="absolute bottom-0 left-0 w-full opacity-20"
        viewBox="0 0 1440 320"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#eff6ff"
          d="M0,224L48,202.7C96,181,192,139,288,117.3C384,96,480,96,576,106.7C672,117,768,139,864,160C960,181,1056,203,1152,208C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
      </svg>
    </section>
  );
}
