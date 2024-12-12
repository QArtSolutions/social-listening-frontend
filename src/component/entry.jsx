import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Make sure to install fontawesome
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { getBackendUrl } from '../utils/apiUrl.jsx';
import axios from 'axios';

const Entry = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function loginUser(credentials) {
    const apiUrl = getBackendUrl();
    try {
      const response = await fetch(`${apiUrl}/api/users/login`, {
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

  // Function to fetch the last searched brand after login
  const fetchLastSearchedBrand = async (userId) => {
    try {
      const apiUrl = getBackendUrl();
      const response = await axios.post(`${apiUrl}/api/users/search-history_user`, { userId, page: 1, limit: 1 });

      // Return the last searched brand from the response
      return response.data[0]?.searched_brand || null;
    } catch (error) {
      console.error('Error fetching search history:', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await loginUser({ email, password });
      const user = response.user;
      window.localStorage.setItem("isLoggedIn", true);
      window.localStorage.setItem("userId", user.id);
      setIsAuthenticated(true);

      // Fetch the last searched brand for the user after login
      const lastSearchedBrand = await fetchLastSearchedBrand(user.id);

      // Redirect to Mentions Page with the last searched brand if found, otherwise to Home Page
      if (lastSearchedBrand) {
        navigate('/mentions', { state: { brand: lastSearchedBrand } });
      } else {
        navigate('/home');
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-medium text-gray-800 text-center mb-6">
        Login To Your Account
      </h2>
        {error && <p className="text-red-500 text-center text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="mb-6 relative">
            <label
              htmlFor="email"
              className="absolute -top-2 left-4 bg-white px-1 text-sm text-blue-600"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Emai Id"
              className="w-full border border-blue-500 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Password Field */}
          <div className="mb-6 relative">
            <label
              htmlFor="password"
              className="absolute -top-2 left-4 bg-white px-1 text-sm text-blue-600"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="**********"
              className="w-full border border-blue-500 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Submit Button */}
         <button
  type="submit"
  className={`mx-auto block w-32 bg-blue-600 text-white py-2 text-md font-medium rounded hover:bg-blue-700 transition ${
    loading ? 'opacity-50 cursor-not-allowed' : ''
  }`}
  disabled={loading}
>
  {loading ? 'Logging in...' : 'Login'}
</button>
        </form>
        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-4">
          You don’t have an account yet?{' '}
          <button
            onClick={() => navigate('/signup')}
            className="text-blue-600 hover:underline"
          >
            Create one now!
          </button>
        </p>
      </div>
    </div>
  );
};

export default Entry;
