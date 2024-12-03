import React, { useState, useEffect } from 'react';
import MentionsChart from './MentionsChart';
import MentionCard from './MentionCard';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import { useBrand } from '../../contexts/BrandContext';
import axios from 'axios';
import '../../styles/MentionsPage.css';

const MentionsPage = () => {
  const [mentions, setMentions] = useState([]); // State for mentions (Twitter, Instagram, Facebook combined)
  const [searchTerm, setSearchTerm] = useState(''); // State for search input
  const [loading, setLoading] = useState(false); // State for loading indicator
  const { brand } = useBrand();

  // Function to fetch data from Elasticsearch
  const fetchData = async (query) => {
    try {
      setLoading(true); // Set loading state
      const response = await axios.post(
        'https://search-devsocialhear-ngvsq7uyye5itqksxzscw2ngmm.aos.ap-south-1.on.aws/final_tweets/_search',
        {
          query: {
            match: {
              Keyword: query || brand, // Query based on the search term or brand
            },
          },
          size: 20, // Number of results to fetch
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
      console.log("data fetched");
      setMentions(hits); // Update mentions state
    } catch (error) {
      console.error('Error fetching data from Elasticsearch:', error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Fetch data when the component mounts or the search term changes
  useEffect(() => {
    fetchData(searchTerm || brand);
  }, [brand, searchTerm]);

  // Handle search input from Header
  const handleSearch = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    setMentions([]); // Clear previous mentions
  };

  return (
    <div className="mentions-page">
      <Sidebar />
      <div className="mentions-content">
        <Header onSearch={handleSearch} />
        {loading ? (
          <p>Loading mentions...</p>
        ) : (
          <>
            <MentionsChart mentions={mentions} />
            <div className="mentions-list">
              {/* Render Mentions */}
              {mentions.map((mention, index) => (
                <MentionCard
                  key={index}
                  mention={mention}
                  isInstagram={mention.source === 'instagram'}
                  isFacebook={mention.source === 'facebook'}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MentionsPage;
