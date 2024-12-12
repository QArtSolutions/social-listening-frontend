import React, { useState, startTransition } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import { registerUser } from '../../services/api/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Make sure to install FontAwesome
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

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
        setTimeout(() => navigate('/entry'), 1000); // Redirect to login after 1-second delay
      } catch (error) {
        console.error('Error:', error);
        setMessage(error.message || 'Registration failed. Please try again.');
        setMessageType('error');
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      {/* Top Header with Logo and Text */}
      <header className="absolute top-0 left-0 w-full flex items-center p-6">
        <img
          src="/SocialAwaz (8).png"
          alt="Social Hear"
          className="mr-3"
          style={{ width: '80px', height: '80px' }}
        />
      <h1
  className="text-xl font-medium text-gray-800"
  style={{ marginLeft: '-2%' }}
>
  Social Hear
</h1>
      </header>

      {/* Centered SignUp Form */}
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-medium text-gray-800 text-center mb-6">Create an Account</h2>

          {message && (
            <div
              className={`text-sm text-center mb-4 ${
                messageType === 'error' ? 'text-red-500' : 'text-green-500'
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Name Field */}
            <div className="mb-6 relative">
              <label
                htmlFor="name"
                className="absolute -top-2 left-4 bg-white px-1 text-sm"
                style={{ color: '#0A66C2' }}
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="User Name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full border rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2"
                style={{
                  borderColor: '#0A66C2',
                  focus: { borderColor: '#0A66C2' },
                }}
              />
            </div>

            {/* Email Field */}
            <div className="mb-6 relative">
              <label
                htmlFor="email"
                className="absolute -top-2 left-4 bg-white px-1 text-sm"
                style={{ color: '#0A66C2' }}
              >
                Business Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Email Id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2"
                style={{
                  borderColor: '#0A66C2',
                  focus: { borderColor: '#0A66C2' },
                }}
              />
            </div>

            {/* Password Field */}
            <div className="mb-6 relative">
              <label
                htmlFor="password"
                className="absolute -top-2 left-4 bg-white px-1 text-sm"
                style={{ color: '#0A66C2' }}
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="**********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2"
                style={{
                  borderColor: '#0A66C2',
                  focus: { borderColor: '#0A66C2' },
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="mx-auto block w-32 py-2 text-md font-medium rounded-lg hover:bg-blue-700 transition duration-200"
              style={{
                backgroundColor: '#0A66C2',
                color: 'white',
              }}
            >
              Sign Up
            </button>
          </form>

          {/* Terms and Conditions */}
          <p className="text-center text-sm text-gray-500 mt-4">
            By signing up I agree to the
            <a
              href="/terms"
              target="_blank"
              className="hover:underline"
              style={{ color: '#0A66C2' }}
            >
              {' '}
              terms & conditions{' '}
            </a>
            and
            <a
              href="/privacy"
              target="_blank"
              className="hover:underline"
              style={{ color: '#0A66C2' }}
            >
              {' '}
              privacy policy
            </a>
            .
          </p>

          {/* Already have an account */}
          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/entry')}
              className="hover:underline font-medium"
              style={{ color: '#0A66C2' }}
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
export default SignUp;
