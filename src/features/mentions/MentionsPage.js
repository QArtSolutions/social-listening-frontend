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
  const [cursor, setCursor] = useState(null); // State to hold the cursor for pagination
  const { brand } = useBrand();

  const fetchMentions = async () => {
    if (!brand) {
      console.error("Brand is not defined.");
      return;
    }

    try {
      const url = 'https://twitter-pack.p.rapidapi.com/search/tweet';
      const options = {
        headers: {
          'x-rapidapi-key': '6009977b2amsh2d3f65eafe06fd2p12ec3fjsnc366b1c8aac1',
          'x-rapidapi-host': 'twitter-pack.p.rapidapi.com'
        },
        params: {
          query: brand,
          cursor: cursor // Pass the cursor for pagination
        }
      };

      const response = await axios.get(url, options);
      console.log("Full response:", response.data); // Debugging log

      // Ensure that 'data' is an array within response
      const mentionsData = response.data?.data?.data || []; // Adjust based on actual response structure
      const nextCursor = response.data?.data?.cursor; // Retrieve the next cursor from response

      if (Array.isArray(mentionsData)) {
        setMentions(prevMentions => [...prevMentions, ...mentionsData]);
      } else {
        console.error("Unexpected data format", mentionsData);
      }

      setCursor(nextCursor); // Update the cursor for the next page
    } catch (error) {
      console.error('Error fetching mentions:', error);
    }
  };

  useEffect(() => {
    fetchMentions();
  }, [brand]);

  return (
    <div className="mentions-page">
      <Sidebar />
      <div className="mentions-content">
        <Header />
        <MentionsChart mentions={mentions} />
        <div className="mentions-list">
          {mentions.map((mention, index) => (
            <MentionCard key={index} mention={mention} />
          ))}
        </div>
        {cursor && (
          <button onClick={fetchMentions}>Load More</button>
        )}
      </div>
    </div>
  );
};

export default MentionsPage;
