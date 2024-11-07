import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Make sure to install fontawesome
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import API_BASE_URL from '../config.js';

const Entry = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function loginUser(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
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
      const user = response.user;
      window.localStorage.setItem("isLoggedIn", true);
      window.localStorage.setItem("userId", user.id);
      setIsAuthenticated(true);
      navigate('/home');
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 flex flex-col justify-center">
        <h2 className="text-2xl font-serif text-gray-600 text-left mb-4">Login To Your Account</h2>
        {error && <div className="text-red-500 text-sm text-center mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <div className="mb-6 relative w-full">
            <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email"
              className="border-b border-gray-300 focus:border-blue-500 focus:outline-none w-full pl-10 pb-2 text-gray-600 placeholder-gray-300"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }} // Slightly transparent
            />
          </div>
          <div className="mb-6 relative w-full">
            <FontAwesomeIcon icon={faLock} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
              className="border-b border-gray-300 focus:border-blue-500 focus:outline-none w-full pl-10 pb-2 text-gray-600 placeholder-gray-300"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }} // Slightly transparent
            />
          </div>
          <button
            type="submit"
            className={`w-full bg-blue-600 text-white py-2 text-lg font-medium hover:bg-blue-700 transition duration-200 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="text-center mt-4">
          <p className="text-sm text-gray-500">
            You don't have an account yet?{' '}
            <button onClick={() => navigate('/signup')} className="text-blue-600 hover:underline">
              Create one now!
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Entry;
