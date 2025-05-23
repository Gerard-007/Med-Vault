import React, { useState } from 'react';
import { FiMail, FiLock, FiUser, FiPhone } from 'react-icons/fi';
import PatientSignupImage from '../../assets/images/freepik__the-style-is-candid-image-photography-with-natural__1502.jpeg';
import { Link, useNavigate } from 'react-router-dom';

const PatientSignupScreen = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
  });
  const navigate = useNavigate();

  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Enter a valid email';
    }
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    if (!formData.password || formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length) {
      setFormErrors(errors);
      return;
    }

    // handle registration logic here...
    // alert('Patient account created!');
    navigate('/patient/patientdashboard')
    
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section */}
      <div className="hidden lg:block w-1/2 relative">
        <img
          src={PatientSignupImage}
          alt="Patient Illustration"
          className="w-full h-full object-cover absolute inset-0"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white p-10">
          <h1 className="text-4xl font-bold mb-4 text-center">Welcome to MedValut</h1>
          <p className="text-lg text-center max-w-md">Manage your health and connect with professionals.</p>
          <div className="mt-8 space-y-4">
            <div className="flex items-center space-x-3">
              <FiUser className="text-xl" /><span>Register and build your profile</span>
            </div>
            <div className="flex items-center space-x-3">
              <FiPhone className="text-xl" /><span>Access your medical history</span>
            </div>
            <div className="flex items-center space-x-3">
              <FiMail className="text-xl" /><span>Contact healthcare providers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            {/* <h1 className="text-xl font-bold text-blue-600">MedValut</h1> */}
            <h2 className="text-3xl font-bold">Patient Registration</h2>
            <p className="text-gray-600 mt-1">Sign up to manage your medical care</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <div className="relative mt-1">
                <FiUser className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="text"
                  name="fullName"
                  placeholder="Mr. Christian Daniel"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-3 py-2 rounded-xl border ${formErrors.fullName ? 'border-red-500' : 'border-gray-300'} focus:ring-blue-500 focus:outline-none`}
                />
              </div>
              {formErrors.fullName && <p className="text-sm text-red-500 mt-1">{formErrors.fullName}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <div className="relative mt-1">
                <FiMail className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-3 py-2 rounded-xl border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} focus:ring-blue-500 focus:outline-none`}
                />
              </div>
              {formErrors.email && <p className="text-sm text-red-500 mt-1">{formErrors.email}</p>}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <div className="relative mt-1">
                <FiPhone className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  placeholder="+1 234 567 8901"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-3 py-2 rounded-xl border ${formErrors.phone ? 'border-red-500' : 'border-gray-300'} focus:ring-blue-500 focus:outline-none`}
                />
              </div>
              {formErrors.phone && <p className="text-sm text-red-500 mt-1">{formErrors.phone}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative mt-1">
                <FiLock className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-3 py-2 rounded-xl border ${formErrors.password ? 'border-red-500' : 'border-gray-300'} focus:ring-blue-500 focus:outline-none`}
                />
              </div>
              {formErrors.password && <p className="text-sm text-red-500 mt-1">{formErrors.password}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 transition"
            >
              Sign Up
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/patient-login" className="text-blue-600 font-medium hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientSignupScreen;
