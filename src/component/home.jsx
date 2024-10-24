import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear login state and logout
    window.localStorage.removeItem("isLoggedIn");
    navigate('/'); // Redirect to the login screen
  };

  return (    
    <div>
      <h2>Home page</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Home;
