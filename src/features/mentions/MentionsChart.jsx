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
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          'https://search-devsocialhear-ngvsq7uyye5itqksxzscw2ngmm.aos.ap-south-1.on.aws/filtered_tweets/_search',
          {
            query: {
              match: {
                Keyword: brand, // Query based on the brand
              },
            },
            size: 10000, // Fetch up to 1000 results
          },
          {
            auth: {
              username: 'qartAdmin',
              password: '6#h!%HbsBH4zXRat@qFPSnfn@04#2023', // Elasticsearch credentials
            },
          }
        );

        const mentions = response.data.hits.hits.map((hit) => hit._source);

        processMentionsData(mentions);
      } catch (error) {
        console.error('Error fetching chart data from Elasticsearch:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [brand]);

  const processMentionsData = (mentions) => {
    const labels = generateLabels(); // Generate labels for the last 7 days
    const mentionsCountByDate = labels.reduce((acc, label) => {
      acc[label] = 0;
      return acc;
    }, {});

    mentions.forEach((mention) => {
      const createdAt = mention.timestamp;

      if (createdAt) {
        try {
          const parsedDate = new Date(createdAt);
          const mentionDate = format(parsedDate, 'd MMM');

          // Increment the count for the parsed date
          if (mentionsCountByDate.hasOwnProperty(mentionDate)) {
            mentionsCountByDate[mentionDate] += 1;
          }
        } catch (error) {
          console.warn('Error parsing date:', createdAt, error);
        }
      }
    });

    const mentionsPerDate = labels.map((label) => mentionsCountByDate[label]);

    setChartData({
      labels,
      datasets: [
        {
          label: `Mentions for ${brand}`,
          data: mentionsPerDate,
          borderColor: '#4caf50',
          fill: false,
        },
      ],
    });
  };

  // Generate labels for the last 7 days
  const generateLabels = () => {
    const labels = [];
    const currentDate = new Date();

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
      <h3>Last 7 Days</h3>
      <div className="chart-container">
        {loading ? (
          <p>Loading chart...</p>
        ) : chartData.labels.length > 0 ? (
          <Line data={chartData} options={options} width={400} height={200} />
        ) : (
          <p>No data available for the chart.</p>
        )}
      </div>
    </div>
  );
};

export default MentionsChart;
