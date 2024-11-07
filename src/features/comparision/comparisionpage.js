import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import ComparisonCard from './comparisioncard';
import { useBrand } from '../../contexts/BrandContext';
import './comparisioncard.css'; 

const ComparisonPage = () => {
  const { hashtag1 } = useBrand(); 
  const [hashtag1Input, setHashtag1Input] = useState(hashtag1); 
  const [hashtag2, setHashtag2] = useState('');
  const [hashtag1Count, setHashtag1Count] = useState(0);
  const [hashtag2Count, setHashtag2Count] = useState(0);
  const [hashtag3Count, setHashtag3Count] = useState(0);
  const [hashtag4Count, setHashtag4Count] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setHashtag1Input(hashtag1); // Update local state with context value
  }, [hashtag1]);

  const fetchHashtagData = async () => {
    if (!hashtag1Input || !hashtag2) {
      alert("Please enter two different hashtags.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const options1 = {
        method: 'GET',
        url: 'https://instagram-data1.p.rapidapi.com/hashtag/info',
        params: { hashtag: hashtag1Input }, 
        headers: {
          'X-RapidAPI-Key': 'b2a1325b3fmsh3ce6cd42aee1d93p15881cjsn7d38aeedbf83',
          'X-RapidAPI-Host': 'instagram-data1.p.rapidapi.com',
        },
      };

      const options2 = {
        method: 'GET',
        url: 'https://instagram-data1.p.rapidapi.com/hashtag/info',
        params: { hashtag: hashtag2 },
        headers: {
          'X-RapidAPI-Key': 'b2a1325b3fmsh3ce6cd42aee1d93p15881cjsn7d38aeedbf83',
          'X-RapidAPI-Host': 'instagram-data1.p.rapidapi.com',
        },
      };

      const options3 = {
        method: 'GET',
        url: 'https://get-twitter-mentions.p.rapidapi.com',
        params: { hashtag: hashtag1Input, period: 1 },
        headers: {
          'X-RapidAPI-Key': 'b2a1325b3fmsh3ce6cd42aee1d93p15881cjsn7d38aeedbf83',
          'X-RapidAPI-Host': 'get-twitter-mentions.p.rapidapi.com',
        },
      };

      const options4 = {
        method: 'GET',
        url: 'https://get-twitter-mentions.p.rapidapi.com',
        params: { hashtag: hashtag2, period: 1 },
        headers: {
          'X-RapidAPI-Key': 'b2a1325b3fmsh3ce6cd42aee1d93p15881cjsn7d38aeedbf83',
          'X-RapidAPI-Host': 'get-twitter-mentions.p.rapidapi.com',
        },
      };

      const [response1, response2, response3, response4] = await Promise.all([
        axios.request(options1),
        axios.request(options2),
        axios.request(options3),
        axios.request(options4),
      ]);

      setHashtag1Count(response1.data.count);
      setHashtag2Count(response2.data.count);
      setHashtag3Count(response3.data.length);
      setHashtag4Count(response4.data.length);

    } catch (err) {
      if (err.response && err.response.status === 429) {
        setError('API limit reached. Please try again later.');
      } else {
        setError('Failed to fetch data.');
      }
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="comparison-container">
      <Sidebar />
      <div className="comparison-content">
        <Header />

        <div className="comparison-input">
          <h1>Social Media Brand Comparison</h1>
          <input
            type="text"
            placeholder={hashtag1} 
            value={hashtag1Input} 
            onChange={(e) => setHashtag1Input(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter second brandname"
            value={hashtag2}
            onChange={(e) => setHashtag2(e.target.value)}
          />
          <button onClick={fetchHashtagData}>Compare</button>
        </div>

        {loading && <p className="loading-text">Loading...</p>}
        {error && <p className="error-text">{error}</p>}

        <div className="results">
          <ComparisonCard 
            hashtag1={hashtag1Input || hashtag1} // Use the state variable for hashtag1
            hashtag1Count={hashtag1Count} 
            hashtag2={hashtag2} 
            hashtag2Count={hashtag2Count} 
            hashtag3Count={hashtag3Count} 
            hashtag4Count={hashtag4Count} 
          />
        
        </div>
      </div>
    </div>
  );
};

export default ComparisonPage;



