import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaWallet,
  FaRobot,
  FaComments,
  FaCalendarCheck,
  FaFileMedical,
  FaHistory,
  FaCog,
  FaSignOutAlt,
  FaPaypal
} from 'react-icons/fa';

const PatientSidebar = () => {
  const [activeItem, setActiveItem] = useState('dashboard');

  const menuItems = [
    { id: 'wallet', label: 'Wallet', icon: <FaWallet /> },
    { id: 'ai-doctor', label: 'AI Doctor', icon: <FaRobot />, path: '/medvalut/aidoctor' },
    { id: 'messages', label: 'Messages', icon: <FaComments /> },
    { id: 'appointment', label: 'Book Appointment', icon: <FaCalendarCheck />, path: '/patient/patientdashboard/bookappointment' },
    { id: 'results', label: 'Medical Results', icon: <FaFileMedical />, path: '/patient/patientdashboard/medicalresult'},
    { id: 'history', label: 'Record History', icon: <FaHistory /> },
    // { id: 'transactions', label: 'Transact', icon: <FaPaypal /> },
  ];

  return (
    <aside className="flex flex-col h-screen w-full md:w-64 bg-gray-900 text-white">
      {/* Logo / Header */}
      <div className="p-4 border-b border-gray-800 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="font-bold text-white">A</span>
        </div>
        <div>
          <h1 className="text-lg font-bold">Medvalut</h1>
          <p className="text-xs text-gray-400">Patient Dashboard</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <Link  to={item.path}>
          <button
            key={item.id}
            onClick={() => setActiveItem(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition ${
              activeItem === item.id
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <span className="text-base">{item.icon}</span>
            <span className="text-sm font-medium">{item.label}</span>
          </button>
          </Link>
        ))}
      </nav>

      {/* Profile / Settings */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
            AO
          </div>
          <div>
            <p className="text-sm font-semibold">Alexander Ovo</p>
            <p className="text-xs text-gray-400">Patient</p>
          </div>
        </div>

        <div className="space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-400 hover:bg-gray-800 hover:text-white rounded-md">
            <FaCog className="text-sm" />
            <span className="text-sm font-medium">Settings</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-red-900 hover:text-white rounded-md">
            <FaSignOutAlt className="text-sm" />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default PatientSidebar;
