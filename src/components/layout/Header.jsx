import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/Header.css';
import { useBrand } from '../../contexts/BrandContext';
import axios from 'axios';
import { getBackendUrl  } from '../../utils/apiUrl.jsx';


const Header =({ onSearch }) => {
    const [searchInput, setSearchInput] = useState('');
    const { setBrand } = useBrand(); 
    const navigate = useNavigate();
    

    const handleSearch = async (e) => {
        
        e.preventDefault();
        // if (searchInput.trim() === '') return;

        onSearch(searchInput);  // Pass search input to the parent for API call
        setBrand(searchInput);

        try {
          const userId = window.localStorage.getItem("userId");
          const apiUrl= getBackendUrl();
          if (!userId) {
              console.error("User ID not found in local storage.");
              return;
          }
          
          // Save search history to backend
          await axios.post(`${apiUrl}/api/users/search-history`, {
              userId,
              searchedBrand: searchInput
          });
          console.log("user history saved successfully");
          setSearchInput(''); // Clear search bar after storing
      } catch (error) {
          console.error("Failed to save search history:", error);
      }

    };

    

    const handleLogout = () => {
      window.localStorage.removeItem("isLoggedIn"); 
      window.localStorage.removeItem("userId");
      // setIsAuthenticated(false); 
      navigate('/entry'); 
  };

    return (
        <header className="header bg-white shadow-sm flex items-center justify-center h-16 w-full fixed top-0 z-50">
            <div className="flex items-center justify-center w-[200px]">
            
                <img src="/SocialAwaz.png" alt="social awaz" className="logo-image w-8 h-8" />
                <span className="text-lg  text-white-800">
        Social Hear
      </span>
            
            </div>
            {/* <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search through mentions, authors & domains..."
                    className="search-bar"
                />
                <button type="submit" className="search-button">🔍</button>
            </form> */}
            <button onClick={handleLogout} className="logout-button">Logout</button>
        </header>
    );
};

export default Header;
