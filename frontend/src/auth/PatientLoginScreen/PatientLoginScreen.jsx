import React from 'react'
import PaitentLoginImage from "../../assets/images/freepik__the-style-is-candid-image-photography-with-natural__1502.jpeg"

const PatientLoginScreen = () => {
  return (
     <div className="flex h-screen font-sans bg-gray-50">
              {/* Left image panel */}
              <div className="w-1/2 hidden md:block">
                <img
                  src={PaitentLoginImage} // Replace with your image
                  alt="Signup Visual"
                 className="object-cover w-full h-full"
                />
              </div>
        
              {/* Right signup form */}
              <div className="w-full md:w-1/2 flex items-center justify-center px-8 bg-white">
                <form className="w-full max-w-md   rounded-2xl p-8 space-y-6">
                  {/* Logo + Heading */}
                  <div>
                    <h1 className="text-xl font-bold text-[#0061ff] tracking-wide">MedValut</h1>
                    <h2 className="mt-4 text-3xl font-bold text-gray-900">Create your account</h2>
                    <p className="text-sm text-gray-500 mt-1">Sign up to get started</p>
                  </div>
      
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0061ff] transition duration-200"
                    />
                  </div>
        
                  
        
                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0061ff] transition duration-200"
                    />
                  </div>
        
                  {/* Sign Up Button */}
                  <button
                    type="submit"
                    className="w-full bg-[#0061ff] hover:bg-[#004ecc] text-white py-2 rounded-lg text-sm font-semibold tracking-wide transition duration-200"
                  >
                    Sign Up
                  </button>
        
                  {/* Already have an account */}
                  <div className="text-sm text-center text-gray-600">
                    Already have an account?{' '}
                    <a href="/patient/login" className="text-[#0061ff] font-medium hover:underline px-3 py-3">
                      Log in
                    </a>
                  </div>
                </form>
              </div>
        </div>
  )
}

export default PatientLoginScreen
