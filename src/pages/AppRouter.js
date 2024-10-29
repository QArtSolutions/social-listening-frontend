import React, {lazy} from 'react';
import { BrowserRouter as Router, Route, Routes, } from 'react-router-dom';
import Entry from '../component/entry';
// import SignUp from '../features/auth/SignUp';
// import BrandPage from '../pages/BrandPage';

const SignUp = lazy(() => import('../features/auth/SignUp'));
const BrandPage = lazy(() => import('./BrandPage'));
const MentionsPage = lazy(() => import('../features/mentions/MentionsPage'));

const AppRouter = ({ isAuthenticated, setIsAuthenticated }) => {
  

  return (
    <Routes>
      <Route exact path="/" element={isAuthenticated ? <BrandPage setIsAuthenticated={setIsAuthenticated} /> : <Entry setIsAuthenticated={setIsAuthenticated} />} />
      <Route exact path="/home" element={isAuthenticated ? <BrandPage setIsAuthenticated={setIsAuthenticated} /> : <Entry setIsAuthenticated={setIsAuthenticated} />} />
      <Route exact path="/signup" element={<SignUp />} />
      <Route exact path="/entry" element={<Entry setIsAuthenticated={setIsAuthenticated} />} />
      <Route exact path="/mentions" element={<MentionsPage />} />
      {/* Add more routes here */}
    </Routes>
  );
};

export default AppRouter;
