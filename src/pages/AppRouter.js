import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from '../component/home';
import Entry from '../component/entry';
import SignUp from '../features/auth/SignUp';

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
      <Route path="/entry" element={<Entry setIsAuthenticated={setIsAuthenticated} />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
};

export default AppRouter;
