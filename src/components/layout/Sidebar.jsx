import React, { useState, useEffect } from 'react';
import { useBrand } from '../../contexts/BrandContext';
import { Link } from 'react-router-dom'; 
import axios from 'axios';
import { getBackendUrl  } from '../../utils/apiUrl.jsx';
import '../../styles/Sidebar.css';

const Sidebar = () => {
  const { brand } = useBrand(); // Access the brand name
  const [insights, setInsights] = useState({
    totalMentions: 0,
    totalLikes: 0,
    totalPosts: 0
  }); // State for storing insights data
  const [searchHistory, setSearchHistory] = useState([]); // State for storing search history
  const [page, setPage] = useState(1); // Current page of search history
  const [hasMore, setHasMore] = useState(true); // To determine if there are more items to load

  const itemsPerPage = 10; 

  // Fetch search history from backend when user is logged in
  useEffect(() => {
    const fetchSearchHistory = async () => {
      const userId = localStorage.getItem("userId"); // Assuming userId is stored in localStorage
      const apiUrl= getBackendUrl();
      if (userId) {
        try {
    
          const response = await axios.post(`${apiUrl}/api/users/search-history_user`, {
             userId, page, limit: itemsPerPage 
          });

          if (response.data.length < itemsPerPage) {
            setHasMore(false); // No more data to load
          }

          setSearchHistory((prevHistory) => [...prevHistory, ...response.data]); // Append new search history items
        } catch (error) {
          console.error('Error fetching search history:', error);
        }
      }
    };

    fetchSearchHistory();
  }, [page]);
  // Fetch Twitter, Instagram, and Facebook insights data
  useEffect(() => {
    fetchTwitterInsights();
    fetchInstagramInsights();
    fetchFacebookInsights();
  }, [brand]);

  // Fetch Twitter insights
  const fetchTwitterInsights = async () => {
    try {
      const response = await axios.get('https://twitter-pack.p.rapidapi.com/search/tweet', {
        headers: {
          'x-rapidapi-key': '6009977b2amsh2d3f65eafe06fd2p12ec3fjsnc366b1c8aac1',
          'x-rapidapi-host': 'twitter-pack.p.rapidapi.com'
        },
        params: {
          query: `brand=${brand} clothing`, 
          count: 1000,
        }
      });

      const mentions = response.data?.data?.data || [];
      const totalMentions = mentions.length;
      const totalLikes = mentions.reduce((acc, mention) => acc + mention?.legacy?.favorite_count, 0);

      setInsights(prevInsights => ({
        ...prevInsights,
        totalMentions,
        totalLikes
      }));
    } catch (error) {
      console.error('Error fetching Twitter data:', error);
    }
  };

  // Fetch Instagram insights
  const fetchInstagramInsights = async () => {
    try {
      const options = {
        method: 'GET',
        url: 'https://instagram-best-experience.p.rapidapi.com/hashtag_section',
        params: {
          tag: brand,
          section: 'recent',
        },
        headers: {
          'x-rapidapi-key': '6009977b2amsh2d3f65eafe06fd2p12ec3fjsnc366b1c8aac1',
          'x-rapidapi-host': 'instagram-best-experience.p.rapidapi.com'
        }
      };

      const response = await axios.request(options);
      const instagramData = response.data?.data?.sections || [];
      const totalPosts = instagramData.length;
      const totalLikes = instagramData.reduce((acc, post) => acc + (post?.media?.like_count || 0), 0);

      setInsights(prevInsights => ({
        ...prevInsights,
        totalPosts,
        totalLikes
      }));
    } catch (error) {
      console.error('Error fetching Instagram data:', error);
    }
  };

  // Fetch Facebook insights
  const fetchFacebookInsights = async () => {
    try {
      const response = await axios.get('https://facebook-scraper3.p.rapidapi.com/search/posts', {
        headers: {
          'x-rapidapi-key': '6009977b2amsh2d3f65eafe06fd2p12ec3fjsnc366b1c8aac1',
          'x-rapidapi-host': 'facebook-scraper3.p.rapidapi.com'
        },
        params: {
          query: `brand=${brand} clothing`,
          recent_posts: true,
          count: 1000,
        }
      });

      const facebookPosts = response.data?.results || [];
      const totalPosts = facebookPosts.length*5;
      const totalReactions = facebookPosts.reduce((acc, post) => acc + (post?.reactions_count || 0), 0);

      setInsights(prevInsights => ({
        ...prevInsights,
        totalPosts,
        totalReactions
      }));
    } catch (error) {
      console.error('Error fetching Facebook data:', error);
    }
  };

  const loadMoreSearchHistory = () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1); // Increment page to load more data
    }
  };

  return (
    <aside className="sidebar">
      <div className="project-name">
        {brand}
      </div>
      <nav className="sidebar-links">
      <Link to="/mentions">Mentions</Link>
      <Link to="/comparision">Comparison</Link>
      </nav>

      {/* Insights Section */}
      {/* <div className="insights">
        <h4>Insights (past 3 days)</h4>
        <div className="insight-item">
          <strong>Total Mentions on X:</strong> {insights.totalMentions}
        </div>
        <div className="insight-item">
          <strong>Total Likes on instagram:</strong> {insights.totalLikes || 0}
        </div>
        <div className="insight-item">
          <strong>Total Posts on meta:</strong> {insights.totalPosts}
        </div>
      </div> */}
      {/* Search History Section */}
      <div className="search-history">
        <h4>Search History</h4>
        <ul>
          {searchHistory.length > 0 ? (
            searchHistory.map((historyItem, index) => (
              <li key={index}>{historyItem.searched_brand}</li> // Adjust based on your response shape
            ))
          ) : (
            <li>No search history found</li>
          )}
        </ul>
        {hasMore && (
          <button className="load-more-button" onClick={loadMoreSearchHistory}>
            Load More
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
