import React, {lazy, Suspense} from 'react';
import { BrowserRouter as Router, Route, Routes, } from 'react-router-dom';
import Entry from '../component/entry';
import { BrandProvider } from '../contexts/BrandContext';
// import SignUp from '../features/auth/SignUp';
// import BrandPage from '../pages/BrandPage';

const SignUp = lazy(() => import('../features/auth/SignUp'));
const BrandPage = lazy(() => import('./BrandPage'));
const MentionsPage = lazy(() => import('../features/mentions/MentionsPage'));
const Comparision = lazy(() => import('../features/comparision/comparisionpage'));

const AppRouter = ({ isAuthenticated, setIsAuthenticated }) => {
  

  return (
    <BrandProvider> {/* Wrap the Routes in BrandProvider */}
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route
          exact
          path="/"
          element={
            isAuthenticated ? (
              <BrandPage setIsAuthenticated={setIsAuthenticated} />
            ) : (
              <Entry setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />
        <Route
          exact
          path="/home"
          element={
            isAuthenticated ? (
              <BrandPage setIsAuthenticated={setIsAuthenticated} />
            ) : (
              <Entry setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />
        <Route exact path="/signup" element={<SignUp />} />
        <Route
          exact
          path="/entry"
          element={<Entry setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route exact path="/mentions" element={<MentionsPage />} />
        <Route
          exact
          path="/comparision"
          element={
            isAuthenticated ? (
              <Comparision setIsAuthenticated={setIsAuthenticated} />
            ) : (
              <Entry setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />
        {/* Add more routes here */}
      </Routes>
      </Suspense>
    </BrandProvider>
  );
};

export default AppRouter;
