import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";
import './comparisioncard.css';
import "../../styles/MentionsChart.css";

const Comparison = () => {
  const [activityData, setActivityData] = useState({ categories: [], series: [] });
  const [channelData, setChannelData] = useState(null);
  const [sentimentData, setSentimentData] = useState(null);

  useEffect(() => {
    fetchComparisonData();
  }, []);

  const fetchComparisonData = async () => {
    const fetchedActivityData = {
      categories: ["1 Nov", "5 Nov", "10 Nov", "15 Nov", "20 Nov", "25 Nov", "30 Nov"],
      series: [
        { name: "Levis", data: [1000, 3000, 5000, 7000, 8000, 9000, 10000] },
        { name: "Raymond", data: [2000, 2500, 3000, 4000, 5000, 7000, 8000] },
        { name: "Mufti", data: [1500, 2000, 2500, 3000, 3500, 4000, 4500] },
      ],
    };

    const fetchedChannelData = {
      labels: ["Levis", "Raymond", "Mufti"],
      datasets: [
        { label: "Twitter", data: [4000, 3000, 2000], backgroundColor: "#1DA1F2" },
        { label: "Instagram", data: [3000, 4000, 3000], backgroundColor: "#E1306C" },
        { label: "Linkedin", data: [2000, 2500, 1500], backgroundColor: "#0077B5" },
      ],
    };

    const fetchedSentimentData = {
      labels: ["Levis", "Raymond", "Mufti"],
      datasets: [
        { label: "Neutral", data: [4000, 3500, 3000], backgroundColor: "#FFC107" },
        { label: "Negative", data: [2000, 1500, 1000], backgroundColor: "#F44336" },
        { label: "Positive", data: [6000, 5000, 4000], backgroundColor: "#4CAF50" },
      ],
    };

    setActivityData(fetchedActivityData);
    setChannelData(fetchedChannelData);
    setSentimentData(fetchedSentimentData);
  };

  const apexChartOptions = {
    chart: {
      type: "line",
      toolbar: { show: false },
    },
    xaxis: {
      categories: activityData.categories,
    },
    yaxis: {
      title: { text: "Brand Mentions" },
    },
    stroke: { curve: "smooth" },
    colors: ["#1DA1F2", "#E1306C", "#0077B5"],
  };

  return (
    <div className="mentions-chart-container p-4 bg-gray-100 min-h-screen">
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="comparison-content ">
        <Header />
        
        <div className="space-y-6 ">

          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="font-sans text-[20px] font-normal leading-[26.6px] text-left  underline-offset-auto decoration-slice mb-4">
              Brand activity trend over time
            </h3>
            <ReactApexChart
              options={apexChartOptions}
              series={activityData.series}
              type="line"
              height={300}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white shadow-lg rounded-lg p-6 h-[300px] flex flex-col justify-center">
              <h3 className="font-sans text-[20px] font-normal leading-[15px] text-left underline-offset-auto decoration-slice mb-4">
                Channel wise activity of brand
              </h3>
              {channelData && (
                <Bar
                  data={channelData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: true, position: "top" },
                    },
                  }}
                />
              )}
            </div>

            <div className="bg-white shadow-lg rounded-lg p-6 h-[300px] flex flex-col justify-center">
              <h3 className="font-sans text-[20px] font-normal leading-[15px] text-left underline-offset-auto decoration-slice mb-4">
                Sentiment of fan voice
              </h3>
              {sentimentData && (
                <Bar
                  data={sentimentData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: true, position: "top" },
                    },
                  }}
                />
              )}
            </div>
          </div>
        </div>
        </div>
      </div>
   
  );
};

export default Comparison;
