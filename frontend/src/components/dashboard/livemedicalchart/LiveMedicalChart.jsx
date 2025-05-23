// components/LiveMedicalChart.jsx
import React, { useEffect, useRef, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const generateMockData = () => ({
  time: new Date().toLocaleTimeString(),
  value: Math.floor(Math.random() * 100),
})

const LiveMedicalChart = () => {
  const [data, setData] = useState([]);
  const intervalRef = useRef();

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setData(prev => {
        const newData = [...prev, generateMockData()];
        return newData.slice(-10); // keep last 10 data points
      });
    }, 2000); // simulate every 2 seconds

    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" fontSize={12} />
        <YAxis fontSize={12} />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={3} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LiveMedicalChart;
// This component generates a live-updating line chart using Recharts.
// The chart displays random data points that update every 2 seconds.