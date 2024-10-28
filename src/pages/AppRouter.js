import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Entry from '../component/entry';
import SignUp from '../features/auth/SignUp';
import BrandPage from '../pages/BrandPage';

const AppRouter = ({ isAuthenticated, setIsAuthenticated }) => {
  

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <BrandPage setIsAuthenticated={setIsAuthenticated} /> : <Entry setIsAuthenticated={setIsAuthenticated} />} />
      <Route exact path="/home" element={isAuthenticated ? <BrandPage setIsAuthenticated={setIsAuthenticated} /> : <Entry setIsAuthenticated={setIsAuthenticated} />} />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/entry" element={<Entry setIsAuthenticated={setIsAuthenticated} />} />
      {/* Add more routes here */}
    </Routes>
  );
};

export default AppRouter;
