import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Header.css';

const Header = () => {
    return (
      <header className="header">
        <Link to="/" className="logo">
          <img src="https://tse1.mm.bing.net/th?id=OIP.Gbn-yi8QZV8ClA4VZrxIoAHaEd&pid=Api&P=0&h=180" alt="Qart Logo" className="logo-image" /> {/* Logo Image */}
        </Link>
        <input type="text" placeholder="Search through mentions, authors & domains..." className="search-bar" />
        <Link to="/profile" className="profile-icon">👤</Link>
      </header>
    );
  };

export default Header;
