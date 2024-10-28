import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from '../component/home';
import Entry from '../component/entry';
import SignUp from '../features/auth/SignUp';
import BrandPage from './BrandPage';

const AppRouter = ({ isAuthenticated, setIsAuthenticated }) => {
  const LoginButton = () => {
    const navigate = useNavigate();
    return (
      <div>
        <button onClick={() => navigate('/entry')}>Login</button>
      </div>
    );
  };

  return (
    
      <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Home isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
          ) : (
            <div>
              <Home />
              <LoginButton />
            </div>
          )
        }
      />
        {/* <Route exact path="/" element={<BrandPage />} /> */}
        <Route exact path="/signup" element={<SignUp />} />
        <Route path="/entry" element={<Entry setIsAuthenticated={setIsAuthenticated} />} />
        {/* Add more routes here */}
      </Routes>
    
  );
};


export default AppRouter;
