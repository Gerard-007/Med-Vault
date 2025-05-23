import React, { useEffect, useMemo, useState } from 'react';
import { FiEye, FiEdit3, FiLock } from 'react-icons/fi';
import { HiOutlineUserAdd } from 'react-icons/hi';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
// import { Link, useNavigate } from 'react-router-dom';

const mockRecords = [
  {
    id: '1',
    name: 'Ebuka Okeke',
    dob: '1985-06-15',
    lastUpdated: '2025-05-01',
    diagnosis: 'Hypertension',
    notes: 'Patient requires regular checkups.',
    accessGranted: false,
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    dob: '1992-09-23',
    lastUpdated: '2025-04-25',
    diagnosis: 'Diabetes Type 2',
    notes: 'Monitoring blood sugar levels.',
    accessGranted: false,
  },
  {
    id: '3',
    name: 'Kimberly Smith',
    dob: '1978-11-02',
    lastUpdated: '2025-05-15',
    diagnosis: 'Asthma',
    notes: 'Prescribed inhaler twice a day.',
    accessGranted: true,
  },
  {
    id: '3',
    name: 'Kenneth Okeke',
    dob: '1978-11-02',
    lastUpdated: '2025-05-15',
    diagnosis: 'Asthma',
    notes: 'Prescribed inhaler twice a day.',
    accessGranted: true,
  },
  {
    id: '3',
    name: 'Ayomide Ogunleye',
    dob: '1978-11-02',
    lastUpdated: '2025-05-15',
    diagnosis: 'Asthma',
    notes: 'Prescribed inhaler twice a day.',
    accessGranted: false,
  },
  {
    id: '3',
    name: 'Bola Okafor',
    dob: '1978-11-02',
    lastUpdated: '2025-05-15',
    diagnosis: 'Asthma',
    notes: 'Prescribed inhaler twice a day.',
    accessGranted: false,
  },
];

const ActionButton = ({ icon: Icon, label, onClick, color }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1 text-sm font-semibold hover:underline transition text-${color}-600 hover:text-${color}-800`}
    aria-label={label}
  >
    <Icon className="w-4 h-4" />
    {label}
  </button>
);

const ViewRecords = () => {
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setRecords(mockRecords);
  }, []);

  const handleView = (id) => {
    const record = records.find((r) => r.id === id);
    setSelectedRecord(record);
  };


  const handleCloseModal = () => setSelectedRecord(null);
  const handleEdit = (id) => alert(`Editing record for patient ID: ${id}`);
  const handleRequestAccess = (id) => {
    navigate('/doctor/requestrecordaccess', { state: { recordId: id } });
  };


  const tableRows = useMemo(
    () =>
      records.map((record) => (
        <tr key={record.id} className="hover:bg-indigo-50 transition-all">
          <td className="px-6 py-4 font-medium text-gray-900">{record.name}</td>
          <td className="px-6 py-4 text-gray-700">{record.dob}</td>
          <td className="px-6 py-4 text-gray-700">{record.lastUpdated}</td>
          <td className="px-6 py-4">
            <div className="flex gap-4 justify-center">
              {record.accessGranted ? (
                <>
                  <ActionButton icon={FiEye} label="View" onClick={() => handleView(record.id)} color="indigo" />
                  <ActionButton icon={FiEdit3} label="Edit" onClick={() => handleEdit(record.id)} color="green" />
                </>
              ) : (
                <ActionButton icon={FiLock} label="Request Access" onClick={() => handleRequestAccess(record.id)} color="yellow" />
              )}
            </div>
          </td>
        </tr>
      )),
    [records]
  );

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-50 to-white">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Patient Records</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and access all patient records securely.</p>
        </div>
        <button
          onClick={() => {window.location.href='/doctor/createmedicalrecord'}}
          className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-900 text-white px-4 py-3 rounded-lg shadow transition"
        
        >
          <HiOutlineUserAdd className="w-5 h-5" />
         Add New Record
        </button>
      </div>

      {records.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center text-gray-500">
          <FiLock className="w-12 h-12 mb-2 text-gray-400" />
          <p className="text-lg font-semibold">No patient records found.</p>
          <p className="text-sm mt-1">You can add new records to get started.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="min-w-full h-[30vh] table-auto divide-y divide-gray-200">
            <thead className="bg-blue-700 text-white text-sm">
              <tr className='h-20'>
                <th className="px-6 py-3 text-left font-semibold tracking-wide">Patient Name</th>
                <th className="px-6 py-3 text-left font-semibold tracking-wide">Date of Birth</th>
                <th className="px-6 py-3 text-left font-semibold tracking-wide">Last Updated</th>
                <th className="px-6 py-3 text-center font-semibold tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">{tableRows}</tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <Dialog open={!!selectedRecord} onClose={handleCloseModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/20" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center py-4 ">
          <Dialog.Panel className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 relative">
            <button onClick={handleCloseModal} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
              <XMarkIcon className="w-5 h-5" />
            </button>
            {selectedRecord && !selectedRecord.accessGranted ? (
              <div className="text-center text-gray-500">
                <FiLock className="w-8 h-8 mx-auto mb-2" />
                <p>Access to this patient record is restricted.</p>
                <p className="text-sm">Please wait for the patient to grant access.</p>
              </div>
            ) : (
              selectedRecord && (
                <>
                  <Dialog.Title className="text-xl font-bold text-gray-800 mb-4">
                    Patient Details
                  </Dialog.Title>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p><span className="font-semibold">Name:</span> {selectedRecord.name}</p>
                    <p><span className="font-semibold">DOB:</span> {selectedRecord.dob}</p>
                    <p><span className="font-semibold">Last Updated:</span> {selectedRecord.lastUpdated}</p>
                    <p><span className="font-semibold">Diagnosis:</span> {selectedRecord.diagnosis}</p>
                    <p><span className="font-semibold">Notes:</span> {selectedRecord.notes}</p>
                  </div>
                </>
              )
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default ViewRecords;
