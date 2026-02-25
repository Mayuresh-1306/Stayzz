import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaHome } from 'react-icons/fa';

function Footer() {
  return (
    <footer style={{
      background: 'linear-gradient(135deg, #1f2937 0%, #2d1520 100%)',
      color: '#fff',
      marginTop: '0',
    }}>
      {/* Rose accent stripe */}
      <div style={{
        height: '3px',
        background: 'linear-gradient(90deg, #f43f5e, #fb7185, #fda4af, #fb7185, #f43f5e)',
      }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #f43f5e, #fb7185)',
                borderRadius: '8px',
                padding: '6px',
                display: 'flex',
              }}>
                <FaHome style={{ color: '#fff', fontSize: '14px' }} />
              </div>
              <span style={{
                fontSize: '1.2rem',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #fb7185, #fda4af)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>Stayzz</span>
            </div>
            <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Discover amazing places to stay worldwide. Your next adventure starts here.
            </p>
          </div>

          {/* Support */}
          <div>
            <h4 style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#fda4af',
              marginBottom: '16px',
            }}>Support</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {['Help Center', 'Safety', 'Community Guidelines'].map((item) => (
                <li key={item}>
                  <a href="#" style={{
                    color: '#9ca3af',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    transition: 'color 0.2s',
                  }} onMouseOver={(e) => e.target.style.color = '#fb7185'} onMouseOut={(e) => e.target.style.color = '#9ca3af'}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#fda4af',
              marginBottom: '16px',
            }}>Company</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {['About Us', 'Careers', 'Blog'].map((item) => (
                <li key={item}>
                  <a href="#" style={{
                    color: '#9ca3af',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    transition: 'color 0.2s',
                  }} onMouseOver={(e) => e.target.style.color = '#fb7185'} onMouseOut={(e) => e.target.style.color = '#9ca3af'}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#fda4af',
              marginBottom: '16px',
            }}>Follow Us</h4>
            <div style={{ display: 'flex', gap: '12px' }}>
              {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    border: '1px solid rgba(253, 164, 175, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#9ca3af',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.background = 'linear-gradient(135deg, #f43f5e, #fb7185)';
                    e.currentTarget.style.borderColor = '#f43f5e';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(244, 63, 94, 0.3)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = '#9ca3af';
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'rgba(253, 164, 175, 0.2)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(253, 164, 175, 0.2), transparent)',
          margin: '8px 0 24px',
        }} />

        {/* Copyright */}
        <div style={{
          textAlign: 'center',
          color: '#6b7280',
          fontSize: '0.85rem',
        }}>
          <p>© 2024 Stayzz. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
