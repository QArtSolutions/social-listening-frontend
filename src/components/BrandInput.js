import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/BrandInput.css'; // Adjust the path as necessary

function BrandInput({ isAuthenticated, setIsAuthenticated }) {
    const navigate = useNavigate(); // Hook for navigation

    const handleLogout = () => {
        window.localStorage.removeItem("isLoggedIn"); 
        // setIsAuthenticated(false); 
        navigate('/entry'); 
    };

    return (
        <div className="brand-input-container">
            <h2>Enter Brand Name</h2>
            <input type="text" placeholder="Brand Name" className="brand-input" />
            <button className="next-button">Next</button>

            <button 
                onClick={handleLogout} 
                className="absolute top-4 right-4 text-blue-600 hover:underline"
            >
                Logout
            </button>
        </div>
    );
}

export default BrandInput;
