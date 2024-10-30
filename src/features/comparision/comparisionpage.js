import React, { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ComparisonPage = () => {
  const [brand1, setBrand1] = useState('');
  const [brand2, setBrand2] = useState('');
  const [data, setData] = useState(null);

  // Placeholder function for fetching comparison data
  const fetchComparisonData = () => {
    // Mock data; replace this with your API fetch later
    setData({
      labels: ['5 Sep', '15 Sep', '25 Sep', '5 Oct'],
      datasets: [
        {
          label: brand1,
          data: [40, 60, 55, 70],
          borderColor: 'rgb(34, 197, 94)', // green
          backgroundColor: 'rgba(34, 197, 94, 0.2)',
        },
        {
          label: brand2,
          data: [30, 50, 65, 60],
          borderColor: 'rgb(59, 130, 246)', // blue
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
        },
      ],
    });
  };

  const handleCompare = () => {
    fetchComparisonData(); // This will be an API call in the future
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex flex-col flex-1 bg-gray-100">
        {/* Header */}
        <Header />

        <div className="p-6">
          <h1 className="text-2xl font-semibold mb-4">Comparison</h1>

          <div className="flex space-x-4 mb-6">
            <input
              type="text"
              placeholder="Enter first brand"
              value={brand1}
              onChange={(e) => setBrand1(e.target.value)}
              className="px-4 py-2 border rounded-lg w-1/2"
            />
            <input
              type="text"
              placeholder="Enter second brand"
              value={brand2}
              onChange={(e) => setBrand2(e.target.value)}
              className="px-4 py-2 border rounded-lg w-1/2"
            />
            <button
              onClick={handleCompare}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Compare
            </button>
          </div>

          {/* Comparison Table */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{brand1 || 'Brand 1'}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{brand2 || 'Brand 2'}</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Total Mentions</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">27K</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">16K</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Instagram Mentions</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">5K</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3K</td>
                </tr>
                {/* Add more rows as needed */}
              </tbody>
            </table>
          </div>

          {/* Comparison Chart */}
          {data && (
            <div className="bg-white rounded-lg shadow p-6">
              <Line data={data} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
            </div>
          )}
        </div>
      </div>
    </div>  
  );
};

export default ComparisonPage;
