import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import Sidebar from "../../components/layout/Sidebar";
import Header from "../../components/layout/Header";
import "./comparisioncard.css";
import "../../styles/MentionsChart.css";
import axios from "axios";
import { getBackendUrl } from "../../utils/apiUrl";
import { addDays, format } from "date-fns";

const Comparison = () => {
  const [activityData, setActivityData] = useState({ categories: [], series: [] });
  const [channelSeries, setChannelSeries] = useState([]);
  const [sentimentSeries, setSentimentSeries] = useState([]);
  const [categories, setCategories] = useState([]);
  // const [selectedCompetitors, setSelectedCompetitors] = useState([]);
  const [brand, setBrand] = useState(""); // Brand from the last searched data
  const [competitors, setCompetitors] = useState([]); // Example competitors

  const checkScreenSize = () => {
    const screenInches = getScreenSizeInInches();

    if (screenInches >= 13.5 && screenInches <= 14.5) {
      // Screen is approximately 14 inches
      console.log("14 Inch Screen");
      document.body.style.zoom = "80%";
    } else {
      console.log("15 inches or more");
      document.body.style.zoom = "100%"; // Reset zoom for other screen sizes
    }
  };

  // Function to calculate screen size in inches
  const getScreenSizeInInches = () => {
    const dpi = window.devicePixelRatio * 96; // Assuming standard 96 DPI
    const widthInInches = window.screen.width / dpi;
    const heightInInches = window.screen.height / dpi;

    return Math.sqrt(Math.pow(widthInInches, 2) + Math.pow(heightInInches, 2));
  };

  useEffect(() => {
    fetchPreferences();
  }, []);

  useEffect(() => {
    if (brand && competitors.length > 0) {
      fetchComparisonData([brand, ...competitors]);
    }
  }, [brand, competitors]);

  useEffect(() => {
    // fetchLastSearchedBrand();
    // fetchPreferences();
    checkScreenSize(); // Check and adjust zoom level on component mount
    window.addEventListener('resize', checkScreenSize); // Recheck on window resize

    return () => {
      window.removeEventListener('resize', checkScreenSize); // Cleanup listener on unmount
    };
  }, []);

  // useEffect(() => {
  //   if (brand ) {
  //     fetchComparisonData([brand, ...competitors]);
  //   }
  // }, [brand, competitors]);


  const fetchPreferences = async () => {
    const userId = localStorage.getItem("userId");
    const apiUrl = getBackendUrl();

    try {
      const response = await axios.post(`${apiUrl}/api/users/get-preferences`, { userId });
      const { company, competitors } = response.data;

      if (company) {
        setBrand(company);
      }
      if (Array.isArray(competitors)) {
        setCompetitors(competitors);
      }
    } catch (error) {
      console.error("Error fetching preferences:", error);
    }
  };



  const fetchComparisonData = async (brands) => {

    try {
      const allData = []; // Collect all fetched data
      for (const brandName of brands) {
        const response = await axios.post(
          "https://search-devsocialhear-ngvsq7uyye5itqksxzscw2ngmm.aos.ap-south-1.on.aws/filtered_tweets/_search",
          {
            query: {
              bool: {
                must: [{ match: { Keyword: brandName } }],
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
        const hits = response.data.hits.hits.map((hit) => hit._source);
        allData.push({ brandName, data: hits });
      }

      processElasticData(allData);
      processComparisonData(allData);
    } catch (error) {
      console.error("Error fetching comparison data:", error);
    }
  };
  const processComparisonData = (allData) => {
    const categories = generateLabels(30); // Generate last 30 days

    const activitySeries = allData.map(({ brandName, data }) => {
      return {
        name: brandName, // Brand or competitor name
        data: categories.map((date) =>
          data.filter(
            (item) =>
              item.Keyword === brandName &&
              format(new Date(item.timestamp), "d MMM") === date
          ).length
        ),
      };
    });

    console.log("Processed Activity Series: ", activitySeries); // Debug: Check series data

    setActivityData({ categories, series: activitySeries });
  };
  const generateLabels = (days) => {
    const labels = [];
    for (let i = days - 1; i >= 0; i--) {
      labels.push(format(addDays(new Date(), -i), "d MMM"));
    }
    return labels;
  };

  const processElasticData = (allData) => {
    const uniqueDates = generateLabels(30); // Use consistent labels for last 30 days

    // Activity Trend Data
    const activitySeries = allData.map(({ brandName, data }) => ({
      name: brandName,
      data: uniqueDates.map(
        (date) =>
          data.filter(
            (item) =>
              item.Keyword === brandName &&
              format(new Date(item.timestamp), "d MMM") === date
          ).length || 0
      ),
    }));

    // Channel-wise Activity Data
    const channelSeries = ["Twitter", "Instagram", "LinkedIn"].map((channel) => ({
      name: channel,
      data: allData.map(({ brandName, data }) =>
        data.filter((item) => item.source === channel).length || 0
      ),
      color:
        channel === "Twitter"
          ? "#42D2D2"
          : channel === "Instagram"
            ? "#38B084"
            : "#91DAE5",
    }));

    // Sentiment Analysis Data
    const sentimentSeries = ["neutral", "negative", "positive"].map((sentiment) => ({
      name: sentiment.charAt(0).toUpperCase() + sentiment.slice(1), // Capitalize first letter
      data: allData.map(({ brandName, data }) =>
        data.filter((item) => item.Sentiment === sentiment).length || 0
      ),
      color:
        sentiment === "neutral"
          ? "#FFD04F"
          : sentiment === "negative"
            ? "#DE2E2E"
            : "#18A837",
    }));
    const brandNames = allData.map((item) => item.brandName);
    // Update state
    setActivityData({ categories: uniqueDates, series: activitySeries });
    setChannelSeries(channelSeries);
    setSentimentSeries(sentimentSeries);
    setCategories(brandNames); // Set brand names as categories for y-axis
  };


  const apexChartOptions = {
    chart: { type: "line", toolbar: { show: false } },
    legend: {
      position: "top", // Move legend above the chart
      horizontalAlign: "center", // Center align the legend
      floating: false, // Ensure it stays within the chart container
      offsetY: -5, // Adjust spacing between legend and chart
    },
    xaxis: {
      categories: activityData.categories,
      title: { text: "Date", style: { fontSize: "14px", fontWeight: "bold", fontFamily: "Segoe UI" }, offsetY: -30, },
      labels: {
        style: {
          fontWeight: "bold",
          fontSize: "13px",
          fontFamily: "Segoe UI",
        },
        formatter: (value) => value, // Keep all data, limit visible labels with `tickAmount`
      },
      tickAmount: Math.ceil(activityData.categories.length / 6),
    },
    yaxis: {
      title: { text: "Brand Mentions" },
      labels: { style: { fontWeight: "bold", fontSize: "13px" } },
    },
    stroke: { curve: "smooth" },
    colors: ["#18A837", "#2D85E5", "#94467D", "#4CAF50", "#F44336"],
    grid: { show: false },
  };

  const stackedChartOptions = {
    chart: { type: "bar", stacked: true, toolbar: { show: false } },
    xaxis: {
      categories: categories,
      title: {
        text: "Brand Mentions",
        style: { fontWeight: "bold", fontSize: "14px" },
        offsetX: -20,
      },
      labels: { // Make x-axis numbers bold
        style: {
          fontWeight: "bold",
          fontSize: "13px",
          color: "#333"
        },
      },
      axisBorder: { show: false }, // Remove x-axis border line
      axisTicks: { show: false }, // Remove x-axis ticks
    },
    yaxis: {
      categories: categories,
      labels: {
        style: { fontWeight: "bold", fontSize: "13px" }
      },
      title: {
        text: "Brand",
        style: { fontWeight: "bold", fontSize: "13px" },

      },
      axisBorder: { show: false }, // Remove y-axis border line
      axisTicks: { show: false }, // Remove y-axis ticks
    },
    legend: { position: "top", horizontalAlign: "center" },
    plotOptions: { bar: { horizontal: true, barHeight: "70%", dataLabels: { enabled: false },  } },
    dataLabels: { enabled: false }, // Global option to hide data labels
    grid: { show: false }, // Remove grid lines
  };


  // const handleSelectChange = (event) => {
  //   const selectedOption = event.target.value;
  //   if (!selectedCompetitors.includes(selectedOption)) {
  //     setSelectedCompetitors((prev) => [...prev, selectedOption]);
  //   }
  // };

  // const removeCompetitor = (competitor) => {
  //   setSelectedCompetitors((prev) => prev.filter((item) => item !== competitor));
  // };

  return (
    <div className="mentions-chart-container p-4 bg-gray-100 min-h-screen">
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="mentions-content">
        <Header />

        {/* Dropdown Section */}
        <div div className="flex items-center space-x-6 mt-10">
          <div className="flex flex-col">
            <label htmlFor="brand" className="text-[14px] font-normal text-black mb-1">
              Brand
            </label>
            <div
              id="brand"
              className="w-[300px] h-[40px] flex items-center rounded-md border-gray-300 shadow-sm bg-gray-100 text-black px-3 cursor-not-allowed"
            >
              {brand || "Loading..."}
            </div>
          </div>



          <div className="flex flex-col">
            <label
              htmlFor="competitor-brand"
              className="text-[14px] font-normal text-black mb-1"
            >
              Competitor Brand
            </label>
            <div className="flex flex-wrap items-center w-[900px] min-h-[40px] rounded-md border-gray-300 shadow-sm px-2 bg-gray-100">
              {competitors.map((competitor, index) => (
                <div
                  key={index}
                  className="flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full mr-2 mb-2"
                >
                  <span>{competitor}</span>
                </div>
              ))}
            </div>
          </div>
        </div>


        {/* Charts */}
        <h2 className="text-[20px] font-semibold mt-6">Competitor Analysis</h2>
        <p className="text-[16px]">Know where your brand stacks in the industry</p>

        <div className="space-y-6">
          <div className="bg-white shadow-lg rounded-lg p-6 mt-4">
          <h3 className="relative text-[20px] font-semibold leading-[26.6px] text-left text-black decoration-skip-ink-none font-['Segoe UI'] mb-4 after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-full after:h-[1px] after:bg-[#C6C6C6] after:opacity-50">
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
            <div className="bg-white shadow-lg rounded-lg p-6 h-[380px]">
              <h3 className="relative text-[20px] font-semibold leading-[26.6px] text-left text-black decoration-skip-ink-none font-['Segoe UI'] mb-4 after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-full after:h-[1px] after:bg-[#C6C6C6] after:opacity-50">
                Channel wise activity of brand
              </h3>
              <ReactApexChart
                options={stackedChartOptions}
                series={channelSeries}
                type="bar"
                height={300}
              />
            </div>

            <div className="bg-white shadow-lg rounded-lg p-6 h-[380px]">
              <h3 className="relative text-[20px] font-semibold leading-[26.6px] text-left text-black decoration-skip-ink-none font-['Segoe UI'] mb-4 after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-full after:h-[1px] after:bg-[#C6C6C6] after:opacity-50">
                Sentiment of fan voice
              </h3>
              <ReactApexChart
                options={stackedChartOptions}
                series={sentimentSeries}
                type="bar"
                height={300}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comparison;
