import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import ComparisonCard from './comparisioncard';
import { useBrand } from '../../contexts/BrandContext';
import './comparisioncard.css';

const indexName = 'filtered_tweets'; // Elasticsearch index name
const apiUrl = 'https://search-devsocialhear-ngvsq7uyye5itqksxzscw2ngmm.aos.ap-south-1.on.aws'; // OpenSearch API endpoint

const ComparisonPage = () => {
  
  const {Brand1} = useBrand(); 
  const [Brand2, setBrand2] = useState('');
  const [Brand1Input, setBrand1Input] = useState(Brand1);
  const [twitterCountBrand1, setTwitterCountBrand1] = useState(0);
  const [instagramCountBrand1, setInstagramCountBrand1] = useState(0);
  const [twitterCountBrand2, setTwitterCountBrand2] = useState(0);
  const [instagramCountBrand2, setInstagramCountBrand2] = useState(0);
  const [LinkedInCountBrand1, setLinkedInCountBrand1] = useState(0);
  const [LinkedInCountBrand2, setLinkedInCountBrand2] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Update local state with context value
  useEffect(() => {
    setBrand1Input(Brand1); // Set initial input value from Brand1 context
  }, [Brand1]);


  // const fetchHashtagData = async () => {
  //  

  //   setLoading(true);
  //   setError(null);

  // Function to search for a keyword in the 'filtered_tweets' index using Axios
  async function searchForKeyword(keyword) {
    try {
      const response = await axios.post(
        `${apiUrl}/${indexName}/_search`,
        {
          query: {
            match: {
              Keyword: keyword, 
            },
          },
        },
        {
          auth: {
            username: 'qartAdmin', 
            password: '6#h!%HbsBH4zXRat@qFPSnfn@04#2023',
          },
        }
      );
      return response.data.hits.hits; // Return documents that match the keyword
    } catch (error) {
      console.error(`Error searching for keyword "${keyword}" in OpenSearch:`, error.message);
      return [];
    }
  }

  // Function to filter results by source (Twitter or Instagram)
  async function filterBySource(results, source) {
    return results.filter((result) => result._source.source === source); // Filter results by source (Twitter or Instagram)
  }

  // Function to get the count of Twitter or Instagram sources for a given brand
  async function getSourceCountForBrand(brandKeyword, source) {
    const brandResults = await searchForKeyword(brandKeyword); // Get documents for the given brand keyword
    const filteredResults = await filterBySource(brandResults, source); // Filter by source
    return filteredResults.length; // Return the count of filtered results
  }

  // Function to get the count for Brand1's Twitter and Instagram sources
  async function getBrand1Counts() {
    const twitterCountBrand1 = await getSourceCountForBrand(Brand1Input, 'Twitter');
    const instagramCountBrand1 = await getSourceCountForBrand(Brand1Input, 'Instagram');
    const LinkedInCountBrand1 = await getSourceCountForBrand(Brand1Input, 'LinkedIn');
    console.log("Brand1 Counts: ", twitterCountBrand1, instagramCountBrand1);
    setTwitterCountBrand1(twitterCountBrand1);
    setInstagramCountBrand1(instagramCountBrand1);
    setLinkedInCountBrand1(LinkedInCountBrand1);
  }

  // Function to get the count for Brand2's Twitter and Instagram sources
  async function getBrand2Counts() {
    const twitterCountBrand2 = await getSourceCountForBrand(Brand2, 'Twitter');
    const instagramCountBrand2 = await getSourceCountForBrand(Brand2, 'Instagram');
    const LinkedInCountBrand2 = await getSourceCountForBrand(Brand2, 'LinkedIn');
    setTwitterCountBrand2(twitterCountBrand2);
    setInstagramCountBrand2(instagramCountBrand2);
    setLinkedInCountBrand2(LinkedInCountBrand2);
  }


  // Fetch and log the counts
  async function fetchCounts() {
    if (!Brand1Input || !Brand2) {
          alert("Please enter two different brands.");
          return;
        }

    setLoading(true);
    try {
      await getBrand1Counts();
      await getBrand2Counts();
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }

  

  return (
    <div className="comparison-container">
      <Sidebar />
      <div className="comparison-content">
        <Header />
        <div className="comparison-input">
          <h1>Social Media Brand Comparison</h1>
          <input
            type="text"
            placeholder={Brand1 || 'Enter name of first brand'}
            value={Brand1Input}
            onChange={(e) => setBrand1Input(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter name of second brand"
            value={Brand2}
            onChange={(e) => setBrand2(e.target.value)}
          />
          <button onClick={fetchCounts}>Compare</button>
        </div>

        {loading && <p className="loading-text">Loading...</p>}
        {error && <p className="error-text">{error}</p>}

        <div className="results">
          <ComparisonCard
            hashtag1={Brand1Input}
            hashtag2={Brand2}
            hashtag1Count={instagramCountBrand1 + twitterCountBrand1 + LinkedInCountBrand1}
            hashtag2Count={instagramCountBrand2 + twitterCountBrand2 + LinkedInCountBrand2}
            hashtag3Count={twitterCountBrand1}
            hashtag4Count={twitterCountBrand2}
            hashtag5Count={instagramCountBrand1}
            hashtag6Count={instagramCountBrand2}
            hashtag7Count={LinkedInCountBrand1}
            hashtag8Count={LinkedInCountBrand2}

          />
        </div>
      </div>
    </div>
  );
};

export default ComparisonPage;



  
//   // Set brand inputs
//   const {Brand1} = useBrand(); 
//   const [Brand2, setBrand2] = useState('brand2Keyword');
  
//   useEffect(() => {
//     setHashtag1Input(Brand1); // Update local state with context value
//   }, [Brand1]);

