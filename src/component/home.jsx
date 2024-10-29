  import React from 'react';

  const Home = ({ isAuthenticated, setIsAuthenticated }) => {
    const handleLogout = () => {
      // Clear login status
      window.localStorage.removeItem("isLoggedIn");
      setIsAuthenticated(false); // Update state to logged out
    };

    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Welcome to Qart Solutions</h1>
        <h2>Your Social Listening Platform</h2>
        
        <section style={{ marginTop: '20px' }}>
          <p>
            Discover insights into your brand’s online presence. Use our platform to monitor hashtags,
            track sentiment, and engage with your audience effectively.
          </p>
          <p>
            Start exploring the data and take control of your brand’s narrative today!
          </p>
        </section>

        {isAuthenticated && (
          <div style={{ marginTop: '30px' }}>
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    );
  };

  export default Home;
