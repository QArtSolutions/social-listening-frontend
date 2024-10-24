
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './entry.css'; 

const Entry = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function loginUser(credentials) {
    try {
      const response = await fetch('http://localhost:3000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });
  
      if (!response.ok) {
        const errorData = await response.json();  // Get the error message
        throw new Error(errorData.message);
      }
  
      return await response.json();
  
    } catch (error) {
      console.error('Login error:', error.message);
      throw error;
    }
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const response = await loginUser({ email, password });
  
      // If login is successful, handle it
      window.localStorage.setItem("isLoggedIn", true);
      setIsAuthenticated(true);
      navigate('/');
      
    } catch (error) {
      setError(error.message);  // Display the error message in the UI
      setLoading(false);
    }
  };
  

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const response = await loginUser({ username, email, password });

//     if (response.success) {
//       window.localStorage.setItem("isLoggedIn", true);
//       setIsAuthenticated(true);
//       navigate('/');  
//     } else {
//       setError('Invalid credentials');
//       setLoading(false);
//     }
//   };

  return (
    <div className="login-container">
      <div className="login-card">
        <img src="./logo.png" alt="Qart Logo" className="logo" />
        <h2>Login To Your Account</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="signup-prompt">
  You don't have an account yet? <a href="http://localhost:3000/api/users/register">Create one now!</a>
</p>

      </div>
    </div>
  );
};

export default Entry;
