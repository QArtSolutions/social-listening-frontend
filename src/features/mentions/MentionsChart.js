import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { useBrand } from '../../contexts/BrandContext';
import axios from 'axios';

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
  const { brand } = useBrand();
  const [selectedRange, setSelectedRange] = useState("7d"); // Default to Last 30 Days
  const [startDate, setStartDate] = useState(new Date());
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [cursor, setCursor] = useState(null); // State to track cursor for pagination

  useEffect(() => {
    const fetchMentionsData = async () => {
      try {
        let allMentions = [];
        let currentCursor = cursor;

        do {
          const response = await axios.get('https://twitter-pack.p.rapidapi.com/search/tweet', {
            headers: {
              'x-rapidapi-key': '6009977b2amsh2d3f65eafe06fd2p12ec3fjsnc366b1c8aac1',
              'x-rapidapi-host': 'twitter-pack.p.rapidapi.com'
            },
            params: {
              query: brand,
              cursor: currentCursor, // Pass the cursor to fetch additional pages
            }
          });

          const mentions = response.data.data?.data || [];
          allMentions = [...allMentions, ...mentions];

          // Update the cursor for the next page
          currentCursor = response.data.cursor || null;

        } while (currentCursor); // Continue fetching as long as there's a cursor

        processMentionsData(allMentions); // Process all accumulated mentions
      } catch (error) {
        console.error('Error fetching mentions:', error);
      }
    };

    fetchMentionsData();
  }, [brand, selectedRange, startDate]);

  const processMentionsData = (mentions) => {
    const labels = generateLabels();
    const mentionsPerDate = labels.map(label => {
      const count = mentions.filter(mention => format(new Date(mention.legacy.created_at), 'd MMM') === label).length;
      return count;
    });

    setChartData({
      labels,
      datasets: [
        {
          label: `${brand} Mentions`,
          data: mentionsPerDate,
          borderColor: '#4caf50',
          fill: false,
        }
      ]
    });
  };

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
