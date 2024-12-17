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
  const [selectedCompetitors, setSelectedCompetitors] = useState([]);
  const [brand, setBrand] = useState(""); // Brand from the last searched data
  const competitors = ["Raymond", "Mufti", "pepe jeans", "Levis", "blackberrys"]; // Example competitors

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
    // fetchLastSearchedBrand();
    // fetchPreferences();
    checkScreenSize(); // Check and adjust zoom level on component mount
    window.addEventListener('resize', checkScreenSize); // Recheck on window resize

    return () => {
      window.removeEventListener('resize', checkScreenSize); // Cleanup listener on unmount
    };
  }, []);

  useEffect(() => {
    if (brand) {
      fetchComparisonData([brand, ...selectedCompetitors]);
    }
  }, [brand, selectedCompetitors]);


  const fetchPreferences = async () => {
    const userId = localStorage.getItem("userId");
    const apiUrl = getBackendUrl();

    try {
      const response = await axios.post(`${apiUrl}/api/users/get-preferences`, { userId });
      const { company, competitor } = response.data;
      

      setBrand(company);
      // Set the search term for fetching mentions
      // fetchData(company);

    } catch (error) {
      console.error("Error fetching preferences:", error);
    }
  };


  

  const fetchComparisonData = async (brands) => {
    try {
      const response = await axios.post(
        "https://search-devsocialhear-ngvsq7uyye5itqksxzscw2ngmm.aos.ap-south-1.on.aws/filtered_tweets/_search",
        {
          query: {
            bool: {
              must: [
                { 
                  bool: {
                    should: brands.map((brand) => ({
                      match: { Keyword: brand }
                    })),
                  }
                },
                
              ],
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
      processElasticData(hits, brands);
      processComparisonData(hits, brands);
    } catch (error) {
      console.error("Error fetching comparison data:", error);
    }
  };

  const processComparisonData = (data, brands) => {
    const categories = generateLabels(30); // Generate last 30 days
    const activitySeries = brands.map((brandName) => ({
      name: brandName,
      data: categories.map((date) =>
        data.filter(
          (item) =>
            item.Keyword === brandName && format(new Date(item.timestamp), "d MMM") === date
        ).length
      ),
    }));

    setActivityData({ categories, series: activitySeries });
  };

  const generateLabels = (days) => {
    const labels = [];
    for (let i = days - 1; i >= 0; i--) {
      labels.push(format(addDays(new Date(), -i), "d MMM"));
    }
    return labels;
  };


  const processElasticData = (data, brands) => {
    const uniqueDates = [
      ...new Set(data.map((item) => (item.timestamp ? item.timestamp.split(" ")[0] : ""))),
    ].sort();
  
    // Activity Trend Data
    const activitySeries = brands.map((brand) => ({
      name: brand,
      data: uniqueDates.map(
        (date) =>
          data.filter(
            (item) =>
              (item.Keyword || "") === brand && item.timestamp?.includes(date)
          ).length || 0
      ),
    }));
  
    // Channel-wise Activity Data
    const channelSeries = [
      {
        name: "Twitter",
        data: brands.map(
          (brand) =>
            data.filter(
              (item) =>
                (item.Keyword || "") === brand && (item.source || "") === "Twitter"
            ).length || 0
        ),
        color: "#42D2D2",
      },
      {
        name: "Instagram",
        data: brands.map(
          (brand) =>
            data.filter(
              (item) =>
                (item.Keyword || "") === brand && (item.source || "") === "Instagram"
            ).length || 0
        ),
        color: "#38B084",
      },
      {
        name: "LinkedIn",
        data: brands.map(
          (brand) =>
            data.filter(
              (item) =>
                (item.Keyword || "") === brand && (item.source || "") === "LinkedIn"
            ).length || 0
        ),
        color:"#91DAE5",
      },
    ];
  
    // Sentiment Analysis Data
    const sentimentSeries = [
      {
        name: "Neutral",
        data: brands.map(
          (brand) =>
            data.filter(
              (item) =>
                (item.Keyword || "") === brand && (item.Sentiment || "") === "neutral"
            ).length || 0
        ),
        color: "#FFD04F",
      },
      {
        name: "Negative",
        data: brands.map(
          (brand) =>
            data.filter(
              (item) =>
                (item.Keyword || "") === brand && (item.Sentiment || "") === "negative"
            ).length || 0
        ),
        color: "#DE2E2E",
      },
      {
        name: "Positive",
        data: brands.map(
          (brand) =>
            data.filter(
              (item) =>
                (item.Keyword || "") === brand && (item.Sentiment || "") === "positive"
            ).length || 0
        ),
        color: "#18A837",
      },
    ];
  
    setActivityData({ categories: uniqueDates, series: activitySeries });
    setChannelSeries(channelSeries);
    setSentimentSeries(sentimentSeries);
    setCategories(brands);
  };
  

  const apexChartOptions = {
    chart: { type: "line", toolbar: { show: false } },
    xaxis: {
      categories: activityData.categories,
      title: { text: "Date", style: { fontSize: "14px", fontWeight: "bold",fontFamily: "Segoe UI" },offsetY: -30, },
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
      labels: { 
        style: { fontWeight: "bold", fontSize: "13px" } 
      },
      title: { 
        text: "Brand", 
        style: { fontWeight: "bold", fontSize: "13px" }, 
        offsetX: 8 
      },
      axisBorder: { show: false }, // Remove y-axis border line
      axisTicks: { show: false }, // Remove y-axis ticks
    },
    legend: { position: "top", horizontalAlign: "center" },
    plotOptions: { bar: { horizontal: true, barHeight: "70%" } },
    grid: { show: false }, // Remove grid lines
  };
  

  const handleSelectChange = (event) => {
    const selectedOption = event.target.value;
    if (!selectedCompetitors.includes(selectedOption)) {
      setSelectedCompetitors((prev) => [...prev, selectedOption]);
    }
  };

  const removeCompetitor = (competitor) => {
    setSelectedCompetitors((prev) => prev.filter((item) => item !== competitor));
  };

  return (
    <div className="mentions-chart-container p-4 bg-gray-100 min-h-screen">
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="mentions-content">
        <Header />

        {/* Dropdown Section */}
        <div className="flex items-center space-x-6 mt-10">
          <div className="flex flex-col">
            <label htmlFor="brand" className="text-[14px] font-normal text-black mb-1">
              Brand
            </label>
            <select
              id="brand"
              className="w-[300px] h-[40px] rounded-md border-gray-300 shadow-sm"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            >
              <option value="">Select Brand</option>
              {competitors.map((competitor) => (
                <option key={competitor} value={competitor}>
                  {competitor}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="competitor-brand"
              className="text-[14px] font-normal text-black mb-1"
            >
              Competitor Brand
            </label>
            <div className="flex items-center w-[900px] h-[40px] rounded-md border-gray-300 shadow-sm px-2">
              {selectedCompetitors.map((competitor, index) => (
                <div
                  key={index}
                  className="flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full mr-2"
                >
                  <span>{competitor}</span>
                  <button
                    onClick={() => removeCompetitor(competitor)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
              <select
                id="competitor-brand"
                onChange={handleSelectChange}
                className="flex-grow bg-transparent outline-none"
              >
                <option value="">Select Competitor</option>
                {competitors
                  .filter((competitor) => !selectedCompetitors.includes(competitor))
                  .map((competitor) => (
                    <option key={competitor} value={competitor}>
                      {competitor}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>

        {/* Charts */}
        <h2 className="text-[20px] font-semibold mt-6">Competitor Analysis</h2>
        <p className="text-[16px]">Know where your brand stacks in the industry</p>

        <div className="space-y-6">
          <div className="bg-white shadow-lg rounded-lg p-6 mt-4">
            <h3 className="text-[20px] font-semibold leading-[26.6px] text-left text-black decoration-skip-ink-none font-['Segoe UI'] mb-4">
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
              <h3 className="text-[20px] font-semibold leading-[26.6px] text-left text-black decoration-skip-ink-none font-['Segoe UI'] mb-4">
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
              <h3 className="text-[20px] font-semibold leading-[26.6px] text-left text-black decoration-skip-ink-none font-['Segoe UI'] mb-4">
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
