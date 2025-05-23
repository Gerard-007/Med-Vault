import React from 'react'
import { FaBookMedical } from 'react-icons/fa';

const values = [
  {
    title: 'Excellence',
    description:
      'We believe in consistently striving for excellence in everything we do. Our commitment to excellence drives us to continuously innovate, refine, and improve, ensuring we always deliver our best work.',
    color: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    title: 'Empathy',
    description:
      'Our drive to create solutions that truly make a difference in people\'s lives is fueled by empathy. We are dedicated to empowering individuals to succeed and thrive in their professional journeys.',
    color: 'bg-yellow-50',
    iconColor: 'text-yellow-500',
  },
  {
    title: 'Execution',
    description:
      'We understand that ideas alone are not enough; it\'s consistent action and execution that drive our success. Therefore, we don\'t merely set ambitious goals, we actively pursue them.',
    color: 'bg-green-50',
    iconColor: 'text-green-600',
  },
];

const CoreValuesSection = () => {
  return (
    <section className="py-20 bg-white px-4 md:px-12">
      <div className="max-w-7xl mx-auto text-center mb-14">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Our Core Values
        </h2>
        <p className="text-lg text-gray-600">
          We hold the following in high regard
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {values.map((value, index) => (
          <div
            key={index}
            className={`rounded-xl p-9 shadow-md ${value.color} transition hover:shadow-lg`}
          >
            <FaBookMedical className={`w-7 h-7 mb-4 ${value.iconColor}`} />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {value.title}
            </h3>
            <p className="text-gray-600 text-sm">{value.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default CoreValuesSection
