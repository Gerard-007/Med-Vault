import React, { useState } from 'react';
import DoctorSideBar from './doctorsidebar/DoctorSideBar';
import { FaBell, FaSearch, FaUser, FaBars, FaTimes } from 'react-icons/fa';
import { AiOutlineLogout } from 'react-icons/ai';
import LiveMedicalChart from '../livemedicalchart/LiveMedicalChart';
import DoctorWalletCard from '../../walletcard/DoctorWalletCard';

const DoctorDashboard = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-gray-50 relative">
      {/* Mobile Hamburger */}
      <div className="md:hidden bg-white shadow px-4 py-3 flex justify-between items-center sticky top-0 z-30">
        <button onClick={() => setSidebarOpen(true)}>
          <FaBars className="text-xl text-gray-700" />
        </button>
        <h1 className="text-lg font-bold text-gray-800">Hey Dr. Sarah</h1>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64  bg-white  shadow-md z-40 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0 md:w-64`}
      >
        {/* Close Icon for Mobile */}
        <div className="md:hidden flex justify-end p-4">
          <button onClick={() => setSidebarOpen(false)}>
            <FaTimes className="text-xl text-gray-500" />
          </button>
        </div>
        <DoctorSideBar />
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <header className="bg-white shadow px-6 py-4 sticky top-0 z-20 hidden md:flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div> 
            <h1 className="text-lg font-semibold text-gray-800">Hey Dr. Sarah</h1>
          </div>
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch
                className="text-gray-600 text-lg cursor-pointer hover:text-blue-600"
                onClick={() => setShowSearch(!showSearch)}
              />
              {showSearch && (
                <input
                  type="text"
                  placeholder="Search..."
                  className="absolute right-0 top-8 mt-2 w-64 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>

            {/* Notifications */}
            <div className="relative">
              <FaBell
                className="text-gray-600 text-lg cursor-pointer hover:text-blue-600"
                onClick={() => setShowNotifications(!showNotifications)}
              />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-md p-4 z-20">
                  <h4 className="font-semibold text-gray-800 mb-2">Notifications</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>📄 New patient record created</li>
                    <li>🕒 Appointment with Jane at 11:30 AM</li>
                    <li>🧪 Lab report is pending review</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <FaUser
                className="text-gray-600 text-lg cursor-pointer hover:text-blue-600"
                onClick={() => setShowProfile(!showProfile)}
              />
              {showProfile && (
                <div className="absolute right-0 mt-2 bg-white w-48 shadow-md rounded-lg overflow-hidden">
                  <div className="p-4 border-b">
                    <p className="font-semibold">Dr. Sarah Johnson</p>
                    <p className="text-xs text-gray-500">Licensed Practitioner</p>
                  </div>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 flex items-center gap-2">
                    <AiOutlineLogout className="text-sm" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Main Content */}
        <main className="p-6 space-y-8">
          <DoctorWalletCard />
          {/* Statistics Section */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white border-l-4 border-white rounded-lg p-6">
              <h2 className="text-lg font-bold text-gray-700">Total Patients</h2>
              <p className="text-2xl font-bold text-yellow-600 mt-2">120</p>
            </div>
            <div className="bg-white border-l-4 border-white rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-700">Appointments Today</h2>
              <p className="text-2xl font-bold text-black-600 mt-2">15</p>
            </div>
            <div className="bg-white border-l-4 border-white rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-700">Pending Reports</h2>
              <p className="text-2xl font-bold text-black-600 mt-2">8</p>
            </div>
          </section>

          {/* Chart Section */}
          <section className="bg-white rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Medical Data Analytics</h2>
            <div className="h-64 rounded-lg p-4">
              <LiveMedicalChart />
            </div>
          </section>

          {/* Recent Activity */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Appointments</h2>
              <ul className="space-y-4">
                <li className="flex justify-between items-center">
                  <span className="text-gray-700">John Doe</span>
                  <span className="text-black-600">10:00 AM</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-gray-700">Jane Smith</span>
                  <span className="text-black-600">11:30 AM</span>
                </li>
              </ul>
            </div>
            {/* You can add additional cards or components here */}
          </section>
        </main>
      </div>
    </div>
  );
};

export default DoctorDashboard;
