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
  const { brand, setBrand } = useBrand();

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

  useEffect(() => {
    fetchLastSearchedBrand();
    checkScreenSize(); // Check and adjust zoom level on component mount
    window.addEventListener('resize', checkScreenSize); // Recheck on window resize

    return () => {
      window.removeEventListener('resize', checkScreenSize); // Cleanup listener on unmount
    };
  }, []);

  const fetchLastSearchedBrand = async () => {
    const userId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage
    const apiUrl = getBackendUrl();
    if (!userId) {
      console.error('User ID not found in localStorage');
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/api/users/search-history_userData`, // Your API endpoint
        {
          userId,
          limit: 1, // Fetch only the latest search
        }
      );

      if (response.data && response.data.length > 0) {
        const lastSearchedBrand = response.data[0].searched_brand;
        setBrand(lastSearchedBrand); // Update the brand in context
        setSearchTerm(lastSearchedBrand); // Set the search term for fetching mentions
        fetchData(lastSearchedBrand); // Fetch mentions for the last searched brand
      } else {
        console.log('No search history found for this user.');
      }
    } catch (error) {
      console.error('Error fetching last searched brand:', error);
    }
  };

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

  return (
    <div className="mentions-page">
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="mentions-content">
        <Header onSearch={handleSearch} />
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
