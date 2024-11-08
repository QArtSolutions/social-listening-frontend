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
import { addDays, format } from 'date-fns';

ChartJS.register(LineElement, LinearScale, CategoryScale, PointElement, Tooltip, Legend);

const MentionsChart = () => {
  const { brand } = useBrand();
  const [startDate, setStartDate] = useState(new Date());
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const fetchAllMentionsData = async () => {
      try {
        let allMentions = [];
        let currentCursor = null;
        let hasMoreData = true;

        while (hasMoreData) {
          const response = await axios.get('https://twitter-pack.p.rapidapi.com/search/tweet', {
            headers: {
              'x-rapidapi-key': '6009977b2amsh2d3f65eafe06fd2p12ec3fjsnc366b1c8aac1',
              'x-rapidapi-host': 'twitter-pack.p.rapidapi.com'
            },
            params: {
              count: 1000,
              query: brand,
              cursor: currentCursor,
            }
          });

          const mentions = response.data.data?.data || [];
          allMentions = [...allMentions, ...mentions];

          // Check if there's a cursor for the next page; if not, exit the loop
          currentCursor = response.data.cursor || null;
          hasMoreData = currentCursor != null;
        }

        processMentionsData(allMentions);
      } catch (error) {
        console.error('Error fetching mentions:', error);
      }
    };

    fetchAllMentionsData();
  }, [brand]);

  const processMentionsData = (mentions) => {
    const labels = generateLabels(); // This will generate labels for the last 7 days
    const mentionsCountByDate = labels.reduce((acc, label) => {
      acc[label] = 0;
      return acc;
    }, {});
  
    mentions.forEach(mention => {
      const createdAt = mention.legacy?.created_at;
  
      if (createdAt) {
        try {
          // Parse date using 'new Date' for direct parsing
          const parsedDate = new Date(createdAt);
          const mentionDate = format(parsedDate, 'd MMM');
  
          // Increment the count for the parsed date
          if (mentionsCountByDate.hasOwnProperty(mentionDate)) {
            mentionsCountByDate[mentionDate] += 1;
          }
        } catch (error) {
          console.warn("Error parsing date:", createdAt, error);
        }
      } else {
        console.warn("Mention missing created_at field:", mention);
      }
    });
  
    // Convert counts into an array format for the chart
    const mentionsPerDate = labels.map(label => mentionsCountByDate[label]);
  
    setChartData({
      labels,
      datasets: [
        {
          label: `Brand Mentions`,
          data: mentionsPerDate,
          borderColor: '#4caf50',
          fill: false,
        }
      ]
    });
  };
  
  // Generate labels for the last 7 days
  const generateLabels = () => {
    const labels = [];
    const currentDate = new Date(startDate);

    for (let i = 6; i >= 0; i--) {
      labels.push(format(addDays(currentDate, -i), 'd MMM'));
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
      {/* Removed Dropdown for range selection */}
      <h3>Last 7 Days</h3>
      {/* Chart */}
      <div className="chart-container">
        <Line data={chartData} options={options} width={400} height={200} />
      </div>
    </div>
  );
};

export default MentionsChart;
