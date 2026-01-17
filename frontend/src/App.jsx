import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ListingsPage from './pages/ListingsPage';
import ListingDetailPage from './pages/ListingDetailPage';
import NewListingPage from './pages/NewListingPage';
import EditListingPage from './pages/EditListingPage';
import LoginPage from './pages/Users/LoginPage';
import SignupPage from './pages/Users/SignupPage';
import DebugPage from './pages/DebugPage';
import MapDebugPage from './pages/MapDebugPage';
import SimpleMapTest from './pages/SimpleMapTest';
import QuickDiagnostic from './pages/QuickDiagnostic';
import GoogleMapsErrorDiagnostic from './pages/GoogleMapsErrorDiagnostic';
import DirectGoogleMapsTest from './pages/DirectGoogleMapsTest';
import APIKeyValidator from './pages/APIKeyValidator';
import MapDebugger from './pages/MapDebugger';
import AirbnbLikeMap from './pages/AirbnbLikeMap';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in (from localStorage or API)
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <Router>
      <div className="App min-h-screen flex flex-col bg-gray-50">
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/map" element={<AirbnbLikeMap />} />
            <Route path="/debug" element={<DebugPage />} />
            <Route path="/debug/map" element={<MapDebugger />} />
            <Route path="/debug/map/old" element={<MapDebugPage />} />
            <Route path="/diagnostic" element={<QuickDiagnostic />} />
            <Route path="/diagnostic/maps" element={<GoogleMapsErrorDiagnostic />} />
            <Route path="/diagnostic/direct" element={<DirectGoogleMapsTest />} />
            <Route path="/diagnostic/key" element={<APIKeyValidator />} />
            <Route path="/test/map" element={<SimpleMapTest />} />
            <Route path="/listings" element={<ListingsPage />} />
            <Route path="/listings/:id" element={<ListingDetailPage />} />
            <Route path="/listings/new" element={<NewListingPage isLoggedIn={isLoggedIn} />} />
            <Route path="/listings/:id/edit" element={<EditListingPage isLoggedIn={isLoggedIn} />} />
            <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/signup" element={<SignupPage setIsLoggedIn={setIsLoggedIn} />} />
          </Routes>
        </main>

        <Footer />
        <ToastContainer position="bottom-right" autoClose={3000} />
      </div>
    </Router>
  );
}

export default App;
