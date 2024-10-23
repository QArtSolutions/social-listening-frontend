import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

function Home() {
  const navigate = useNavigate();
  const { logout } = useAuth0();

  const handleLogout = () => {
    // Clear login state and logout
    window.localStorage.removeItem("isLogedIn");
    logout({ logoutParams: { returnTo: window.location.origin } });
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
