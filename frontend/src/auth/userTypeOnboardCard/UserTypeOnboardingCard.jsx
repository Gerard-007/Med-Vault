import React from 'react';

import PatientOnboardingImage from '../../assets/images/freepik__a-black-woman-23-years-old-dark-skin-curly-black-h__1504.jpeg';
import DoctorOnboardingImage from '../../assets/images/freepik__i-need-a-portrait-image-of-a-doctor-i-need-a-black__1499.jpeg';
import { useNavigate } from 'react-router-dom';

const UserTypeOnboardingCard = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
          Select Your Ideal Account
        </h2>
        <p className="mt-2 text-gray-600 text-base">
          Choose the role that best fits your healthcare journey
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl w-full">
        {/* Doctor Card */}
        <div
          onClick={() => navigate('/doctor/signup')}
          className="cursor-pointer bg-[#e0f2fe] hover:bg-[#bae6fd] transition-all rounded-xl p-6 flex flex-col justify-between h-[300px] group"
        >
          <div className="flex flex-col justify-between h-full">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                For Doctors
              </h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>✓ Manage patients and appointments</li>
                <li>✓ Write prescriptions and more</li>
                <li>✓ View full health records</li>
              </ul>
            </div>
            <div className="flex justify-between items-end mt-4">
              <img
                src={DoctorOnboardingImage}
                alt="Doctor"
                className="w-20 h-20 object-cover"
              />
              <div className="text-xl text-blue-700 group-hover:translate-x-1 transition">→</div>
            </div>
          </div>
        </div>

        {/* Patient Card */}
        <div
          onClick={() => navigate('/patient/signup')}
          className="cursor-pointer bg-[#dcfce7] hover:bg-[#bbf7d0] transition-all rounded-xl p-6 flex flex-col justify-between h-[300px] group"
        >
          <div className="flex flex-col justify-between h-full">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                For Patients
              </h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>✓ Book appointments with ease</li>
                <li>✓ Access your health records</li>
                <li>✓ Connect with your doctors</li>
              </ul>
            </div>
            <div className="flex justify-between items-end mt-4">
              <img
                src={PatientOnboardingImage}
                alt="Patient"
                className="w-20 h-20 object-cover"
              />
              <div className="text-xl text-green-700 group-hover:translate-x-1 transition">→</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserTypeOnboardingCard;
