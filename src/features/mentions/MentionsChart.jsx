import React, { useState, useEffect } from 'react';
import { Line, Pie, Doughnut} from 'react-chartjs-2';
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
  Filler
} from 'chart.js';
import { addDays, format } from 'date-fns';
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
  ChartDataLabels // Register the plugin
);

ChartJS.register({
  id: "centerText",
  beforeDraw(chart) {
    if (chart.config.options.plugins.centerText) {
      const { width } = chart;
      const { height } = chart;
      const ctx = chart.ctx;
      const { text, subText } = chart.config.options.plugins.centerText;

      ctx.save();

      // Style for the main text
      ctx.font = "bold 20px Poppins";
      ctx.fillStyle = "#000";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Draw the subtext (e.g., "Total Number of Mentions")
      ctx.fillText(subText, width / 2, height / 2 - 10);

      // Draw the main text (e.g., the mentions count)
      ctx.font = "bold 24px Poppins"; // Larger font for the count
      ctx.fillText(text, width / 2, height / 2 + 15);

      ctx.restore();
    }
  },
});

const MentionsChart = () => {
  const { brand } = useBrand();
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [sentimentData, setSentimentData] = useState({ labels: [], datasets: [] });
  const [trendData, setTrendData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(false);
  const [totalMentions, setTotalMentions] = useState(0);

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
        setTotalMentions(mentions.length);
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
          borderColor: "#4caf50",
          backgroundColor: "rgba(76, 175, 80, 0.2)",
          fill: true,
          tension: 0.5, // Smooth line
          
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
          hoverOffset: 4,
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
          label: "Positive",
          data: positiveData,
          borderColor: "#4caf50",
          backgroundColor: "rgba(76, 175, 80, 0.2)",
          fill: true,
          tension: 0.5, // Smooth line
        },
        {
          label: "Negative",
          data: labels.map((label) => sentimentTrend.negative[label]),
          borderColor: "#f44336",
          backgroundColor: "rgba(244, 67, 54, 0.2)",
          fill: true,
          tension: 0.5, // Smooth line
        },
        {
          label: "Neutral",
          data: labels.map((label) => sentimentTrend.neutral[label]),
          borderColor: "#ffc107",
          backgroundColor: "rgba(255, 193, 7, 0.2)",
          fill: true,
          tension: 0.5, // Smooth line
        },
      ],
    });
  };

  const generateLabels = (days) => {
    const labels = [];
    const currentDate = new Date();

    for (let i = days - 1; i >= 0; i-=4) {
      labels.push(format(addDays(currentDate, -i), 'd MMM'));
    }
    return labels;
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top", // Position matches Figma
        labels: {
          font: {
            size: 14,
            family: 'Poppins',
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 12,
            family: 'Poppins',
          },
          color: '#666',
        },
        grid: {
          display: false, // Remove grid lines to match Figma
        },
      },
      y: {
        ticks: {
          font: {
            size: 12,
            family: 'Poppins',
          },
          color: '#666',
        },
        grid: {
          color: '#e5e5e5', // Subtle grid lines
        },
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: { size: 14 },
        },
      },
      datalabels: {
        display: false, // Disable default datalabels
        
      },
      tooltip: {
        enabled: true,
      },
      centerText: {
        display: true,
        text: `${totalMentions} `,
        subText: "Total Mentions", 
      },
    },
    cutout: "60%", // Makes it a doughnut chart
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
            <Pie Doughnut data={sentimentData} options={pieChartOptions} width={300} height={300} />
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


