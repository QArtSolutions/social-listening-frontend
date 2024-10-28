import React from 'react';
import '../styles/BrandInput.css'; //to be changed.....

function BrandInput() {
    return (
        <div className="brand-input-container">
            <h2>Enter Brand Name</h2>
            <input type="text" placeholder="Brand Name" className="brand-input" />
            <button className="next-button">Next</button>
        </div>
    );
}

export default BrandInput;
