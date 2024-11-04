import React, { createContext, useState, useContext } from 'react';

// Create the context
const BrandContext = createContext();

// Brand context provider component
export const BrandProvider = ({ children }) => {
  const [brand, setBrand] = useState('');

  return (
    <BrandContext.Provider value={{ brand, setBrand }}>
      {children}
    </BrandContext.Provider>
  );
};

// Custom hook for using the brand context
export const useBrand = () => useContext(BrandContext);
