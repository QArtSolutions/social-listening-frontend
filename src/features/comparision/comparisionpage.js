// import React, { useState, useEffect } from 'react';
// import MentionsChart from '../mentions/MentionsChart';
// import MentionCard from '../mentions/MentionCard';
// import Sidebar from '../../components/layout/Sidebar';
// import Header from '../../components/layout/Header';
// import { useBrand } from '../../contexts/BrandContext';
// import axios from 'axios';
// import '../../styles/MentionsPage.css';

// const MentionsPage = () => {
//   const [mentions, setMentions] = useState([]);
//   const { brand } = useBrand();

//   useEffect(() => {
//     const fetchMentions = async () => {
//       try {
//         const url = 'https://instagram-scraper-api3.p.rapidapi.com/hashtag_media';
//         const options = {
//           headers: {
//             'x-rapidapi-key': 'b2a1325b3fmsh3ce6cd42aee1d93p15881cjsn7d38aeedbf83',
//             'x-rapidapi-host': 'instagram-scraper-api3.p.rapidapi.com'
//           },
//           params: {
//             hashtag: brand,
//             feed_type: 'recent'
//           }
//         };

//         const response = await axios.get(url, options);
        
//         console.log("Full response:", response.data); // Debugging log
//         const mentionsData = response.data.results || []; // Adjust based on actual response structure

//         setMentions(Array.isArray(mentionsData) ? mentionsData : []);
//       } catch (error) {
//         console.error('Error fetching mentions:', error);
//         setMentions([]); // Clear mentions on error
//       }
//     };

//     fetchMentions();
//   }, [brand]);

//   return (
//     <div className="mentions-page">
//       <Header />
//       <Sidebar projectName={brand}/>   
//       <div className="mentions-content">
//         <h2>Total Mentions for {brand}</h2>
//         <MentionsChart />
//         <div className="mentions-list">
//           {mentions.length > 0 ? (
//             mentions.map((mention, index) => (
//               <MentionCard key={mention.id || index} mention={mention} />
//             ))
//           ) : (
//             <p>No mentions found for this brand. Is the array empty</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MentionsPage;

