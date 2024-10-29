import React, { useState, useEffect } from 'react';
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
import { addDays, subMonths, format } from 'date-fns';

ChartJS.register(LineElement, LinearScale, CategoryScale, PointElement, Tooltip, Legend);

const MentionsChart = () => {
  const [selectedRange, setSelectedRange] = useState("30d"); // Default to Last 30 Days
  const [startDate, setStartDate] = useState(new Date());
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  // Helper function to generate date labels based on the selected range
  const generateLabels = () => {
    const labels = [];
    const currentDate = new Date(startDate);

    if (selectedRange === "7d") {
      for (let i = 6; i >= 0; i--) {
        labels.push(format(addDays(currentDate, -i), 'd MMM'));
      }
    } else if (selectedRange === "30d") {
      for (let i = 29; i >= 0; i -= 5) {
        labels.push(format(addDays(currentDate, -i), 'd MMM'));
      }
    } else if (selectedRange === "3m") {
      for (let i = 2; i >= 0; i--) {
        labels.push(format(subMonths(currentDate, i), 'MMM yyyy'));
      }
    }
    return labels;
  };

  // Generate random data points (in a real app, replace with actual data fetching logic)
  const generateData = (numPoints) => {
    return Array.from({ length: numPoints }, () => Math.floor(Math.random() * 100) + 10);
  };

  // Update chart data based on the selected range
  useEffect(() => {
    const labels = generateLabels();
    const dataPoints = generateData(labels.length);

    setChartData({
      labels,
      datasets: [
        {
          label: `Data for ${selectedRange}`,
          data: dataPoints,
          fill: false,
          borderColor: '#007bff',
          tension: 0.1,
        },
      ],
    });
  }, [selectedRange, startDate]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true, type: 'linear' },
    },
  };

  return (
    <div className="mentions-chart-container">
      {/* Dropdown for range selection */}
      <div className="date-range-dropdown">
        <select
          value={selectedRange}
          onChange={(e) => setSelectedRange(e.target.value)}
          className="date-range-select"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="3m">Last 3 Months</option>
        </select>
      </div>
      
      {/* Chart */}
      <div className="chart-container">
        <Line data={chartData} options={options} width={400} height={200} />
      </div>
    </div>
  );
};

export default MentionsChart;



