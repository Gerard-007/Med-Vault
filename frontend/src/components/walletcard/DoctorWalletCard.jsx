import React, { useState } from 'react';
import { FiCopy, FiCheck, FiEye, FiEyeOff } from 'react-icons/fi';

const DoctorWalletCard = () => {
  const fullAddress = '0x3F18A7B2F97DEFC2AA84A22C39F19A91C5D';
  const [showFull, setShowFull] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggleAddress = () => setShowFull(!showFull);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative w-full h-60 bg-gradient-to-r from-blue-800 via-blue-900 to-gray-900 text-white rounded-xl p-6 shadow-2xl overflow-hidden transform transition-transform">

      {/* Holographic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent opacity-20 pointer-events-none"></div>

      {/* Chip Design */}
      <div className="absolute top-6 left-6 w-25 h-10 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-md shadow-inner flex items-center justify-center">
        <div className="w-20 h-8 bg-gray-700 rounded-sm"></div>
      </div>

      {/* Blockchain Wallet Badge */}
      <div className="absolute right-4 top-4 text-yellow-300  bg-opacity-10 rounded-full px-3 py-1 text-xs font-semibold tracking-wide">
       SUI Wallet
      </div>

      {/* Card Details */}
      <div className="mt-11">
        <h3 className="text-xl font-semibold tracking-tight">Doctor Wallet</h3>
        <p className="text-3xl font-bold mt-4">$100.21</p>
        <p className="text-sm mt-7 text-blue-200">Sui Wallet Address:</p>

        <div className="flex items-center space-x-2 mb-1">
          <p className="text-sm font-mono text-blue-300 truncate max-w-[200px]">
            {showFull ? fullAddress : `${fullAddress.slice(0, 8)}...${fullAddress.slice(-6)}`}
          </p>

          {/* Toggle visibility */}
          <button
            onClick={toggleAddress}
            className="text-blue-200 hover:text-white transition text-lg"
            title={showFull ? 'Hide' : 'Show full'}
          >
            {showFull ? <FiEyeOff /> : <FiEye />}
          </button>

          {/* Copy Button */}
          <button
            onClick={copyToClipboard}
            className="text-blue-200 hover:text-white transition text-lg"
            title="Copy"
          >
            {copied ? <FiCheck className="text-green-400" /> : <FiCopy />}
          </button>
        </div>
      </div>

      {/* Card Number Styling */}
      <div className="absolute bottom-15 left-6 text-sm font-mono text-gray-300 tracking-wider">
        **** **** **** 3921
      </div>

      {/* Card Footer Details */}
      <div className="absolute bottom-1 left-6 text-xs text-blue-200">
        <p>Valid Thru: 12/28</p>
      </div>

      {/* Action Button */}
      <button className="absolute bottom-6 right-6 bg-blue-500 bg-opacity-80 hover:bg-opacity-100 transition rounded-lg px-4 py-2 text-sm font-semibold text-white">
        View transactions
      </button>
    </div>
  );
};

export default DoctorWalletCard;
