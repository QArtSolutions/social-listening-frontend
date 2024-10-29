import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Sidebar.css';

const Sidebar = ({projectName}) => {
  return (
      <aside className="sidebar">
        <div className="project-name">
          {projectName} {/* Display the project name */}
        </div>
        <nav className="sidebar-links">
          <Link to="/mentions">Mentions</Link>
          <Link to="/comparison">Comparison</Link>
        </nav>
      </aside>
  );
};

export default Sidebar;