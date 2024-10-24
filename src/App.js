
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './component/home';
import Entry from './component/entry'; // New page for login form

const App = () => {
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
        <Routes>
          <Route path="/" element={isAuthenticated ? <Home /> : <LoginButton />} />
          <Route path="/entry" element={<Entry setIsAuthenticated={setIsAuthenticated} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

const LoginButton = () => {
  const navigate = useNavigate();
  
  return (
    <div>
      <button onClick={() => navigate('/entry')}>Login</button>
    </div>
  );
};

export default App;
