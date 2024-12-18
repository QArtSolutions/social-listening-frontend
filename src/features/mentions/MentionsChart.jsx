import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { Pie } from "react-chartjs-2";
import { useBrand } from "../../contexts/BrandContext";
import axios from "axios";
import { addDays, format, isToday } from "date-fns";
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
      ctx.font = "bold 60px Poppins";
      ctx.fillStyle = "#000";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(subText, width / 2, height / 2 - 15);

      // Style for the main text
      ctx.font = " 20px Poppins";
      ctx.fillStyle = "#000";
      ctx.fillText(text, width / 2, height / 2 + 20);

      ctx.restore();
    }
  },
});


// const getTodayDate = () => {
//   const today = new Date();
//   const year = today.getFullYear();
//   const month = String(today.getMonth() + 1).padStart(2, "0");
//   const day = String(today.getDate()).padStart(2, "0");
//   return `${year}-${month}-${day}`;
// };

const getPast30Days = () => {
  const dates = [];
  const IST_OFFSET = 330; // IST is UTC+5:30, so 330 minutes ahead
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setMinutes(date.getMinutes() + IST_OFFSET); // Convert to IST
    date.setDate(date.getDate() - i); // Subtract days
    // Extract YYYY-MM-DD in IST
    const istDate = date.toISOString().split("T")[0];
    dates.push(istDate);
  }
  return dates;
};

console.log(getPast30Days());


