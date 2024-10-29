import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppRouter from './pages/AppRouter';
import './index.css';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loggedIn = window.localStorage.getItem("isLoggedIn") === "true";
    setIsAuthenticated(loggedIn);
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      
      <BrowserRouter>
        <AppRouter isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      </BrowserRouter>
    </div>
  );
}

export default App;
