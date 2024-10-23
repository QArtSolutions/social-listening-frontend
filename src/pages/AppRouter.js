import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from '../features/auth/SignUp';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        {/* Add more routes here */}
      </Routes>
    </Router>
  );
};

export default AppRouter;

