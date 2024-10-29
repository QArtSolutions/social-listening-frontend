import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Register necessary components for Chart.js
ChartJS.register(LineElement, LinearScale, CategoryScale, PointElement, Tooltip, Legend);

const MentionsChart = () => {
  const data = {
    labels: ['5 Sep', '15 Sep', '25 Sep', '5 Oct'],
    datasets: [
      {
        label: 'Raymond',
        data: [20, 70, 60, 75],
        fill: false,
        borderColor: '#007bff',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: { beginAtZero: true, type: 'linear' },
    },
  };

  return <Line data={data} options={options} />;
};

export default MentionsChart;