import axios from 'axios';
import React, { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';
import ComparisonCard from './comparisioncard';

const ComparisonPage = () => {
  const [hashtag1, setHashtag1] = useState('');
  const [hashtag2, setHashtag2] = useState('');
  const [hashtag1Count, setHashtag1Count] = useState(0);
  const [hashtag2Count, setHashtag2Count] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHashtagData = async () => {
    if (!hashtag1 || !hashtag2) {
      alert("Please enter both hashtags.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const options1 = {
        method: 'GET',
        url: 'https://instagram-data1.p.rapidapi.com/hashtag/info',
        params: { hashtag: hashtag1 },
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

      // Fetch data for both hashtags concurrently
      const [response1, response2] = await Promise.all([
        axios.request(options1),
        axios.request(options2),
      ]);

      // Update counts based on the API response
      setHashtag1Count(response1.data.count);
      setHashtag2Count(response2.data.count);

    } catch (err) {
      setError('Failed to fetch data.');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* <Sidebar />
      <Header /> */}

      <div className="comparison-page">
        <h1>Instagram Hashtag Comparison</h1>
        
        <input
          type="text"
          placeholder="Enter first hashtag"
          value={hashtag1}
          onChange={(e) => setHashtag1(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter second hashtag"
          value={hashtag2}
          onChange={(e) => setHashtag2(e.target.value)}
        />
        
        <button onClick={fetchHashtagData}>Fetch Hashtag Data</button>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div className="results">
          <ComparisonCard 
            hashtag1={hashtag1} 
            hashtag1Count={hashtag1Count} 
            hashtag2={hashtag2} 
            hashtag2Count={hashtag2Count} 
          />
        </div>
      </div>
    </div>
  );
};

export default ComparisonPage;



//***** */ Below gives a json file kinda output****

// import axios from 'axios';
// import React, { useState } from 'react';
// import Sidebar from '../../components/layout/Sidebar';
// import Header from '../../components/layout/Header';

// const ComparisonPage = () => {
//   const [hashtag, setHashtag] = useState('');  // Use a single hashtag input
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const fetchHashtagData = async () => {
//     if (!hashtag) {
//       alert("Please enter a hashtag.");
//       return;
//     }

//     setLoading(true);
//     setError('');
//     setData(null);

//     try {
//       const url = 'https://instagram-scraper-api3.p.rapidapi.com/hashtag_media';
//       const options = {
//         headers: {
//           'x-rapidapi-key': 'b2a1325b3fmsh3ce6cd42aee1d93p15881cjsn7d38aeedbf83',
//           'x-rapidapi-host': 'instagram-scraper-api3.p.rapidapi.com'
//         },
//         params: { 
//           hashtag: hashtag,
//           feed_type: 'recent'
//          }
//       };

//       const response = await axios.get(url, options);
//       setData(response.data);  // Store the API response in state
//     } catch (err) {
//       setError('Error fetching data');
//       console.error('API Error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       {/* <Sidebar />
//       <Header /> */}
//       <div className="content">
//         <h1>Instagram Hashtag Data</h1>
        
//         <input
//           type="text"
//           value={hashtag}
//           onChange={(e) => setHashtag(e.target.value)}
//           placeholder="Enter a hashtag"
//         />
//         <button onClick={fetchHashtagData}>Fetch Hashtag Data</button>

//         {loading && <p>Loading...</p>}
//         {error && <p style={{ color: 'red' }}>{error}</p>}
        
//         {data && (
//           <div>
//             <h2>API Response</h2>
//             <pre>{JSON.stringify(data, null, 2)}</pre> {/* Display raw JSON */}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ComparisonPage;




// import React, { useState } from 'react';
// import Sidebar from '../../components/layout/Sidebar';
// import Header from '../../components/layout/Header';
// import { Line } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';

// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// const ComparisonPage = () => {
//   const [brand1, setBrand1] = useState('');
//   const [brand2, setBrand2] = useState('');
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');


//   const fetchComparisonData = async () => {
//     if (!brand1 || !brand2) {
//       alert("Please enter both hashtags.");
//       return;
//     }

//      const url = 'https://instagram-scraper-api3.p.rapidapi.com/hashtag_media';
//         const options = {
//           headers: {
//             'x-rapidapi-key': 'b2a1325b3fmsh3ce6cd42aee1d93p15881cjsn7d38aeedbf83',
//             'x-rapidapi-host': 'instagram-scraper-api3.p.rapidapi.com'
//           },
//           params: {
//             hashtag: brand1,
//             feed_type: 'recent'
//           }
//     };

//     setLoading(true);
//     setError('');

//     try {
//       const response = await fetch(url, options);
//       if (!response.ok) {
//         throw new Error(`Error ${response.status}: ${response.statusText}`);
//       }
//       const json = await response.json();
//       setData(json);
//     } catch (error) {
//       console.error("Error fetching data:", error.message);
//       setError(`Failed to fetch data: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };


//   return (
//     <div style={{ display: 'flex', minHeight: '100vh' }}>
//       <Sidebar />

//       <div style={{ flex: 1, marginLeft: '200px' }}> {/* Adjust sidebar width if necessary */}
//         <Header />

//         <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
//           <h2>Compare Hashtags</h2>
//           <div style={{ marginBottom: '20px' }}>
//             <label>
//               <span>Hashtag 1:</span>
//               <input
//                 type="text"
//                 value={brand1}
//                 onChange={(e) => setBrand1(e.target.value)}
//                 style={{ display: 'block', width: '100%', padding: '8px', margin: '10px 0' }}
//               />
//             </label>
//           </div>

//           <div style={{ marginBottom: '20px' }}>
//             <label>
//               <span>Hashtag 2:</span>
//               <input
//                 type="text"
//                 value={brand2}
//                 onChange={(e) => setBrand2(e.target.value)}
//                 style={{ display: 'block', width: '100%', padding: '8px', margin: '10px 0' }}
//               />
//             </label>
//           </div>

//           <button
//             onClick={fetchComparisonData}
//             style={{ padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}
//             disabled={loading}
//           >
//             {loading ? "Comparing..." : "Compare"}
//           </button>

//           {error && <p style={{ color: 'red' }}>{error}</p>}

//           {data && (
//             <div style={{ marginTop: '20px' }}>
//               <h3>Comparison Results</h3>
//               {/* Render chart or data visualization here */}
//               <Line
//                 data={{
//                   labels: data.dates, // Replace with actual data labels
//                   datasets: [
//                     {
//                       label: `#${brand1}`,
//                       data: data.brand1Data, // Replace with actual data
//                       borderColor: 'rgba(75, 192, 192, 1)',
//                       backgroundColor: 'rgba(75, 192, 192, 0.2)',
//                     },
//                     {
//                       label: `#${brand2}`,
//                       data: data.brand2Data, // Replace with actual data
//                       borderColor: 'rgba(255, 99, 132, 1)',
//                       backgroundColor: 'rgba(255, 99, 132, 0.2)',
//                     },
//                   ],
//                 }}
//                 options={{
//                   responsive: true,
//                   plugins: {
//                     legend: {
//                       position: 'top',
//                     },
//                     title: {
//                       display: true,
//                       text: 'Hashtag Comparison',
//                     },
//                   },
//                 }}
//               />
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ComparisonPage;
