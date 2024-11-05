import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Header.css';

const Header = () => {
    return (
      <header className="header">
        <Link to="/" className="logo">
          <img src="/SocialAwaz.png" alt="social awaz" className="logo-image" /> {/* Logo Image */}
        </Link>
        <input type="text" placeholder="Search through mentions, authors & domains..." className="search-bar" />
        <Link to="/profile" className="profile-icon">👤</Link>
      </header>
    );
  };

export default Header;
