import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaPlus, FaUser, FaSignOutAlt, FaMap } from 'react-icons/fa';

function Navbar({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <FaHome className="text-2xl text-red-500" />
            <span className="text-2xl font-bold text-gray-800">Stayzz</span>
          </Link>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/listings" className="text-gray-700 hover:text-red-500 transition">
              Explore
            </Link>
            <Link to="/map" className="text-gray-700 hover:text-red-500 transition flex items-center space-x-1">
              <FaMap className="text-sm" />
              <span>Map View</span>
            </Link>
            {isLoggedIn && (
              <Link to="/listings/new" className="text-gray-700 hover:text-red-500 transition flex items-center space-x-1">
                <FaPlus className="text-sm" />
                <span>List Property</span>
              </Link>
            )}
          </div>

          {/* Right Navigation */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-red-500 transition font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
