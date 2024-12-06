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
              keyword: keyword, 
            },
          },
        },
        {
          auth: {
            username: 'qartAdmin', // Your username for OpenSearch
            password: '6#h!%HbsBH4zXRat@qFPSnfn@04#2023', // Your password for OpenSearch
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
    const twitterCountBrand1 = await getSourceCountForBrand(Brand1, 'Twitter');
    const instagramCountBrand1 = await getSourceCountForBrand(Brand1, 'Instagram');
    console.log("Brand1 Counts: ", twitterCountBrand1, instagramCountBrand1);
    setTwitterCountBrand1(twitterCountBrand1);
    setInstagramCountBrand1(instagramCountBrand1);
  }

  // Function to get the count for Brand2's Twitter and Instagram sources
  async function getBrand2Counts() {
    const twitterCountBrand2 = await getSourceCountForBrand(Brand2, 'Twitter');
    const instagramCountBrand2 = await getSourceCountForBrand(Brand2, 'Instagram');
    setTwitterCountBrand2(twitterCountBrand2);
    setInstagramCountBrand2(instagramCountBrand2);
  }


  // Fetch and log the counts
  async function fetchCounts() {
    if (!Brand1Input || !Brand2) {
          alert("Please enter two different hashtags.");
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
            placeholder={Brand1 || 'Enter Brand 1'}
            value={Brand1Input}
            onChange={(e) => setBrand1Input(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter second brandname"
            value={Brand2}
            onChange={(e) => setBrand2(e.target.value)}
          />
          <button onClick={fetchCounts}>Compare</button>
        </div>

        {loading && <p className="loading-text">Loading...</p>}
        {error && <p className="error-text">{error}</p>}

        <div className="results">
          <ComparisonCard
            hashtag1={Brand1Input || Brand1}
            hashtag2={Brand2}
            hashtag1Count={instagramCountBrand1 + twitterCountBrand1}
            hashtag2Count={instagramCountBrand2 + twitterCountBrand2}
            hashtag3Count={twitterCountBrand1}
            hashtag4Count={twitterCountBrand2}
            hashtag5Count={instagramCountBrand1}
            hashtag6Count={instagramCountBrand2}
          />
        </div>
      </div>
    </div>
  );
};

export default ComparisonPage;


// import axios from 'axios';
// import React, { useState, useEffect } from 'react';
// import Sidebar from '../../components/layout/Sidebar';
// import Header from '../../components/layout/Header';
// import ComparisonCard from './comparisioncard';
// import { useBrand } from '../../contexts/BrandContext';
// import './comparisioncard.css';

// const { Client } = require('@opensearch-project/opensearch');

// const client = new Client({
//   node: 'https://search-devsocialhear-ngvsq7uyye5itqksxzscw2ngmm.aos.ap-south-1.on.aws',
//   auth: {
//     username: 'qartAdmin',
//     password: '6#h!%HbsBH4zXRat@qFPSnfn@04#2023',
//   },
// });

// const indexName = 'filtered_tweets';

// // Set brand inputs
// const { Brand1 } = useBrand();
// const [Brand2, setBrand2] = useState('brand2Keyword');
// const [Brand1Input, setHashtag1Input] = useState(Brand1);
// const [twitterCountBrand1, setTwitterCountBrand1] = useState(0);
// const [instagramCountBrand1, setInstagramCountBrand1] = useState(0);
// const [twitterCountBrand2, setTwitterCountBrand2] = useState(0);
// const [instagramCountBrand2, setInstagramCountBrand2] = useState(0);
// const [loading, setLoading] = useState(false);
// const [error, setError] = useState(null);

// useEffect(() => {
//   setHashtag1Input(Brand1); // Update local state with context value
// }, [Brand1]);

// // Function to search for a keyword in the 'final_tweets' index
// async function searchForKeyword(keyword) {
//   try {
//     const response = await client.search({
//       index: indexName,
//       body: {
//         query: {
//           match: {
//             keyword: keyword, // Assuming the brand keywords are stored in the "keyword" column
//           },
//         },
//       },
//     });
//     return response.body.hits.hits; // Return documents that match the keyword
//   } catch (error) {
//     console.error(`Error searching for keyword "${keyword}" in Elasticsearch:`, error.message);
//     return [];
//   }
// }

// // Function to filter results by source (Twitter or Instagram)
// async function filterBySource(results, source) {
//   return results.filter((result) => result._source.source === source); // Filter results by source (Twitter or Instagram)
// }

// // Function to get the count of Twitter or Instagram sources for a given brand
// async function getSourceCountForBrand(brandKeyword, source) {
//   const brandResults = await searchForKeyword(brandKeyword); // Get documents for the given brand keyword
//   const filteredResults = await filterBySource(brandResults, source); // Filter by source
//   return filteredResults.length; // Return the count of filtered results
// }

// // Function to get the count for Brand1's Twitter and Instagram sources
// async function getBrand1Counts() {
//   const twitterCountBrand1 = await getSourceCountForBrand(Brand1, 'Twitter');
//   const instagramCountBrand1 = await getSourceCountForBrand(Brand1, 'Instagram');
//   setTwitterCountBrand1(twitterCountBrand1);
//   setInstagramCountBrand1(instagramCountBrand1);
// }

// // Function to get the count for Brand2's Twitter and Instagram sources
// async function getBrand2Counts() {
//   const twitterCountBrand2 = await getSourceCountForBrand(Brand2, 'Twitter');
//   const instagramCountBrand2 = await getSourceCountForBrand(Brand2, 'Instagram');
//   setTwitterCountBrand2(twitterCountBrand2);
//   setInstagramCountBrand2(instagramCountBrand2);
// }

// // Fetch and log the counts
// async function fetchCounts() {
//   setLoading(true);
//   try {
//     await getBrand1Counts();
//     await getBrand2Counts();
//   } catch (err) {
//     setError('Failed to fetch data');
//   } finally {
//     setLoading(false);
//   }
// }

// // Function component - This is the opening curly brace for ComparisonPage
// const ComparisonPage = () => {
//   return (
//     <div className="comparison-container">
//       <Sidebar />
//       <div className="comparison-content">
//         <Header />
//         <div className="comparison-input">
//           <h1>Social Media Brand Comparison</h1>
//           <input
//             type="text"
//             placeholder={Brand1}
//             value={Brand1Input}
//             onChange={(e) => setHashtag1Input(e.target.value)}
//           />
//           <input
//             type="text"
//             placeholder="Enter second brandname"
//             value={Brand2}
//             onChange={(e) => setBrand2(e.target.value)}
//           />
//           <button onClick={fetchCounts}>Compare</button>
//         </div>

//         {loading && <p className="loading-text">Loading...</p>}
//         {error && <p className="error-text">{error}</p>}

//         <div className="results">
//           <ComparisonCard
//             hashtag1={Brand1Input || Brand1}
//             hashtag2={Brand2}
//             hashtag1Count={instagramCountBrand1 + twitterCountBrand1}
//             hashtag2Count={instagramCountBrand2 + twitterCountBrand2}
//             hashtag3Count={twitterCountBrand1}
//             hashtag4Count={twitterCountBrand2}
//             hashtag5Count={instagramCountBrand1}
//             hashtag6Count={instagramCountBrand2}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ComparisonPage;




// import axios from 'axios';
// import React, { useState, useEffect } from 'react';
// import Sidebar from '../../components/layout/Sidebar';
// import Header from '../../components/layout/Header';
// import ComparisonCard from './comparisioncard';
// import { useBrand } from '../../contexts/BrandContext';
// import './comparisioncard.css'; 



// const { Client } = require("@opensearch-project/opensearch");

// const client = new Client({
//     node: 'https://search-devsocialhear-ngvsq7uyye5itqksxzscw2ngmm.aos.ap-south-1.on.aws',
//     auth: {
//         username: 'qartAdmin',
//         password: '6#h!%HbsBH4zXRat@qFPSnfn@04#2023',
//       },
//   });

// const indexName = 'filtered_tweets';
  
//   // Set brand inputs
//   const {Brand1} = useBrand(); 
//   const [Brand2, setBrand2] = useState('brand2Keyword');
  
//   useEffect(() => {
//     setHashtag1Input(Brand1); // Update local state with context value
//   }, [Brand1]);


//   // Function to search for a keyword in the 'final_tweets' index
//   async function searchForKeyword(keyword) {
//     try {
//       const response = await client.search({
//         index: indexName,
//         body: {
//           query: {
//             match: {
//               keyword: keyword, // Assuming the brand keywords are stored in the "keyword" column
//             },
//           },
//         },
//       });
//       return response.body.hits.hits; // Return documents that match the keyword
//     } catch (error) {
//       console.error(`Error searching for keyword "${keyword}" in Elasticsearch:`, error.message);
//       return [];
//     }
//   }
  
//   // Function to filter results by source (Twitter or Instagram)
//   async function filterBySource(results, source) {
//     return results.filter(result => result._source.source === source); // Filter results by source (Twitter or Instagram)
//   }
  
//   // Function to get the count of Twitter or Instagram sources for a given brand
//   async function getSourceCountForBrand(brandKeyword, source) {
//     const brandResults = await searchForKeyword(brandKeyword); // Get documents for the given brand keyword
//     const filteredResults = await filterBySource(brandResults, source); // Filter by source
//     return filteredResults.length; // Return the count of filtered results
//   }
  
//   // Function to get the count for Brand1's Twitter and Instagram sources
//   async function getBrand1Counts() {
//     const twitterCountBrand1 = await getSourceCountForBrand(Brand1, 'Twitter');
//     const instagramCountBrand1 = await getSourceCountForBrand(Brand1, 'Instagram');
//     return { twitterCountBrand1, instagramCountBrand1 };
//   }
  
//   // Function to get the count for Brand2's Twitter and Instagram sources
//   async function getBrand2Counts() {
//     const twitterCountBrand2 = await getSourceCountForBrand(Brand2, 'Twitter');
//     const instagramCountBrand2 = await getSourceCountForBrand(Brand2, 'Instagram');
//     return { twitterCountBrand2, instagramCountBrand2 };
//   }
  
//   // Fetch and log the counts
//   async function fetchCounts() {
//     const brand1Counts = await getBrand1Counts();
//     const brand2Counts = await getBrand2Counts();
//     console.log('Brand 1 Counts:', brand1Counts);
//     console.log('Brand 2 Counts:', brand2Counts);
//   }
  
//   // Call the function to fetch counts
//   fetchCounts();
  

//   return (
//     <div className="comparison-container">
//       <Sidebar />
//       <div className="comparison-content">
//         <Header />

//         <div className="comparison-input">
//           <h1>Social Media Brand Comparison</h1>
//           <input
//             type="text"
//             placeholder={Brand1} 
//             value={Brand1Input} 
//             onChange={(e) => setHashtag1Input(e.target.value)}
//           />
//           <input
//             type="text"
//             placeholder="Enter second brandname"
//             value={Brand1}
//             onChange={(e) => setHashtag2(e.target.value)}
//           />
//           <button onClick={fetchHashtagData}>Compare</button>
//         </div>

//         {loading && <p className="loading-text">Loading...</p>}
//         {error && <p className="error-text">{error}</p>}

//         <div className="results">
//           <ComparisonCard 
//             Brand1={Brand1Input || Brand1} // Use the state variable for hashtag1
//             twitterCountBrand1={twitterCountBrand1} 
//             Brand2={Brand2} 
//             twitterCountBrand1={twitterCountBrand1} 
//             instagramCountBrand1={instagramCountBrand1} 
//             instagramCountBrand2={instagramCountBrand2} 
//           />
        
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ComparisonPage;






//  // // Export the functions if needed
//   // module.exports = {
//   //   instagramCountBrand1,
//   //   twitterCountBrand1,
//   //   twitterCountBrand1,
//   //   instagramCountBrand2,
//   //   Brand1,
//   //   Brand2,
//   // };




// // const ComparisonPage = () => {
// //   const {
// //     instagramCountBrand1,
// //     twitterCountBrand1,
// //     twitterCountBrand1,
// //     instagramCountBrand2,
// //     Brand1,
// //     Brand2,
// //   } = require('./searchData');
// //   const { hashtag1 } = useBrand(); 
// //   const [hashtag1Input, setHashtag1Input] = useState(hashtag1); 
// //   const [hashtag2, setHashtag2] = useState('');
// //   const [hashtag1Count, setHashtag1Count] = useState(0);
// //   const [hashtag2Count, setHashtag2Count] = useState(0);
// //   const [hashtag3Count, setHashtag3Count] = useState(0);
// //   const [hashtag4Count, setHashtag4Count] = useState(0);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState(null);

// //   useEffect(() => {
// //     setHashtag1Input(hashtag1); // Update local state with context value
// //   }, [hashtag1]);

// //   const fetchHashtagData = async () => {
// //     if (!hashtag1Input || !hashtag2) {
// //       alert("Please enter two different hashtags.");
// //       return;
// //     }

// //     setLoading(true);
// //     setError(null);

// //     try {
// //       const options1 = {
// //         method: 'GET',
// //         url: 'https://instagram-data1.p.rapidapi.com/hashtag/info',
// //         params: { hashtag: hashtag1Input }, 
// //         headers: {
// //           'X-RapidAPI-Key': '6009977b2amsh2d3f65eafe06fd2p12ec3fjsnc366b1c8aac1',
// //           'X-RapidAPI-Host': 'instagram-data1.p.rapidapi.com',
// //         },
// //       };

// //       const options2 = {
// //         method: 'GET',
// //         url: 'https://instagram-data1.p.rapidapi.com/hashtag/info',
// //         params: { hashtag: hashtag2 },
// //         headers: {
// //           'X-RapidAPI-Key': '6009977b2amsh2d3f65eafe06fd2p12ec3fjsnc366b1c8aac1',
// //           'X-RapidAPI-Host': 'instagram-data1.p.rapidapi.com',
// //         },
// //       };

// //       const options3 = {
// //         method: 'GET',
// //         url: 'https://instagram-statistics-api.p.rapidapi.com/search',
// //         params: { q: hashtag1Input, page: 1, perPage: 10, socialTypes: 'TW', trackTotal: true},
// //         headers: {
// //           'X-RapidAPI-Key': '6009977b2amsh2d3f65eafe06fd2p12ec3fjsnc366b1c8aac1',
// //           'X-RapidAPI-Host': 'instagram-statistics-api.p.rapidapi.com',
// //         },
// //       };

// //       const options4 = {
// //         method: 'GET',
// //         url: 'https://instagram-statistics-api.p.rapidapi.com/search',
// //         params: { q: hashtag2, page: 1, perPage: 10, socialTypes: 'TW', trackTotal: true },
// //         headers: {
// //           'X-RapidAPI-Key': '6009977b2amsh2d3f65eafe06fd2p12ec3fjsnc366b1c8aac1',
// //           'X-RapidAPI-Host': 'instagram-statistics-api.p.rapidapi.com',
// //         },
// //       };

// //       const [response1, response2, response3, response4] = await Promise.all([
// //         axios.request(options1),
// //         axios.request(options2),
// //         axios.request(options3),
// //         axios.request(options4),
// //       ]);

// //       setHashtag1Count(response1.data.count);
// //       setHashtag2Count(response2.data.count);
// //       setHashtag3Count(response3.data.pagination.total);
// //       setHashtag4Count(response4.data.pagination.total);

// //     } catch (err) {
// //       if (err.response && err.response.status === 429) {
// //         setError('API limit reached. Please try again later.');
// //       } else {
// //         setError('Failed to fetch data.');
// //       }
// //       console.error('API Error:', err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };
