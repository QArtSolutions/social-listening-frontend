import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { Pie } from "react-chartjs-2";
import { useBrand } from "../../contexts/BrandContext";
import axios from "axios";
import { addDays, format } from "date-fns";
import "../../styles/MentionsChart.css";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

ChartJS.register({
  id: "centerText",
  beforeDraw(chart) {
    if (chart.config.options.plugins.centerText) {
      const { width } = chart;
      const { height } = chart;
      const ctx = chart.ctx;
      const { text, subText } = chart.config.options.plugins.centerText;

      ctx.save();

      // Style for the subtext
      ctx.font = "bold 16px Poppins";
      ctx.fillStyle = "#666";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(subText, width / 2, height / 2 - 10);

      // Style for the main text
      ctx.font = "bold 24px Poppins";
      ctx.fillStyle = "#000";
      ctx.fillText(text, width / 2, height / 2 + 15);

      ctx.restore();
    }
  },
});

const MentionsChart = () => {
  const { brand } = useBrand();
  const [mentionsChartData, setMentionsChartData] = useState({ categories: [], series: [] });
  const [trendChartData, setTrendChartData] = useState({ categories: [], series: [] });
  const [sentimentData, setSentimentData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(false);
  const [totalMentions, setTotalMentions] = useState(0);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          "https://search-devsocialhear-ngvsq7uyye5itqksxzscw2ngmm.aos.ap-south-1.on.aws/filtered_tweets/_search",
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
              username: "qartAdmin",
              password: "6#h!%HbsBH4zXRat@qFPSnfn@04#2023",
            },
          }
        );

        const mentions = response.data.hits?.hits?.map((hit) => hit._source) || [];
        console.log("mentions are: ", mentions);
        processMentionsData(mentions);
        processSentimentData(mentions);
        processSentimentTrendData(mentions);
      } catch (error) {
        console.error("Error fetching chart data from Elasticsearch:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [brand]);

  const processMentionsData = (mentions) => {
    const categories = generateLabels(30);
    const mentionsCountByDate = categories.reduce((acc, label) => {
      acc[label] = 0;
      return acc;
    }, {});

    mentions.forEach((mention) => {
      const createdAt = mention?.timestamp;

      if (createdAt) {
        try {
          const parsedDate = new Date(createdAt);
          const mentionDate = format(parsedDate, "d MMM");

          if (mentionsCountByDate.hasOwnProperty(mentionDate)) {
            mentionsCountByDate[mentionDate] += 1;
          }
        } catch (error) {
          console.warn("Error parsing date:", createdAt, error);
        }
      }
    });

    const data = categories.map((label) => mentionsCountByDate[label]);

    setMentionsChartData({
      categories,
      series: [{ name: `Mentions for ${brand}`, data }],
    });
  };

  const processSentimentData = (mentions) => {
    const filteredMentions = mentions.filter((mention) => {
      const createdAt = mention?.timestamp;
      if (createdAt) {
        const mentionDate = new Date(createdAt);
        return mentionDate >= addDays(new Date(), -30);
      }
      return false;
    });

    const sentimentCounts = { positive: 0, negative: 0, neutral: 0 };

    filteredMentions.forEach((mention) => {
      if (mention?.Sentiment === "positive") sentimentCounts.positive++;
      else if (mention?.Sentiment === "negative") sentimentCounts.negative++;
      else sentimentCounts.neutral++;
    });

    setTotalMentions(
      sentimentCounts.positive + sentimentCounts.negative + sentimentCounts.neutral
    );

    setSentimentData({
      labels: ["Positive", "Negative", "Neutral"],
      datasets: [
        {
          data: [
            sentimentCounts.positive,
            sentimentCounts.negative,
            sentimentCounts.neutral,
          ],
          backgroundColor: ["#4caf50", "#f44336", "#ffc107"],
        },
      ],
    });
  };

  const processSentimentTrendData = (mentions) => {
    const categories = generateLabels(30);
    const sentimentTrend = {
      positive: categories.map(() => 0),
      negative: categories.map(() => 0),
      neutral: categories.map(() => 0),
    };

    mentions.forEach((mention) => {
      const createdAt = mention?.timestamp;
      const sentiment = mention?.Sentiment;

      if (createdAt && sentiment) {
        try {
          const parsedDate = new Date(createdAt);
          const mentionDate = format(parsedDate, "d MMM");

          const index = categories.indexOf(mentionDate);
          if (index !== -1) {
            sentimentTrend[sentiment][index]++;
          }
        } catch (error) {
          console.warn("Error parsing date:", createdAt, error);
        }
      }
    });

    setTrendChartData({
      categories,
      series: [
        { name: "Positive", data: sentimentTrend.positive, color: "#4caf50" },
        { name: "Negative", data: sentimentTrend.negative, color: "#f44336" },
        { name: "Neutral", data: sentimentTrend.neutral, color: "#ffc107" },
      ],
    });
  };

  const generateLabels = (days) => {
    const labels = [];
    const currentDate = new Date();

    for (let i = days - 1; i >= 0; i--) {
      labels.push(format(addDays(currentDate, -i), "d MMM"));
    }
    return labels;
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        position: "bottom",
        labels: { font: { size: 14 } },
      },
      datalabels: { display: false },
      tooltip: { enabled: true },
      centerText: {
        display: true,
        text: `${totalMentions}`,
        subText: "Total Mentions",
      },
    },
    cutout: "70%",
  };

  const apexChartOptions = {
    chart: { type: "spline", toolbar: { show: false } },
    xaxis: {
      categories: mentionsChartData.categories,
      labels: {
        style: {
          fontWeight: "bold",
          fontSize: "13px",
          fontFamily: "Segoe UI",
        },
        formatter: (value) => value, // Keep all data, limit visible labels with `tickAmount`
      },
      tickAmount: Math.ceil(mentionsChartData.categories.length / 5), // Show every 4th label
    },
    yaxis: {
      title: { text: "Mentions Count" },
      labels: {
        style: {
          fontWeight: "bold",
          fontSize: "13px",
          fontFamily: "Segoe UI",
        },
      },
    },
    stroke: { curve: "smooth" },
    grid: { show: false },
    colors: ["#2D85E5"],
    border: ["2.5px solid"]
  };

  const trendChartOptions = {
    chart: { type: "spline", toolbar: { show: false } },
    xaxis: {
      categories: trendChartData.categories, // Use your x-axis categories
      labels: {
        style: {
          fontWeight: "bold",
          fontSize: '13px',
          fontFamily: 'Segoe UI',
        },
        formatter: (value) => value, // Ensure all data is plotted, but limit labels
      },
      tickAmount: Math.ceil(trendChartData.categories.length / 5), // Show every 4th label
      axisBorder: {
        show: false, // Remove the bottom border
      },
      axisTicks: {
        show: false, // Remove ticks on the x-axis
      },
    },
    stroke: { curve: "smooth" },
    yaxis: {
      title: { text: "Sentiments Count" },
      labels: {
        style: {
          fontSize: '13px',
          fontWeight: "bold",
          fontFamily: 'Segoe UI',
        },
      },
      axisBorder: {
        show: false, // Remove the left border
      },
      axisTicks: {
        show: false, // Remove ticks on the y-axis
      },
    },
    grid: {
      show: false, // Completely remove the grid lines
    },
    colors: trendChartData.series.map((s) => s.color),
  };

  return (
    <div className="mentions-chart-container p-4 bg-gray-100 min-h-screen">
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <div className="space-y-6">
          {/* Top Chart Card */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="font-sans text-[20px] font-normal leading-[26.6px] text-left underline-offset-auto decoration-slice mb-4 relative">
              Last 30 Days Mentions
              <span className="absolute bottom-[-8px] left-0 w-full h-[1px] bg-[#C6C6C6] opacity-50"></span>
            </h3>
            <ReactApexChart
              options={apexChartOptions}
              series={mentionsChartData.series}
              type="line"
              height={300}
            />
          </div>

          {/* Bottom Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pie Chart Card */}
            < div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="font-sans text-[20px] font-normal leading-[15px] text-left underline-offset-auto decoration-slice mb-6 relative">
                Sentiment Summary
                <span className="absolute bottom-[-8px] left-0 w-full h-[1px] bg-[#C6C6C6] opacity-50"></span>
              </h3>
              < div className="flex items-center">
                {/* Pie Chart */}
                <div>
                  <Pie
                    data={sentimentData}
                    options={pieChartOptions}
                    width={300}
                    height={300}
                  />
                </div>


                {/* Sentiment Breakdown */}
                <div className="ml-6 flex flex-col justify-center space-y-4">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-yellow-500 mr-2"></div>
                    <p className="text-sm">
                      <span className="font-bold">Neutral:</span>{" "}
                      {sentimentData.datasets[0]?.data[2]}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-500 mr-2"></div>
                    <p className="text-sm">
                      <span className="font-bold">Negative:</span>{" "}
                      {sentimentData.datasets[0]?.data[1]}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 mr-2"></div>
                    <p className="text-sm">
                      <span className="font-bold">Positive:</span>{" "}
                      {sentimentData.datasets[0]?.data[0]}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Trend Chart Card */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="font-sans text-[20px] font-normal leading-[15px] text-left underline-offset-auto decoration-slice mb-4 relative">
                Sentiment Trend Analysis
                <span className="absolute bottom-[-8px] left-0 w-full h-[1px] bg-[#C6C6C6] opacity-50"></span>
              </h3>
              <ReactApexChart
                options={trendChartOptions}
                series={trendChartData.series}
                type="line"
                height={300}
              />
            </div>

          </div>
        </div >
      )}
    </div >
  );
};
export default MentionsChart;
