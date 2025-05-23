import React, { useState } from 'react'
import PatientSidebar from '../../../components/dashboard/patientdashboard/patientsidebar/PatientSidebar'
import { AiOutlineLogout } from 'react-icons/ai';
import { FaBell, FaSearch, FaUser } from 'react-icons/fa';
import LiveMedicalChart from '../livemedicalchart/LiveMedicalChart';
import PatientWalletCard from '../../walletcard/PatientWalletCard';


const PatientDashboard = () => {
  const [showSearch, setShowSearch] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
  
    return (
      <div className="flex flex-col md:flex-row h-screen w-full bg-gray-50">
        {/* Sidebar */}
        <div className="md:w-64 h-screen">
         <PatientSidebar/>
        </div>
  
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Professional Header */}
          <header className="bg-white shadow px-6 py-4 sticky top-0 z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-lg font-bold text-gray-800">Alexander Ovo</h1>
              {/* <p className="text-sm text-gray-500">Here's your medical and blockchain dashboard overview.</p> */}
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
  
          {/* Main Dashboard */}
          <main className="p-6 space-y-8">
  
          <PatientWalletCard />
            {/* Statistics */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-blue-700 border-l-4 border-white  rounded-lg p-6">
                <h2 className="text-lg font-bold text-gray-400">Total Investment</h2>
                <p className="text-2xl font-bold text-white  mt-2">{`${"$"}500.00`}</p>
              </div>
              <div className="bg-blue-700 border-l-4 border-white rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-400">Doctor requests</h2>
                <p className="text-2xl font-bold text-white mt-2">15</p>
              </div>
              <div className="bg-blue-700 border-l-4 border-white  rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-400">Pending Result</h2>
                <p className="text-2xl font-bold text-white mt-2">8</p>
              </div>
            </section>

            {/* Chart Section */}
          <section className="bg-white rounded-lg  p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Medical Data Analytics</h2>
            <div className="h-64 bg-black-700 rounded-lg p-4">
              <LiveMedicalChart />
            </div>
          </section>
            {/* Activity & Wallet */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Appointments</h2>
                <ul className="space-y-4">
                  <li className="flex justify-between items-center">
                    <span className="text-gray-700">John Doe</span>
                    <span className="text-black-600 ">10:00 AM</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-gray-700">Jane Smith</span>
                    <span className="text-black-600 ">11:30 AM</span>
                  </li>
                </ul>
              </div>
              {/* The record history is supposed to be here  */}
            </section>
          </main>
        </div>
      </div>
    );
}

export default PatientDashboard
