import React, { useState } from 'react';
import './SignUp.css'; // Import the CSS file for styling

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Email:', email, 'Password:', password);
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        {/* Add your logo here (replace with your logo image) */}
        <img src="https://tse1.mm.bing.net/th?id=OIP.Gbn-yi8QZV8ClA4VZrxIoAHaEd&pid=Api&P=0&h=180" alt="logo" className="logo" />

        <h2>Create an Account</h2>
        
        <form onSubmit={handleSubmit}>
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
      </div>
    </div>
  );
};

export default SignUp;
