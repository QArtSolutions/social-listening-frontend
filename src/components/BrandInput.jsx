import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useBrand } from '../contexts/BrandContext';
import '../styles/BrandInput.css'; // Adjust the path as necessary

function BrandInput({ isAuthenticated, setIsAuthenticated }) {
    const navigate = useNavigate(); // Hook for navigation

    const handleLogout = () => {
        window.localStorage.removeItem("isLoggedIn"); 
        // setIsAuthenticated(false); 
        navigate('/entry'); 
    };
    const [inputBrand, setInputBrand] = useState('');
    const { setBrand } = useBrand(); // Access setBrand from context

    const handleNext = () => {
        if (inputBrand.trim()) {
            console.log("Setting brand:", inputBrand); // Log for debugging
            setBrand(inputBrand);
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
