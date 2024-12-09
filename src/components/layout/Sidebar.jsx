import React, { useState, useEffect } from 'react';
import { useBrand } from '../../contexts/BrandContext';
import { Link } from 'react-router-dom'; 
import axios from 'axios';
import { getBackendUrl  } from '../../utils/apiUrl.jsx';
import '../../styles/Sidebar.css';

const Sidebar = () => {
  const { brand } = useBrand(); // Access the brand name
  const [searchHistory, setSearchHistory] = useState([]); // State for storing search history
  const [page, setPage] = useState(1); // Current page of search history
  const [hasMore, setHasMore] = useState(true); // To determine if there are more items to load

  const itemsPerPage = 10; 

  // Fetch search history from backend when user is logged in
  useEffect(() => {
    const fetchSearchHistory = async () => {
      const userId = localStorage.getItem("userId"); // Assuming userId is stored in localStorage
      const apiUrl = getBackendUrl();
      if (userId) {
        try {
          const response = await axios.post(`${apiUrl}/api/users/search-history_user`, {
            userId,
            page,
            limit: itemsPerPage,
          });

          if (response.data.length < itemsPerPage) {
            setHasMore(false); // No more data to load
          }

          // Add unique search history items only
          setSearchHistory((prevHistory) => {
            const newHistory = response.data.map((item) => item.searched_brand);
            const uniqueHistory = Array.from(new Set([...prevHistory, ...newHistory]));
            return uniqueHistory;
          });
        } catch (error) {
          console.error('Error fetching search history:', error);
        }
      }
    };

    fetchSearchHistory();
  }, [page]);

  const loadMoreSearchHistory = () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1); // Increment page to load more data
    }
  };

  return (
    <aside className="sidebar">
      <div className="project-name">{brand}</div>
      <nav className="sidebar-links">
        <Link to="/mentions">Mentions</Link>
        <Link to="/comparision">Comparison</Link>
      </nav>

      <div className="search-history">
        <h4>Search History</h4>
        <ul>
          {searchHistory.length > 0 ? (
            searchHistory.map((historyItem, index) => (
              <li key={index}>{historyItem}</li>
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
