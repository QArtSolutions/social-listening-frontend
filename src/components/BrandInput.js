import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useBrand } from '../contexts/BrandContext';
import axios from 'axios';
import '../styles/BrandInput.css'; // Adjust the path as necessary

function BrandInput({ isAuthenticated, setIsAuthenticated }) {
    const navigate = useNavigate(); // Hook for navigation
    const [inputBrand, setInputBrand] = useState('');
    const { setBrand } = useBrand(); // Access setBrand from context

    const handleLogout = () => {
        window.localStorage.removeItem("isLoggedIn"); 
        window.localStorage.removeItem("userId"); // Remove userId on logout
        // setIsAuthenticated(false); 
        navigate('/entry'); 
    };
   
    const saveUserHistory = async () => {
        const userId = window.localStorage.getItem("userId");

        try {
            await axios.post('http://dev-backend.socialhear.com/api/users/search-history', {
                userId,
                searchedBrand: inputBrand
            });
            console.log("User history saved successfully.");
        } catch (error) {
            console.error("Error saving user history:", error);
            alert("Failed to save user history.");
        }
    };

    const handleNext = async () => {
        if (inputBrand.trim()) {
            console.log("Setting brand:", inputBrand); // Log for debugging
            setBrand(inputBrand);
            await saveUserHistory();
            navigate('/mentions');

          } else {
            alert("Please enter a brand name.");
          }
        };

    return (
        <div className="brand-input-container">
            <h2>Enter Brand Name</h2>
            <input type="text" placeholder="Brand Name" className="brand-input" value={inputBrand}
        onChange={(e) => setInputBrand(e.target.value)} />
            <button className="next-button" onClick={handleNext}>Next</button>
           
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
