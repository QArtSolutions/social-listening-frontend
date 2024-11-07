import React from 'react';
import { Link } from 'react-router-dom';
import { useBrand } from '../../contexts/BrandContext';
import '../../styles/Sidebar.css';

const Sidebar = () => {
  const { brand } = useBrand(); // Access the brand name

  return (
    <aside className="sidebar">
      <div className="project-name">
        {brand} {/* Display the project/brand name */}
      </div>
      <nav className="sidebar-links">
        <Link to="/mentions">Mentions</Link>
        <Link to="/comparision">Comparision</Link>
      </nav>
    </aside>
  );
};

export default Sidebar;