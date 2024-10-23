import React, { useEffect, useState } from 'react';
import LoginButton from './component/login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './component/home';
import { useAuth0 } from "@auth0/auth0-react";

const App = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  const [login, setLogin] = useState(null);

  useEffect(() => {
    // Set login state only after checking the authentication status
    if (!isLoading) {
      setLogin(isAuthenticated || window.localStorage.getItem("isLogedIn") === "true");
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading || login === null) {
    // Show loading spinner while the authentication state is being checked
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Hello, This is a React App!</h1>
      <h2>Happy Coding!!</h2> 

      <BrowserRouter>
        <Routes>
          {/* Redirect to Home or Login based on login state */}
          <Route path="/" element={login ? <Home /> : <LoginButton />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
