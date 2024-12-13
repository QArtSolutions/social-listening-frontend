import React, { useState, useEffect } from "react";
import { useBrand } from "../../contexts/BrandContext";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { getBackendUrl } from "../../utils/apiUrl.jsx";
import { FiMessageSquare, FiBarChart2, FiUser } from "react-icons/fi"; 

const Sidebar = () => {
  const { brand } = useBrand(); // Access the brand name
  const [searchHistory, setSearchHistory] = useState([]); // State for storing search history
  const [page, setPage] = useState(1); // Current page of search history
  const [hasMore, setHasMore] = useState(true); // To determine if there are more items to load
  const location = useLocation();

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
          console.error("Error fetching search history:", error);
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
    <aside className="fixed top-20 left-0 w-52 h-[calc(100vh-4rem)] bg-white-800 text-black p-4 overflow-y-auto">
      {/* Project Name */}
      <div className="text-lg font-bold mb-4 text-black-500">
        {brand || "Brand Name"}
      </div>

      {/* Navigation Links */}
      <nav className="mb-6">
      <ul className="space-y-4">
        {/* Mentions */}
        <li
        className={`flex items-center p-2 rounded ${
          location.pathname === "/profile"
            ? "bg-[#0A66C2] text-white"
            : "text-black hover:text-red-500"
        }`}
      >
        <FiUser
          className={`text-xl mr-3 ${
            location.pathname === "/profile" ? "text-white" : "text-black"
          }`}
        />
        <Link
          to="/profile"
          className={`block ${
            location.pathname === "/profile" ? "text-white" : "text-black"
          }`}
        >
          Profile
        </Link>
      </li>


        <li
          className={`flex items-center p-2 rounded ${
            location.pathname === "/mentions"
              ? "bg-[#0A66C2] text-white"
              : "text-black hover:text-red-500"
          }`}
        >
          <FiMessageSquare
            className={`text-xl mr-3 ${
              location.pathname === "/mentions" ? "text-white" : "text-black"
            }`}
          />
          <Link
            to="/mentions"
            className={`block ${
              location.pathname === "/mentions" ? "text-white" : "text-black"
            }`}
          >
            Mentions
          </Link>
        </li>

        {/* Comparison */}
        <li
          className={`flex items-center p-2 rounded ${
            location.pathname === "/comparision"
              ? "bg-[#0A66C2] text-white"
              : "text-black hover:text-red-500"
          }`}
        >
          <FiBarChart2
            className={`text-xl mr-3 ${
              location.pathname === "/comparision" ? "text-white" : "text-black"
            }`}
          />
          <Link
            to="/comparision"
            className={`block ${
              location.pathname === "/comparision" ? "text-white" : "text-black"
            }`}
          >
            Comparison
          </Link>
        </li>
      </ul>
    </nav>

      {/* Search History */}
      
    </aside>
  );
};

export default Sidebar;
