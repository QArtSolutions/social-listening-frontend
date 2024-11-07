import React, { useState, useEffect } from 'react';
import MentionsChart from './MentionsChart';
import MentionCard from './MentionCard';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import { useBrand } from '../../contexts/BrandContext';
import axios from 'axios';
import '../../styles/MentionsPage.css';

const MentionsPage = () => {
  const [mentions, setMentions] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // State for search input
  const [cursor, setCursor] = useState(null); // State to hold the cursor for pagination
  const { brand } = useBrand();

  // Function to fetch mentions based on current search term or brand
  const fetchMentions = async (query) => {
    try {
      const url = 'https://twitter-pack.p.rapidapi.com/search/tweet';
      const options = {
        headers: {
          'x-rapidapi-key': '6009977b2amsh2d3f65eafe06fd2p12ec3fjsnc366b1c8aac1',
          'x-rapidapi-host': 'twitter-pack.p.rapidapi.com'
        },
        params: {
          query: `brand=${query || brand} clothing`, // Use either searchTerm or initial brand
          cursor: cursor, // Pass the cursor for pagination
          count: 1000
        }
      };

      const response = await axios.get(url, options);
      console.log("Full response:", response.data); // Debugging log

      const mentionsData = response.data?.data?.data || [];
      const nextCursor = response.data?.data?.cursor; // Retrieve the next cursor from response

      // Update mentions with new data if available
      setMentions(cursor ? (prevMentions) => [...prevMentions, ...mentionsData] : mentionsData);
      setCursor(nextCursor);
    } catch (error) {
      console.error('Error fetching mentions:', error);
    }
  };

  useEffect(() => {
    fetchMentions(searchTerm || brand); // Initially fetch data based on brand or searchTerm
  }, [brand, searchTerm]);

  // Handle search input from Header
  const handleSearch = (newSearchTerm) => {
    setCursor(null); // Reset cursor for new search
    setSearchTerm(newSearchTerm); // Update search term to trigger fetch
  };

  return (
    <div className="mentions-page">
      <Sidebar />
      <div className="mentions-content">
        <Header onSearch={handleSearch} /> {/* Pass search function to Header */}
        <MentionsChart mentions={mentions} />
        <div className="mentions-list">
          {mentions.map((mention, index) => (
            <MentionCard key={index} mention={mention} />
          ))}
        </div>
        {cursor && (
          <button className="load-more-button" onClick={() => fetchMentions(searchTerm || brand)}>Load More</button>
        )}
      </div>
    </div>
  );
};

export default MentionsPage;
