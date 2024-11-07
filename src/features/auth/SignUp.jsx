import React, { useState, startTransition } from 'react';
import { registerUser } from '../../services/api/auth';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Make sure to install fontawesome
// import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';


const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Email:', email, 'Password:', password);

    setMessage('');
    setMessageType('');

    if (password.length < 7) {
      setMessage('Password must be at least 7 characters long.');
      setMessageType('error');
      return;
    }

    const usernamePattern = /^[a-zA-Z0-9 ]+$/;
    if (!usernamePattern.test(username)) {
      setMessage('Username can only contain letters, numbers, and spaces.');
      setMessageType('error');
      return;
    }

    startTransition(async () => {
      try {
        const response = await registerUser(username, email, password);
        console.log('Success:', response);
        setMessage('User registered successfully!');
        setMessageType('success');
      } catch (error) {
        console.error('Error:', error);
        setMessage(error.message || 'Registration failed. Please try again.');
        setMessageType('error');
      }
    });
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 flex flex-col">
        <h2 className="text-2xl font-serif text-gray-600 text-left mb-4">Create an Account</h2>
        
        {message && (
          <div className={`text-sm text-center mb-4 ${messageType === 'error' ? 'text-red-500' : 'text-green-500'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="mb-6 relative w-full">
            <input
              type="text"
              placeholder="Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="border-b border-gray-300 focus:border-blue-500 focus:outline-none w-full pb-2 text-gray-600 placeholder-gray-300"
            />
          </div>

          <div className="mb-6 relative w-full">
            <input
              type="email"
              placeholder="Business Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-b border-gray-300 focus:border-blue-500 focus:outline-none w-full pb-2 text-gray-600 placeholder-gray-300"
            />
          </div>

          <div className="mb-6 relative w-full">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border-b border-gray-300 focus:border-blue-500 focus:outline-none w-full pb-2 text-gray-600 placeholder-gray-300"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 text-lg font-medium hover:bg-blue-700 transition duration-200"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          By signing up I agree to the
          <a href="/terms" target="_blank" className="text-blue-600 hover:underline"> terms & conditions </a>
          and <a href="/privacy" target="_blank" className="text-blue-600 hover:underline"> privacy policy</a>.
        </p>
      </div>
    </div>

  );
};

export default SignUp;
