import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/Header.css';
import { useBrand } from '../../contexts/BrandContext';

const Header = ({ onSearch }) => {
    const [searchInput, setSearchInput] = useState('');
    const { setBrand } = useBrand(); 
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        // if (searchInput.trim() === '') return;

        onSearch(searchInput);  // Pass search input to the parent for API call
        setSearchInput('');
        setBrand(searchInput);
    };

    const handleLogout = () => {
      window.localStorage.removeItem("isLoggedIn"); 
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
