import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <Link to="/mentions">Mentions</Link>
      <Link to="/comparison">Comparison</Link>
    </aside>
  );
};

export default Sidebar;