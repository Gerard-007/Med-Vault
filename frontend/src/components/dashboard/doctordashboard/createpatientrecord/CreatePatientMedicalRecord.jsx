import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreatePatientMedicalRecord = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    dateOfBirth: '',
    gender: '',
    medicalHistory: '',
    diagnosis: '',
    medications: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.patientName.trim()) newErrors.patientName = 'Patient name is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    else if (new Date(formData.dateOfBirth) > new Date())
      newErrors.dateOfBirth = 'Date of birth cannot be in the future';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.diagnosis.trim()) newErrors.diagnosis = 'Diagnosis is required';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    setIsSubmitting(true);
    setApiError('');

    try {
      const response = await axios.post(
        'http://your-backend-api/api/medical-records',
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      if (response.data.success) navigate('/dashboard');
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to save medical record');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="flex h-screen">
      {/* Left side - video background with overlay */}
      <div className="w-1/2 relative hidden md:block">
        <video
          autoPlay
          loop
          muted
          className="absolute inset-0 w-full h-full object-cover brightness-75"
          src="https://www.w3schools.com/howto/rain.mp4" // example video, replace with your own
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white px-12">
          <h1 className="text-5xl font-extrabold mb-4 leading-tight drop-shadow-lg">
            {`Create Patient Medical Records`}
          </h1>
          <p className="text-xl max-w-lg drop-shadow-md">
            Seamlessly add and manage patient information in one place. Keep your records organized and accessible.
          </p>
        </div>
      </div>
      {/* Right side - form container */}
      <div className="w-full md:w-1/2 bg-white flex flex-col justify-start px-12 py-16 overflow-auto">
        {/* Sticky header with submit button */}
        <header className="sticky top-0 bg-white z-10 flex items-center justify-between border-b border-gray-200 pb-4 mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            New Medical Record
          </h2>
          <button
            type="submit"
            form="medicalRecordForm"
            disabled={isSubmitting}
            className={`rounded-full px-6 py-3 bg-indigo-600 text-white font-semibold shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition ${
              isSubmitting ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Saving...' : 'Save Record'}
          </button>
        </header>

        {apiError && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded shadow-sm font-medium">
            {apiError}
          </div>
        )}

        <form
          id="medicalRecordForm"
          onSubmit={handleSubmit}
          noValidate
          className="space-y-8"
        >
          {/* Patient Name */}
          <div>
            <label htmlFor="patientName" className="block text-gray-700 font-semibold mb-2">
              Patient Name <span className="text-red-600">*</span>
            </label>
            <input
              id="patientName"
              name="patientName"
              type="text"
              value={formData.patientName}
              onChange={handleChange}
              placeholder="John Doe"
              aria-invalid={errors.patientName ? 'true' : 'false'}
              aria-describedby={errors.patientName ? 'patientName-error' : undefined}
              className={`w-full border rounded-md px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                errors.patientName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.patientName && (
              <p id="patientName-error" className="mt-1 text-sm text-red-600">
                {errors.patientName}
              </p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label htmlFor="dateOfBirth" className="block text-gray-700 font-semibold mb-2">
              Date of Birth <span className="text-red-600">*</span>
            </label>
            <input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              aria-invalid={errors.dateOfBirth ? 'true' : 'false'}
              aria-describedby={errors.dateOfBirth ? 'dateOfBirth-error' : undefined}
              className={`w-full border rounded-md px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
              }`}
              max={new Date().toISOString().split('T')[0]} // max today to prevent future date
            />
            {errors.dateOfBirth && (
              <p id="dateOfBirth-error" className="mt-1 text-sm text-red-600">
                {errors.dateOfBirth}
              </p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label htmlFor="gender" className="block text-gray-700 font-semibold mb-2">
              Gender <span className="text-red-600">*</span>
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              aria-invalid={errors.gender ? 'true' : 'false'}
              aria-describedby={errors.gender ? 'gender-error' : undefined}
              className={`w-full border rounded-md px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer transition ${
                errors.gender ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="" disabled>
                Select Gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && (
              <p id="gender-error" className="mt-1 text-sm text-red-600">
                {errors.gender}
              </p>
            )}
          </div>

          {/* Medical History */}
          <div>
            <label htmlFor="medicalHistory" className="block text-gray-700 font-semibold mb-2">
              Medical History
            </label>
            <textarea
              id="medicalHistory"
              name="medicalHistory"
              rows="4"
              value={formData.medicalHistory}
              onChange={handleChange}
              placeholder="Details about past illnesses, surgeries, etc."
              className="w-full border border-gray-300 rounded-md px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-y"
            />
          </div>

          {/* Diagnosis */}
          <div>
            <label htmlFor="diagnosis" className="block text-gray-700 font-semibold mb-2">
              Diagnosis <span className="text-red-600">*</span>
            </label>
            <textarea
              id="diagnosis"
              name="diagnosis"
              rows="4"
              value={formData.diagnosis}
              onChange={handleChange}
              placeholder="Current diagnosis details"
              aria-invalid={errors.diagnosis ? 'true' : 'false'}
              aria-describedby={errors.diagnosis ? 'diagnosis-error' : undefined}
              className={`w-full border rounded-md px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-y ${
                errors.diagnosis ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.diagnosis && (
              <p id="diagnosis-error" className="mt-1 text-sm text-red-600">
                {errors.diagnosis}
              </p>
            )}
          </div>

          {/* Medications */}
          <div>
            <label htmlFor="medications" className="block text-gray-700 font-semibold mb-2">
              Medications
            </label>
            <textarea
              id="medications"
              name="medications"
              rows="3"
              value={formData.medications}
              onChange={handleChange}
              placeholder="Current medications"
              className="w-full border border-gray-300 rounded-md px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-y"
            />
          </div>

          {/* Additional Notes */}
          <div>
            <label htmlFor="notes" className="block text-gray-700 font-semibold mb-2">
              Additional Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows="3"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any additional information"
              className="w-full border border-gray-300 rounded-md px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-y"
            />
          </div>

          {/* Cancel button at the bottom for extra navigation */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/doctor/doctordashboard')}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md font-semibold hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePatientMedicalRecord;
