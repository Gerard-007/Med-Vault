import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiBriefcase, FiShield } from 'react-icons/fi';
import useUserAuthStore from '../../store/userAuthStore';
import DashboardCardImage from '../../assets/images/portrait-3d-male-doctor.jpg';
import Swal from 'sweetalert2';
import axios from 'axios';

const DoctorSignupScreen = () => {
  const { setUser, setToken, setError, setLoading, clearError, error, isLoading } = useUserAuthStore();
  const navigate = useNavigate();

  const [doctorFormData, setDoctorFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    specialization: '',
    licenseNumber: '',
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    clearError();
  }, [clearError]);

  const validateForm = () => {
    const errors = {};
    if (!doctorFormData.firstName.trim()) errors.firstName = 'First name is required';
    if (!doctorFormData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!doctorFormData.specialization.trim()) errors.specialization = 'Specialization is required';
    if (!doctorFormData.licenseNumber.trim()) errors.licenseNumber = 'License number is required';
    if (!doctorFormData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(doctorFormData.email)) {
      errors.email = 'Enter a valid email';
    }
    if (!doctorFormData.password) {
      errors.password = 'Password is required';
    } else if (doctorFormData.password.length < 8) {
      errors.password = 'Must be at least 8 characters';
    } else if (!/(?=.*[A-Z])/.test(doctorFormData.password)) {
      errors.password = 'Must contain uppercase letter';
    } else if (!/(?=.*[@$!%*?&])/.test(doctorFormData.password)) {
      errors.password = 'Must contain special character';
    }
    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDoctorFormData(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length) return setFormErrors(errors);

    try {
      setLoading(true);
      clearError();

      const response = await axios.post(
        'http://localhost:8080/doctor/register',
        doctorFormData,
        { headers: { 'Content-Type': 'application/json' } }
      );

      const { user, token } = response.data;
      setUser(user);
      setToken(token);

      Swal.fire({
        icon: 'success',
        title: 'Doctor Account Created!',
        text: 'You can now access your dashboard.',
        confirmButtonText: 'Continue',
      }).then(() => navigate('/doctor-dashboard'));
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong.';
      setError(msg);
      Swal.fire({ icon: 'error', title: 'Signup Failed', text: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section */}
      <div className="hidden lg:block w-1/2 relative">
        <img src={DashboardCardImage} alt="Signup Visual" className="w-full h-full object-cover absolute inset-0" />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white p-10">
          <h1 className="text-4xl font-bold mb-4 text-center">Join as a Doctor</h1>
          <p className="text-lg text-center max-w-md">Connect with patients, offer care, and grow your impact.</p>
          <div className="mt-8 space-y-4">
            <div className="flex items-center space-x-3">
              <FiUser className="text-xl" /><span>Create your doctor profile</span>
            </div>
            <div className="flex items-center space-x-3">
              <FiBriefcase className="text-xl" /><span>Offer consultations</span>
            </div>
            <div className="flex items-center space-x-3">
              <FiShield className="text-xl" /><span>Secure patient interactions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold">Doctor Signup</h2>
            <p className="text-gray-600 mt-1">Begin your journey on HealthValut</p>
          </div>

          {error && <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* First & Last Name */}
            <div className="grid grid-cols-2 gap-4">
              {['firstName', 'lastName'].map((field, idx) => (
                <div key={idx}>
                  <label className="block text-sm font-medium text-gray-700">{field === 'firstName' ? 'First Name' : 'Last Name'}</label>
                  <div className="relative mt-1">
                    <FiUser className="absolute top-3 left-3 text-gray-400" />
                    <input
                      type="text"
                      name={field}
                      placeholder={field === 'firstName' ? 'Jane' : 'Doe'}
                      value={doctorFormData[field]}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-3 py-2 rounded-xl border ${formErrors[field] ? 'border-red-500' : 'border-gray-300'} focus:ring-blue-500 focus:outline-none`}
                    />
                  </div>
                  {formErrors[field] && <p className="text-sm text-red-500 mt-1">{formErrors[field]}</p>}
                </div>
              ))}
            </div>

            {/* Specialization */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Specialization</label>
              <div className="relative mt-1">
                <FiBriefcase className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="text"
                  name="specialization"
                  placeholder="Cardiologist"
                  value={doctorFormData.specialization}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-3 py-2 rounded-xl border ${formErrors.specialization ? 'border-red-500' : 'border-gray-300'} focus:ring-blue-500 focus:outline-none`}
                />
              </div>
              {formErrors.specialization && <p className="text-sm text-red-500 mt-1">{formErrors.specialization}</p>}
            </div>

            {/* License Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Medical License Number</label>
              <div className="relative mt-1">
                <FiShield className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="text"
                  name="licenseNumber"
                  placeholder="DMC-12345"
                  value={doctorFormData.licenseNumber}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-3 py-2 rounded-xl border ${formErrors.licenseNumber ? 'border-red-500' : 'border-gray-300'} focus:ring-blue-500 focus:outline-none`}
                />
              </div>
              {formErrors.licenseNumber && <p className="text-sm text-red-500 mt-1">{formErrors.licenseNumber}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <div className="relative mt-1">
                <FiMail className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="doctor@example.com"
                  value={doctorFormData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-3 py-2 rounded-xl border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} focus:ring-blue-500 focus:outline-none`}
                />
              </div>
              {formErrors.email && <p className="text-sm text-red-500 mt-1">{formErrors.email}</p>}
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
                  value={doctorFormData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-3 py-2 rounded-xl border ${formErrors.password ? 'border-red-500' : 'border-gray-300'} focus:ring-blue-500 focus:outline-none`}
                />
              </div>
              {formErrors.password && <p className="text-sm text-red-500 mt-1">{formErrors.password}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-xl text-white font-semibold transition ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900'
              }`}
              onClick={()=>{window.location.href="/doctor/doctordashboard"}}
            >
              Create Account
              {/* {isLoading ? 'Creating...' : 'Create Doctor Account'} */}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/doctor-login" className="text-blue-600 font-medium hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorSignupScreen;
