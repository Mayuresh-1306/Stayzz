import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaPlus, FaUser, FaSignOutAlt, FaMap, FaBars, FaTimes, FaSuitcase } from 'react-icons/fa';

function Navbar({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/');
    setMobileOpen(false);
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #ffffff 0%, #fff5f5 100%)',
      boxShadow: '0 2px 16px rgba(244, 63, 94, 0.06)',
      borderBottom: '1px solid #ffe4e6',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" onClick={closeMobile}>
            <div style={{
              background: 'linear-gradient(135deg, #f43f5e, #fb7185)',
              borderRadius: '10px',
              padding: '6px 8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(244, 63, 94, 0.25)',
            }}>
              <FaHome className="text-white text-lg" />
            </div>
            <span style={{
              fontSize: '1.4rem',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em',
            }}>
              Stayzz
            </span>
          </Link>

          {/* Center Navigation — Desktop */}
          <div className="hidden md:flex items-center space-x-1">
            {[
              { to: '/listings', label: 'Explore', icon: null },
              { to: '/map', label: 'Map View', icon: <FaMap className="text-xs" /> },
              ...(isLoggedIn ? [
                { to: '/listings/new', label: 'List Property', icon: <FaPlus className="text-xs" /> },
                { to: '/my-bookings', label: 'My Bookings', icon: <FaSuitcase className="text-xs" /> },
              ] : []),
            ].map(({ to, label, icon }) => (
              <Link
                key={to}
                to={to}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  color: '#4b5563',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                }}
                className="hover:bg-rose-50"
                onMouseOver={(e) => {
                  e.currentTarget.style.color = '#f43f5e';
                  e.currentTarget.style.backgroundColor = '#fff1f2';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = '#4b5563';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {icon}
                <span>{label}</span>
              </Link>
            ))}
          </div>

          {/* Right Navigation — Desktop */}
          <div className="hidden md:flex items-center space-x-3">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'linear-gradient(135deg, #f43f5e, #fb7185)',
                  color: '#fff',
                  padding: '8px 20px',
                  borderRadius: '999px',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  boxShadow: '0 3px 12px rgba(244, 63, 94, 0.3)',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.boxShadow = '0 5px 20px rgba(244, 63, 94, 0.45)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.boxShadow = '0 3px 12px rgba(244, 63, 94, 0.3)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <FaSignOutAlt /> Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  style={{
                    color: '#4b5563',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    padding: '8px 16px',
                    borderRadius: '10px',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = '#f43f5e';
                    e.currentTarget.style.backgroundColor = '#fff1f2';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = '#4b5563';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  style={{
                    background: 'linear-gradient(135deg, #f43f5e, #fb7185)',
                    color: '#fff',
                    padding: '8px 22px',
                    borderRadius: '999px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    boxShadow: '0 3px 12px rgba(244, 63, 94, 0.3)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.boxShadow = '0 5px 20px rgba(244, 63, 94, 0.45)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.boxShadow = '0 3px 12px rgba(244, 63, 94, 0.3)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#f43f5e',
              fontSize: '1.3rem',
              padding: '6px',
            }}
          >
            {mobileOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div style={{
            paddingBottom: '16px',
            borderTop: '1px solid #ffe4e6',
            animation: 'fadeIn 0.2s ease',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingTop: '12px' }}>
              <Link to="/listings" onClick={closeMobile} style={{
                padding: '10px 16px', borderRadius: '10px', color: '#4b5563', fontWeight: 600, fontSize: '0.9rem',
              }}>Explore</Link>
              <Link to="/map" onClick={closeMobile} style={{
                padding: '10px 16px', borderRadius: '10px', color: '#4b5563', fontWeight: 600, fontSize: '0.9rem',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}><FaMap className="text-xs" /> Map View</Link>
              {isLoggedIn && (
                <>
                  <Link to="/listings/new" onClick={closeMobile} style={{
                    padding: '10px 16px', borderRadius: '10px', color: '#4b5563', fontWeight: 600, fontSize: '0.9rem',
                    display: 'flex', alignItems: 'center', gap: '6px',
                  }}><FaPlus className="text-xs" /> List Property</Link>
                  <Link to="/my-bookings" onClick={closeMobile} style={{
                    padding: '10px 16px', borderRadius: '10px', color: '#4b5563', fontWeight: 600, fontSize: '0.9rem',
                    display: 'flex', alignItems: 'center', gap: '6px',
                  }}><FaSuitcase className="text-xs" /> My Bookings</Link>
                </>
              )}
              <hr style={{ border: 'none', borderTop: '1px solid #ffe4e6', margin: '8px 0' }} />
              {isLoggedIn ? (
                <button onClick={handleLogout} style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  background: 'linear-gradient(135deg, #f43f5e, #fb7185)',
                  color: '#fff', padding: '10px 20px', borderRadius: '10px', border: 'none',
                  fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', width: '100%', justifyContent: 'center',
                }}>
                  <FaSignOutAlt /> Logout
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link to="/login" onClick={closeMobile} style={{
                    flex: 1, textAlign: 'center', padding: '10px', borderRadius: '10px',
                    border: '2px solid #fecdd3', color: '#f43f5e', fontWeight: 700, fontSize: '0.9rem',
                  }}>Login</Link>
                  <Link to="/signup" onClick={closeMobile} style={{
                    flex: 1, textAlign: 'center', padding: '10px', borderRadius: '10px',
                    background: 'linear-gradient(135deg, #f43f5e, #fb7185)',
                    color: '#fff', fontWeight: 700, fontSize: '0.9rem',
                  }}>Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
