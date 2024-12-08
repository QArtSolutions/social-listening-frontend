import React, { useState, useEffect } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import { useBrand } from '../../contexts/BrandContext';
import axios from 'axios';
  import '../../styles/MentionsChart.css';
import {
  Chart as ChartJS,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { addDays, format } from 'date-fns';

ChartJS.register(
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

const MentionsChart = () => {
  const { brand } = useBrand();
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [sentimentData, setSentimentData] = useState({ labels: [], datasets: [] });
  const [trendData, setTrendData] = useState({ labels: [], datasets: [] });
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
                Keyword: brand,
              },
            },
            size: 10000,
          },
          {
            auth: {
              username: 'qartAdmin',
              password: '6#h!%HbsBH4zXRat@qFPSnfn@04#2023',
            },
          }
        );

        const mentions = response.data.hits?.hits?.map((hit) => hit._source) || [];

        processMentionsData(mentions);
        processSentimentData(mentions);
        processSentimentTrend(mentions);
      } catch (error) {
        console.error('Error fetching chart data from Elasticsearch:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [brand]);

  const processMentionsData = (mentions) => {
    const labels = generateLabels(30); // Generate labels for the last 30 days
    const mentionsCountByDate = labels.reduce((acc, label) => {
      acc[label] = 0;
      return acc;
    }, {});

    mentions.forEach((mention) => {
      const createdAt = mention?.timestamp;

      if (createdAt) {
        try {
          const parsedDate = new Date(createdAt);
          const mentionDate = format(parsedDate, 'd MMM');

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
  
  const processSentimentData = (mentions) => {
    const sentimentCounts = { positive: 0, negative: 0, neutral: 0 };

    mentions.forEach((mention) => {
      if (mention?.Sentiment === 'positive') sentimentCounts.positive++;
      else if (mention?.Sentiment === 'negative') sentimentCounts.negative++;
      else sentimentCounts.neutral++;
    });

    setSentimentData({
      labels: ['Positive', 'Negative', 'Neutral'],
      datasets: [
        {
          data: [
            sentimentCounts.positive,
            sentimentCounts.negative,
            sentimentCounts.neutral,
          ],
          backgroundColor: ['#4caf50', '#f44336', '#ffc107'],
        },
      ],
    });
  };

  const processSentimentTrend = (mentions) => {
    const labels = generateLabels(30); // Generate labels for the last 30 days
    const sentimentTrend = {
      positive: labels.reduce((acc, label) => {
        acc[label] = 0;
        return acc;
      }, {}),
      negative: labels.reduce((acc, label) => {
        acc[label] = 0;
        return acc;
      }, {}),
      neutral: labels.reduce((acc, label) => {
        acc[label] = 0;
        return acc;
      }, {}),
    };

    mentions.forEach((mention) => {
      const createdAt = mention?.timestamp;
      const sentiment = mention?.Sentiment;

      if (createdAt && sentiment) {
        try {
          const parsedDate = new Date(createdAt);
          const mentionDate = format(parsedDate, 'd MMM');

          if (sentimentTrend[sentiment] && sentimentTrend[sentiment].hasOwnProperty(mentionDate)) {
            sentimentTrend[sentiment][mentionDate] += 1;
          }
        } catch (error) {
          console.warn('Error parsing date:', createdAt, error);
        }
      }
    });

    const positiveData = labels.map((label) => sentimentTrend.positive[label]);
    const negativeData = labels.map((label) => sentimentTrend.negative[label]);
    const neutralData = labels.map((label) => sentimentTrend.neutral[label]);

    setTrendData({
      labels,
      datasets: [
        {
          label: 'Positive',
          data: positiveData,
          borderColor: '#4caf50',
          fill: false,
        },
        {
          label: 'Negative',
          data: negativeData,
          borderColor: '#f44336',
          fill: false,
        },
        {
          label: 'Neutral',
          data: neutralData,
          borderColor: '#ffc107',
          fill: false,
        },
      ],
    });
  };

  const generateLabels = (days) => {
    const labels = [];
    const currentDate = new Date();

    for (let i = days - 1; i >= 0; i--) {
      labels.push(format(addDays(currentDate, -i), 'd MMM'));
    }
    return labels;
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true, type: 'linear' },
    },
  };

  return (
    <div className="mentions-chart-container">
  {loading ? (
    <p>Loading data...</p>
  ) : (
    <>
      {/* Line Chart for Last 30 Days Mentions */}
      <div className="trend-tile">
        <h3 className="chart-heading">Last 30 Days Mentions</h3>
        <div className="trend-chart-container">
          <Line data={chartData} options={lineChartOptions} width={400} height={200} />
        </div>
      </div>

      {/* Row containing Pie Chart and Sentiment Trend Chart */}
      <div className="chart-row">
        {/* Pie Chart for Sentiment Summary */}
        <div className="chart-tile">
          <h3 className="chart-heading">Sentiment Summary</h3>
          <div className="pie-chart-container">
            <Pie data={sentimentData} options={{ maintainAspectRatio: false }} width={300} height={300} />
          </div>
        </div>

        {/* Line Chart for Sentiment Trend */}
        <div className="chart-tile">
          <h3 className="chart-heading">Sentiment Trend Analysis</h3>
          <div className="trend-chart-container">
            <Line data={trendData} options={lineChartOptions} width={400} height={200} />
          </div>
        </div>
      </div>
    </>
  )}
</div>
  );
};

export default MentionsChart;


