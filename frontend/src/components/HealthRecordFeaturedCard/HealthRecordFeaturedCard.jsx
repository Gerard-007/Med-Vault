import React from 'react'
import { FaSyncAlt, FaPalette, FaSitemap, FaTools } from 'react-icons/fa';
import { motion } from 'framer-motion';

const features = [
  {
    id: 1,
    title: 'Data Centralization',
    description:
      'Bring all patient records into one place, making it quick and easy for providers to access complete health information when needed.',
    icon: <FaSyncAlt className="text-4xl text-gray-600" />,
    background: 'bg-gray-100',
  },
  {
    id: 2,
    title: 'Real-Time Data Integration',
    description:
      'Use live updates and notifications to help providers deliver timely care, while keeping patients informed about their health and appointments.',
    icon: <FaPalette className="text-4xl text-gray-600" />,
    background: 'bg-gray-100',
  },
  {
    id: 3,
    title: 'User-Centered Design',
    description:
      'Focus on creating simple, easy-to-use interfaces so both healthcare providers and patients can navigate the platform without hassle.',
    icon: <FaTools className="text-4xl text-white" />,
    background: 'bg-blue-700 text-white',
  },
  {
    id: 4,
    title: 'Streamlined Workflows',
    description:
      'Automate repetitive tasks to reduce the paperwork for providers, allowing them to spend more time focusing on patient care.',
    icon: <FaSitemap className="text-4xl text-gray-600" />,
    background: 'bg-gray-100',
  },
];

const HealthRecordFeaturedCard = () => {
  return (
    <section className="px-6 md:px-16 py-40 bg-white">

      <div>
        <h2 className="text-4xl font-bold text-center mb-8">Key Features</h2>
        <p className="text-lg text-center text-gray-600 max-w-3xl mx-auto mb-12">This is not the original content for this page </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-6 place-items-center">
        {features.map((feature, index) => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.6, ease: 'easeOut' }}
            whileHover={{ scale: 1.03 }}
            className={`rounded-xl p-8 flex flex-col gap-6 justify-between shadow-sm hover:shadow-md transition-transform min-h-[289px] max-w-[500px] w-full ${feature.background}`}
          >
            <div className="flex justify-between items-start">
              <div>{feature.icon}</div>
              <span
                className={`text-6xl font-bold ${
                  feature.background.includes('text-white') ? 'text-white/40' : 'text-gray-300'
                }`}
              >
                {String(feature.id).padStart(2, '0')}
              </span>
            </div>
            <h3 className="text-3xl font-bold">{feature.title}</h3>
            <p className="text-base leading-relaxed">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HealthRecordFeaturedCard;
