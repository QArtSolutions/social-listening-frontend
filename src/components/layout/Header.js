import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/Header.css';
import { useBrand } from '../../contexts/BrandContext';
import axios from 'axios';

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
          if (!userId) {
              console.error("User ID not found in local storage.");
              return;
          }

          // Save search history to backend
          await axios.post('http://dev-backend.socialhear.com/api/users/search-history', {
              userId,
              searchedBrand: searchInput
          });

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
        <header className="header">
            <Link to="/" className="logo">
                <img src="/SocialAwaz.png" alt="social awaz" className="logo-image" />
            </Link>
            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search through mentions, authors & domains..."
                    className="search-bar"
                />
                <button type="submit" className="search-button">🔍</button>
            </form>
            <button onClick={handleLogout} className="logout-button">Logout</button>
        </header>
    );
};

export default Header;
