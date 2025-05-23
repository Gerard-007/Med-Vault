import React from 'react';
import DoctorSecondImage from '../../assets/images/portrait-3d-male-doctor.jpg'; 

const DoctorLoginScreen = () => {
  return (
    <div className="flex h-screen font-sans bg-gray-100">
      {/* Left side (Image Panel) */}
      <div className="w-1/2 hidden md:block">
        <img
          src={DoctorSecondImage}
          alt="Doctor Illustration"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right side (Login Form) */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white px-6 py-12">
        <form className="w-full max-w-sm space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
          <p className="text-lg text-gray-400">Sign in to continue</p>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0061ff]"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0061ff]"
            />
          </div>

          {/* Forgot password */}
          <div className="text-right">
            <a href="#" className="text-sm text-[#0061ff] font-medium hover:underline">
              Forgot password?
            </a>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#0061ff] hover:bg-[#004ecc] text-white py-2 rounded-lg text-sm font-semibold transition"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default DoctorLoginScreen;