const MentionsChart = () => {
  const { brand } = useBrand();
  const [mentionsChartData, setMentionsChartData] = useState({ categories: [], series: [] });
  const [trendChartData, setTrendChartData] = useState({ categories: [], series: [] });
  const [sentimentData, setSentimentData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(false);
  const [totalMentions, setTotalMentions] = useState(0);
  const [followersData, setFollowersData] = useState([]);

 

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
        // console.log("mentions are: ", mentions);
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

  
  const getBrandIndex = (brand) => {
    const indexMapping = {
      raymond: "raymond",
      mufti: "mufti",
      "pepe jeans": "pepe_jeans",
      blackberrys: "blackberrys",
      levis: "levis",
      "jack & jones": "jack_&_jones"
    };
  
    // Normalize input: trim spaces, convert to lowercase
    const normalizedBrand = brand.trim().toLowerCase();
  
    // Check if the brand exists in the mapping
    return indexMapping[normalizedBrand] || normalizedBrand.replace(/\s+/g, "_");
  };

  useEffect(() => {
    const fetchChartDatafollow = async () => {
      try {
        setLoading(true);
        const dates = getPast30Days(); // Helper function to get past 30 days
        
        let brandlower = getBrandIndex(brand);
        
        const response = await axios.post(
          `https://search-devsocialhear-ngvsq7uyye5itqksxzscw2ngmm.aos.ap-south-1.on.aws/${brandlower}/_search`,
          {
            query: {
              range: {
                date: {
                  gte: dates[0], // 30 days ago
                  lte: dates[dates.length - 1], // Today
                  format: "yyyy-MM-dd",
                },
              },
            },
            sort: [{ date: { order: "asc" } }], // Sort results by date
            size: 100, // Fetch up to 100 documents
          },
          {
            auth: {
              username: "qartAdmin",
              password: "6#h!%HbsBH4zXRat@qFPSnfn@04#2023",
            },
          }
        );
  
        console.log("API Response:", response.data);
        const hits = response.data.hits?.hits || [];
        const followersByDate = dates.map((date) => {
        const dataForDate = hits.find((hit) => hit._source.date === date);
          return {
            date,
            instagram: dataForDate?._source.instagram || 0,
            twitter: dataForDate?._source.twitter || 0,
            linkedin: dataForDate?._source.linkedin || 0,
          };
        });
  
        setFollowersData(followersByDate); // Update state as an array
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchChartDatafollow();
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
          borderWidth: 0,
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
        text: "Mentions",
        subText:`${totalMentions}`,
      },
    },
    cutout: "70%",
  };

  const apexChartOptions = {
    chart: { type: "spline", toolbar: { show: false },zoom: { enabled: false }, },
    xaxis: {
      categories: mentionsChartData.categories,
      title: { text: "Date" ,style: {
        fontWeight: "bold",
        fontSize: "14px",
        fontFamily: "Segoe UI",
        color: "#333",
      },
      offsetY: 0, // Move the title closer to the labels
    },
      labels: {
        style: {
          fontWeight: "bold",
          fontSize: "12px",
          fontFamily: "Segoe UI",
        }, 
        formatter: (value) => value, // Keep all data, limit visible labels with `tickAmount`
        rotate: 0, 
      },
      tickAmount: Math.ceil(mentionsChartData.categories.length / 6), // Show every 4th label
    },
    yaxis: {
      title: { 
        text: "Count",
        style: {
          fontSize: "14px",
          fontWeight: "bold",
          fontFamily: "Segoe UI",
          color: "#000000",
          letterSpacing: "1.5px", // Adjust letter spacing
        },
        offsetX: 5,
     },
      labels: {
        style: {
          fontWeight: "bold",
          fontSize: "12px",
          fontFamily: "Segoe UI",
          color: "#000000",
        },
        formatter: (value) => {
          return value === 0 ? "" : value.toFixed(0); // Hide 0 label
        },
        
      },
      min: 0, // Start the axis at 0
      max: Math.ceil(Math.max(...mentionsChartData.series.map(s => Math.max(...s.data)))), // Round up to the nearest integer
      tickAmount: 3, // Ensure tick marks are integers
    },
    stroke: { curve: "smooth" },
    grid: { show: false },
    colors: ["#2D85E5"],
    border: ["2.5px solid"]
  };

  const trendChartOptions = {
    chart: { type: "spline", toolbar: { show: false },zoom: { enabled: false }, },
    xaxis: {
      title: { text: "Date" ,style: {
        fontWeight: "bold",
        fontSize: "14px",
        fontFamily: "Segoe UI",
        color: "#333",
      },
      offsetY: 0, // Move the title closer to the labels
    },
      categories: trendChartData.categories, // Use your x-axis categories
      labels: {
        style: {
          fontWeight: "bold",
          fontSize: '10px',
          fontFamily: 'Segoe UI',
        },
        formatter: (value) => value, // Ensure all data is plotted, but limit labels
        rotate: 0,  
      },
      tickAmount: Math.ceil(trendChartData.categories.length / 6), // Show every 4th label
      axisBorder: {
        show: false, // Remove the bottom border
      },
      axisTicks: {
        show: false, // Remove ticks on the x-axis
      },
    },
    stroke: { curve: "smooth" },
    yaxis: {
      title: { text: "Sentiments Count",
        style: {
        fontSize: "14px",
        fontWeight: "bold",
        fontFamily: "Segoe UI",
        color: "#000000",
        letterSpacing: "1.5px", // Adjust letter spacing
      },
     },
      labels: {
        style: {
          fontWeight: "bold",
          fontSize: "12px",
          fontFamily: "Segoe UI",
          color: "#000000",
          letterSpacing: "1.5px",
        },
        formatter: (value) => {
          return value === 0 ? "" : value.toFixed(0); // Hide 0 label
        },
      },
      min: 0, // Start the axis at 0
      max: Math.ceil(Math.max(...trendChartData.series.map(s => Math.max(...s.data)))), // Round up to the nearest integer
      // tickAmount: 5,
      axisBorder: {
        show: false, // Remove the left border
      },
      axisTicks: {
        show: false, // Remove ticks on the y-axis
      },
    },
    legend: {
      show: true,
      position: "top", // Place the legend at the top
      centerAlign: "center",
      fontSize: "12px",
      labels: {
        colors: "#000000", // Legend label text color
        useSeriesColors: false,
      },
    },
    grid: {
      show: false, // Completely remove the grid lines
    },
    colors: trendChartData.series.map((s) => s.color),
  };

  const seriesfollow = [
    {
      name: "Instagram",
      data: followersData.map((item) => item.instagram || 0), // Extract Instagram data
    },
    {
      name: "Twitter",
      data: followersData.map((item) => item.twitter || 0), // Extract Twitter data
    },
    {
      name: "LinkedIn",
      data: followersData.map((item) => item.linkedin || 0), // Extract LinkedIn data
    },
  ];
  
  const followersChartOptions = {
    chart: {
      type: "line", // Line chart
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    xaxis: {
      categories: followersData.map((item) => item.date), // Dates as X-axis categories
      title: {
        text: "Date",
        style: {
          fontWeight: "bold",
          fontSize: "14px",
          fontFamily: "Segoe UI",
          color: "#333",
        },
        offsetY: 0, // Match offset to bring title closer
      },
      labels: {
        style: {
          fontWeight: "bold",
          fontSize: "12px",
          fontFamily: "Segoe UI",
        },
        formatter: (value) => {
          const date = new Date(value); // Convert string date to Date object
          const day = date.getDate(); // Extract day
          const month = date.toLocaleString("en-US", { month: "short" }); // Get short month name (e.g., Nov, Dec)
          return `${day} ${month}`; // Return formatted string
        },
      min: 0, // Start the axis at 0
      max: Math.ceil(Math.max(...trendChartData.series.map(s => Math.max(...s.data)))), // Round up to the nearest integer
      // tickAmount: 3, // useful for x axis not for y axis
        rotate: 0, 
      },
      tickAmount: Math.ceil(followersData.length / 6 ), // Similar tick logic
    },
    yaxis: {
      title: {
        text: "Mentions",
        style: {
          fontSize: "14px",
          fontWeight: "bold",
          fontFamily: "Segoe UI",
          color: "#000000",
          letterSpacing: "1.5px", // Adjust letter spacing
        },
      },
      labels: {
        style: {
          fontWeight: "bold",
          fontSize: "13px",
          fontFamily: "Segoe UI",
        },
        formatter: (number) => {
          if (number === 0) return "";
          if (number >= 1000000) {
            return Math.floor(number / 1000000) + "M"; // For millions
          } else if (number >= 1000) {
            return Math.floor(number / 1000) + "k"; // For thousands
          }
          return number;
        },
        offsetY: -5, 
      },
    },
    stroke: { curve: "smooth" }, // Smooth lines for the chart
    grid: { show: false }, // Match grid setting
    colors: ["#F19650", "#54BEEE", "#AC54AE"], // Three lines with distinct colors
    legend: {
      show: true,
      position: "top", // Place the legend at the top
      // horizontalAlign: "left", // Align legend items to the left
      centerAlign: "center",
      markers: {
        width: 1, // Set the width of legend line markers
        height: 0, // Set marker height to show a thin line
        radius: 0, // Ensure lines are not rounded
        offsetX: -5,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 5,
      },
      fontSize: "12px",
     
      labels: {
        colors: "#000000", // Legend label text color
        useSeriesColors: false,
      },
    },
    border: ["2.5px solid"], // Consistent border
  };
  
  
  
  // console.log(followersData);

  // console.log(seriesfollow);
  
  return (
    <div className="mentions-chart-container p-4 bg-gray-100 min-h-screen">
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <div className="space-y-6">
          {/* Top Chart Card */}
          <div className="bg-white shadow-lg rounded-lg p-6 -mt-6"style={{ width: "102%", marginLeft: "auto", marginRight: "auto" }}>
            <h3 className="font-sans text-[20px] font-normal leading-[26.6px] text-left underline-offset-auto decoration-slice mb-4 relative">
              Total Mentions
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
            <div className="bg-white shadow-lg rounded-lg p-6"style={{ width: "104%", marginLeft: "auto", marginRight: "auto" }}>
              <h3 className="font-sans text-[20px] font-normal leading-[15px] text-left underline-offset-auto decoration-slice mb-4 relative">
                Sentiment Analysis
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

             {/* New Chart */}
            
<div
  className="bg-white shadow-lg rounded-lg p-6 -mt-6"
  style={{ width: "102%", marginLeft: "auto", marginRight: "auto" }}
>
  {/* Header with title and keys */}
  <div className="flex justify-between items-center mb-4 relative">
    <h3 className="font-sans text-[20px] font-normal leading-[26.6px] text-left underline-offset-auto decoration-slice"
     style={{ fontFamily: "Segoe UI" }}>
      Followers Count
      <span className="absolute bottom-[-8px] left-0 w-full h-[1px] bg-[#C6C6C6] opacity-50"></span>
    </h3>
    
  </div>

  {loading ? (
    <p>Loading...</p>
  ) : (
    <ReactApexChart
      options={followersChartOptions}
      series={seriesfollow}
      type="line"
      height={300}
    />
  )}
</div>


 </div >
        
      )}
    </div >
  );
};

export default MentionsChart;
