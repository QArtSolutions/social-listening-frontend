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

  // Fetch data when the component mounts or the search term changes
  useEffect(() => {
    fetchLastSearchedBrand();
    //  fetchData(searchTerm || brand);
  }, []);

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
        <div className="flex items-center space-x-2 border-b-2 border-gray-300 mb-4 ml-5">
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
              // <div className="mentions-list">
              //   {/* Render Mentions */}
              //   {mentions.map((mention, index) => (
              //     <MentionCard
              //       key={index}
              //       mention={mention}
              //       isInstagram={mention.source === 'instagram'}
              //       isLinkedIn={mention.source === 'LinkedIn'}
              //     />
              //   ))}
              // </div>
              <div className="mentions-list">
                {/* Render Mentions */}
                {mentions
                  .sort((a, b) => {
                    try {
                      const dateA = new Date(a.timestamp).getTime();
                      const dateB = new Date(b.timestamp).getTime();

                      // If both timestamps are valid, compare them
                      if (!isNaN(dateA) && !isNaN(dateB)) {
                        return dateB - dateA;
                      }

                      // If one timestamp is invalid, treat it as "equal" for sorting purposes
                      if (isNaN(dateA) || isNaN(dateB)) {
                        return 0;
                      }
                    } catch {
                      // On unexpected errors, treat timestamps as equal
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
