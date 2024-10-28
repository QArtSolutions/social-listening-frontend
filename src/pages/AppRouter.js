import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from '../component/home';
import Entry from '../component/entry';
import SignUp from '../features/auth/SignUp';
import BrandPage from './BrandPage';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<BrandPage />} />
        <Route exact path="/signup" element={<SignUp />} />
        {/* Add more routes here */}
      </Routes>
    </Router>
  );
};

export default AppRouter;
