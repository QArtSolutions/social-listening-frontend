import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">Qart</Link>
      <input type="text" placeholder="Search through mentions, authors & domains..." className="search-bar" />
      <Link to="/profile" className="profile-icon">👤</Link>
    </nav>
  );
};

export default Navbar;