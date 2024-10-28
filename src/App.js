import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppRouter from './pages/AppRouter';

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
      <h1>Qart Solutions</h1>
      <h2>Social-Listening Platform</h2>
      <BrowserRouter>
        <AppRouter isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      </BrowserRouter>
    </div>
  );
}

export default App;
