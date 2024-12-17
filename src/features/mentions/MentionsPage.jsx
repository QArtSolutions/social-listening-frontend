import React, { useState, useEffect } from 'react';
import MentionsChart from './MentionsChart';
import MentionCard from './MentionCard';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import { useBrand } from '../../contexts/BrandContext';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import axios from 'axios';
import { getBackendUrl } from "../../utils/apiUrl.jsx";
import '../../styles/MentionsPage.css';

const MentionsPage = () => {
  const [mentions, setMentions] = useState([]); // State for mentions (Twitter, Instagram, Facebook combined)
  const [searchTerm, setSearchTerm] = useState(''); // State for search input
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [activeTab, setActiveTab] = useState('analytics'); // State for active tab
  const {brand, setBrand } = useBrand();
  const [followersData, setFollowersData] = useState({
    instagram: 0,
    twitter: 0,
    linkedin: 0,
  });

  // Function to check and adjust zoom level based on screen size
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

  const getTodayDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-based
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  


  useEffect(() => {
    // fetchLastSearchedBrand();
    fetchPreferences();
    checkScreenSize(); // Check and adjust zoom level on component mount
    window.addEventListener('resize', checkScreenSize); // Recheck on window resize

    return () => {
      window.removeEventListener('resize', checkScreenSize); // Cleanup listener on unmount
    };
  }, []);


  const fetchPreferences = async () => {
    const userId = localStorage.getItem("userId");
    const apiUrl = getBackendUrl();

    try {
      const response = await axios.post(`${apiUrl}/api/users/get-preferences`, { userId });
      const { company } = response.data;

      setBrand(company);
      setSearchTerm(company); // Set the search term for fetching mentions
      fetchData(company);

    } catch (error) {
      console.error("Error fetching preferences:", error);
    }
  };

  useEffect(() => {
    // Fetch followers only when brand is set
    if (brand) {
      fetchChartDatafollow();
    }
  }, [brand]);
  
 
const fetchChartDatafollow = async () => {
  try {
    const todayDate = getTodayDate();
    console.log(`${todayDate}`);
    setLoading(true);

    let brandlower = brand.toLowerCase();
        if (brand === "pepe jeans"){
          brandlower = "pepe_jeans"
        }

    const response = await axios.post(
      `https://search-devsocialhear-ngvsq7uyye5itqksxzscw2ngmm.aos.ap-south-1.on.aws/${brandlower}/_search`,
      {
        query: { match: { date: todayDate } },
        size: 1,
      },
      {
        auth: {
          username: "qartAdmin",
          password: "6#h!%HbsBH4zXRat@qFPSnfn@04#2023",
        },
      }
    );

    const hits = response.data.hits?.hits || [];
    console.log("Inside relevant data fetcher");
    if (hits.length > 0) {
      const { instagram = 10, twitter = 10, linkedin = 10 } = hits[0]._source;
      setFollowersData({ instagram, twitter, linkedin });
    } else {
      console.warn("No data found for today's date.");
      setFollowersData({ instagram: 20, twitter: 20, linkedin: 20 });
    }
  } catch (error) {
    console.error("Error fetching chart data:", error);
  } finally {
    setLoading(false);
  }
};


  // const fetchLastSearchedBrand = async () => {
  //   const userId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage
  //   const apiUrl = getBackendUrl();
  //   if (!userId) {
  //     console.error('User ID not found in localStorage');
  //     return;
  //   }

  //   try {
  //     const response = await axios.post(`${apiUrl}/api/users/search-history_userData`, // Your API endpoint
  //       {
  //         userId,
  //         limit: 1, // Fetch only the latest search
  //       }
  //     );

  //     if (response.data && response.data.length > 0) {
  //       const lastSearchedBrand = response.data[0].searched_brand;
  //       setBrand(lastSearchedBrand); // Update the brand in context
  //       setSearchTerm(lastSearchedBrand); // Set the search term for fetching mentions
  //       fetchData(lastSearchedBrand); // Fetch mentions for the last searched brand
  //     } else {
  //       console.log('No search history found for this user.');
  //     }
  //   } catch (error) {
  //     console.error('Error fetching last searched brand:', error);
  //   }
  // };

  // Function to fetch data from Elasticsearch
  const fetchData = async (query) => {
    try {
      setLoading(true); // Set loading state
      const response = await axios.post(
        'https://search-devsocialhear-ngvsq7uyye5itqksxzscw2ngmm.aos.ap-south-1.on.aws/filtered_tweets/_search',
        {
          query: {
            match: {
              Keyword: query || brand, // Query based on the search term or brand
            },
          },
          size: 1000, // Number of results to fetch
        },
        {
          auth: {
            username: 'qartAdmin',
            password: '6#h!%HbsBH4zXRat@qFPSnfn@04#2023', // Elasticsearch credentials
          },
        }
      );

      // Extract and format the results from Elasticsearch response
      const hits = response.data.hits.hits.map((hit) => hit._source);
      console.log('Data fetched');
      setMentions(hits); // Update mentions state
    } catch (error) {
      console.error('Error fetching data from Elasticsearch:', error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Handle search input from Header
  const handleSearch = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    setMentions([]); // Clear previous mentions
    fetchData(newSearchTerm);
  };

  function formatNumber(number) {
    if (number >= 1000000) {
      return (number / 1000000).toFixed(1) + "M"; // For millions
    } else if (number >= 1000) {
      return (number / 1000).toFixed(1) + "K"; // For thousands
    }
    return number.toString(); // For numbers less than 1000
  }
  

  return (
    <div className="mentions-page">
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="mentions-content">
        <Header onSearch={handleSearch} />
        <div className="flex justify-between items-center mb-4 ml-5 mr-5">
        <div className="flex items-center space-x-2 mb-4 ml-5">
          <button
            className={`w-[100px] h-[40px] flex items-center justify-center text-sm font-semibold  ${
              activeTab === 'analytics'
                ? 'bg-[#FFFFFF] border border-[#0E63F7] text-[#0E63F7]'
                : 'bg-[#F7F7F7] border border-[#E0E0E0] text-gray-600 hover:bg-[#E0E0E0] hover:text-black'
            }`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
          <button
            className={`w-[110px] h-[40px] flex items-center justify-center text-sm font-semibold  ${
              activeTab === 'conversations'
                ? 'bg-[#FFFFFF] border border-[#0E63F7] text-[#0E63F7]'
                : 'bg-[#F7F7F7] border border-[#E0E0E0] text-gray-600 hover:bg-[#E0E0E0] hover:text-black'
            }`}
            onClick={() => setActiveTab('conversations')}
          >
            Conversations
          </button>
          <div className="relative">
            <button
              className="w-[150px] h-[40px] flex items-center justify-between px-4 text-sm font-semibold bg-[#F7F7F7] border border-[#E0E0E0] text-gray-600 hover:bg-[#E0E0E0] hover:text-black rounded-md"
              disabled
            >
              <span>Last 30 Days</span>
              <svg
                className="w-4 h-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>
            
            {/* Dropdown Items (hidden for now) */}
            <div className="absolute left-0 w-full mt-1 bg-white border border-[#E0E0E0] shadow-lg rounded-md hidden">
              <div className="px-4 py-2 text-gray-700 cursor-pointer hover:bg-gray-100">
                Last 7 Days
              </div>
              <div className="px-4 py-2 text-gray-700 cursor-pointer hover:bg-gray-100">
                Last 30 Days
              </div>
              <div className="px-4 py-2 text-gray-700 cursor-pointer hover:bg-gray-100">
                Last 90 Days
              </div>
            </div>
          </div>

       </div>

       <div className="flex items-center space-x-6">
      {/* Twitter */}
      <div className="flex items-center space-x-2">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/6f/Logo_of_Twitter.svg"
          alt="Twitter"
          style={{ width: '28px', height: '28px' }}
        />
        <div className="flex flex-col leading-none">
          <span
            style={{
              fontFamily: 'Segoe UI',
              fontSize: '16px',
              fontWeight: '700',
              color: '#000000',
            }}
          >
           {loading ? "..." : formatNumber(followersData.twitter || 0)}
          </span>
          <span
            style={{
              fontFamily: 'Segoe UI',
              fontSize: '12px',
              fontWeight: '400',
              color: '#000000',
            }}
          >
            Followers
          </span>
        </div>
      </div>
      {/* Instagram */}
      <div className="flex items-center space-x-2">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg"
          alt="Instagram"
          style={{ width: '28px', height: '28px' }}
        />
        <div className="flex flex-col leading-none">
          <span
            style={{
              fontFamily: 'Segoe UI',
              fontSize: '16px',
              fontWeight: '700',
              color: '#000000',
            }}
          >
            {loading ? "..." : formatNumber(followersData.instagram || 0)}
          </span>
          <span
            style={{
              fontFamily: 'Segoe UI',
              fontSize: '12px',
              fontWeight: '400',
              color: '#000000',
            }}
          >
            Followers
          </span>
        </div>
      </div>
      {/* LinkedIn */}
      <div className="flex items-center space-x-2">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png"
          alt="LinkedIn"
          style={{ width: '28px', height: '28px' }}
        />
        <div className="flex flex-col leading-none">
          <span
            style={{
              fontFamily: 'Segoe UI',
              fontSize: '16px',
              fontWeight: '700',
              color: '#000000',
            }}
          >
            {loading ? "..." : formatNumber(followersData.linkedin || 0)}
          </span>
          <span
            style={{
              fontFamily: 'Segoe UI',
              fontSize: '12px',
              fontWeight: '400',
              color: '#000000',
            }}
          >
            Followers
          </span>
        </div>
      </div>
    </div>
  </div>

        {loading ? (
          <p>Loading mentions...</p>
        ) : (
          <>
            {activeTab === 'analytics' && <MentionsChart mentions={mentions} />}
            {activeTab === 'conversations' && (
              <div className="mentions-list">
                {mentions
                  .sort((a, b) => {
                    try {
                      const dateA = new Date(a.timestamp).getTime();
                      const dateB = new Date(b.timestamp).getTime();
                      if (!isNaN(dateA) && !isNaN(dateB)) {
                        return dateB - dateA;
                      }
                      return 0;
                    } catch {
                      return 0;
                    }
                  })
                  .map((mention, index) => (
                    <MentionCard
                      key={index}
                      mention={mention}
                      isInstagram={mention.source === 'instagram'}
                      isLinkedIn={mention.source === 'LinkedIn'}
                    />
                  ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MentionsPage;
