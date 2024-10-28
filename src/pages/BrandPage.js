import React from 'react';
import BrandInput from '../components/BrandInput';
import SocialMediaGraphic from '../components/SocialMediaGraphic';
import '../styles/BrandPage.css';

function BrandPage() {
    return (
        <div className="brand-page-container">
            <header className="header">
                <img src="https://tse1.mm.bing.net/th?id=OIP.Gbn-yi8QZV8ClA4VZrxIoAHaEd&pid=Api&P=0&h=180" alt="Logo" className="logo" />
            </header>
            <div className="content">
                <BrandInput />
                <SocialMediaGraphic />
            </div>
        </div>
    );
}

export default BrandPage;
