import React, { useState } from 'react';
import { CalendarIcon, XIcon } from 'lucide-react';

const doctors = ['Dr. John Smith', 'Dr. Sarah Lee', 'Dr. Emily Brown'];
const hygieneOptions = ['None', 'Basic Cleaning', 'Deep Cleaning'];
const treatments = ['Filling', 'Extraction', 'Whitening'];
const durations = ['15 min', '30 min', '60 min'];

const BookAppointment = () => {
  const [doctor, setDoctor] = useState('');
  const [hygiene, setHygiene] = useState('');
  const [date, setDate] = useState('');
  const [from, setFrom] = useState('08:00 AM');
  const [to, setTo] = useState('08:30 AM');
  const [duration, setDuration] = useState('30 min');
  const [treatment, setTreatment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ doctor, hygiene, date, from, to, duration, treatment });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white rounded-xl shadow-md p-8 space-y-6"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Create Appointment</h2>
          <button type="button">
            <XIcon className="w-5 h-5 text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectField label="Doctor" value={doctor} onChange={setDoctor} options={doctors} />
          <SelectField label="Hygiene" value={hygiene} onChange={setHygiene} options={hygieneOptions} />
          <DateField label="Date" value={date} onChange={setDate} />
          <div className="grid grid-cols-2 gap-4">
            <SelectField label="From" value={from} onChange={setFrom} options={generateTimes()} />
            <SelectField label="To" value={to} onChange={setTo} options={generateTimes()} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
          <div className="flex rounded-full overflow-hidden border border-gray-300">
            {durations.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDuration(d)}
                className={`flex-1 py-2 text-sm font-medium transition-all duration-150 ${
                  duration === d
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white hover:bg-gray-100 text-gray-600'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <SelectField label="Treatment" value={treatment} onChange={setTreatment} options={treatments} />

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-md bg-emerald-700 text-white font-medium hover:bg-emerald-800"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

const SelectField = ({ label, value, onChange, options }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
    >
      <option value="">Select {label.toLowerCase()}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);
const DateField = ({ label, value, onChange }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div className="relative">
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm pr-10 focus:ring-emerald-500 focus:border-emerald-500"
      />
      <CalendarIcon className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
    </div>
  </div>
);

const generateTimes = () => {
  const times = [];
  for (let h = 8; h <= 18; h++) {
    ['00', '30'].forEach((m) => {
      const hour = h % 12 || 12;
      const suffix = h < 12 ? 'AM' : 'PM';
      times.push(`${hour}:${m} ${suffix}`);
    });
  }
  return times;
};

export default BookAppointment;
