import React, { createContext, useState, useContext } from 'react';

// Create the context
const BrandContext = createContext();

// Brand context provider component
export const BrandProvider = ({ children }) => {
  const [brand, setBrand] = useState('');
  const hashtag1 = brand; // Set hashtag1 equal to brand

  return (
    <BrandContext.Provider value={{ brand, setBrand, hashtag1 }}>
      {children}
    </BrandContext.Provider>
  );
};

// Custom hook for using the brand context
export const useBrand = () => useContext(BrandContext);
