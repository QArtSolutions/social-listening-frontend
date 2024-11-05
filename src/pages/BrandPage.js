import React from 'react';
import BrandInput from '../components/BrandInput';
import SocialMediaGraphic from '../components/SocialMediaGraphic';
import '../styles/BrandPage.css';

function BrandPage(setIsAuthenticated) {
    return (
        <div className="brand-page-container">
            <header className="header">
                <img src="../SocialAwaz.png" alt="Social Hear" className="logo" />
            </header>
            <div className="content">
                <BrandInput setIsAuthenticated={setIsAuthenticated} />
                <SocialMediaGraphic />
            </div>
        </div>
    );
}

export default BrandPage;
