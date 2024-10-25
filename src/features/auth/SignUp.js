import React, { useState } from 'react';
import './SignUp.css'; // Import the CSS file for styling
import { registerUser } from '../../services/api/auth';



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

    try {
      const response = await registerUser(username, email, password);
      console.log('Success:', response); // Check the API response
      setMessage('User registered successfully!');
      setMessageType('success');
    } catch (error) {
      console.error('Error:', error); // Log the error for debugging
      setMessage(error.message || 'Registration failed. Please try again.');
      setMessageType('error');
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">

        <img src="https://tse1.mm.bing.net/th?id=OIP.Gbn-yi8QZV8ClA4VZrxIoAHaEd&pid=Api&P=0&h=180" alt="logo" className="logo" />

        <h2>Create an Account</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Name</label>
            <input
              type="name"
              placeholder="Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Business Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="submit-btn">Sign Up</button>
        </form>

        <p>
          By signing up I agree to the
          <a href="/terms" target="_blank"> terms & conditions </a>
          and <a href="/privacy" target="_blank"> privacy policy</a>.
        </p>
        
        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp;
