import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaChevronLeft, FaChevronRight, FaStar, FaTimes } from 'react-icons/fa';
import axios from 'axios';

// Sample data with coordinates
const SAMPLE_LISTINGS = [
  {
    _id: 'sample-1',
    title: 'Cozy Beachfront Cottage',
    description: 'Escape to this charming beachfront cottage for a relaxing getaway.',
    price: 1500,
    location: 'Malibu, California',
    country: 'United States',
    coordinates: { latitude: 34.0259, longitude: -118.6825 },
    image: { url: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60' },
    rating: 4.8,
    reviews: 245
  },
  {
    _id: 'sample-2',
    title: 'Modern Loft in Downtown',
    description: 'Stay in the heart of the city in this stylish loft apartment.',
    price: 1200,
    location: 'Manhattan, New York',
    country: 'United States',
    coordinates: { latitude: 40.7128, longitude: -74.0060 },
    image: { url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60' },
    rating: 4.9,
    reviews: 512
  },
  {
    _id: 'sample-3',
    title: 'Mountain Retreat',
    description: 'Unplug and unwind in this peaceful mountain cabin.',
    price: 1000,
    location: 'Aspen, Colorado',
    country: 'United States',
    coordinates: { latitude: 39.1911, longitude: -106.8175 },
    image: { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60' },
    rating: 4.7,
    reviews: 189
  },
  {
    _id: 'sample-4',
    title: 'Historic Villa in Tuscany',
    description: 'Experience the charm of Tuscany in this beautifully restored villa.',
    price: 2500,
    location: 'Florence, Tuscany',
    country: 'Italy',
    coordinates: { latitude: 43.7696, longitude: 11.2558 },
    image: { url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60' },
    rating: 4.9,
    reviews: 823
  },
  {
    _id: 'sample-5',
    title: 'Secluded Treehouse Getaway',
    description: 'Live among the treetops in this unique treehouse retreat.',
    price: 800,
    location: 'Portland, Oregon',
    country: 'United States',
    coordinates: { latitude: 45.5152, longitude: -122.6784 },
    image: { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60' },
    rating: 4.6,
    reviews: 367
  },
  {
    _id: 'sample-6',
    title: 'Beachfront Paradise',
    description: 'Step out of your door onto the sandy beach.',
    price: 2000,
    location: 'Cancun, Mexico',
    country: 'Mexico',
    coordinates: { latitude: 21.1619, longitude: -86.8515 },
    image: { url: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60' },
    rating: 4.8,
    reviews: 1203
  }
];

function AirbnbLikeMap() {
  const navigate = useNavigate();
  const [listings, setListings] = useState(SAMPLE_LISTINGS);
  const [selectedListing, setSelectedListing] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [mapType, setMapType] = useState('visual');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5002';
      const response = await axios.get(`${backendUrl}/api/listings`);
      if (response.data && response.data.length > 0) {
        setListings(normalizeListings(response.data));
      } else {
        setListings(SAMPLE_LISTINGS);
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
      setListings(SAMPLE_LISTINGS);
    } finally {
      setLoading(false);
    }
  };

  // Normalize listings to ensure all have valid coordinates
  const normalizeListings = (rawListings) => {
    return rawListings
      .map(listing => {
        // If listing already has coordinates object (sample data or database format)
        if (listing.coordinates?.latitude && listing.coordinates?.longitude) {
          return listing;
        }

        // If listing has geometry (alternative GeoJSON format)
        if (listing.geometry?.coordinates && Array.isArray(listing.geometry.coordinates)) {
          return {
            ...listing,
            coordinates: {
              longitude: listing.geometry.coordinates[0],
              latitude: listing.geometry.coordinates[1]
            }
          };
        }

        // Log warning and return null for listings without valid coordinates
        console.warn('Listing missing coordinates:', listing.title || listing._id);
        return null;
      })
      .filter(listing => listing !== null); // Remove invalid listings
  };

  // Calculate map bounds - only if we have valid listings
  if (listings.length === 0) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'calc(100vh - 80px)',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <FaMapMarkerAlt style={{ fontSize: '48px', color: '#ef4444' }} />
        <h2 style={{ color: '#1f2937', margin: 0 }}>No Listings with Coordinates</h2>
        <p style={{ color: '#6b7280' }}>Please add coordinates to your listings to view them on the map.</p>
      </div>
    );
  }

  const minLat = Math.min(...listings.map(l => l.coordinates.latitude));
  const maxLat = Math.max(...listings.map(l => l.coordinates.latitude));
  const minLng = Math.min(...listings.map(l => l.coordinates.longitude));
  const maxLng = Math.max(...listings.map(l => l.coordinates.longitude));

  // Interactive Map Component
  const InteractiveMap = () => (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#f5f5f5',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Grid background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(0deg, transparent 24%, rgba(255, 0, 0, 0.05) 25%, rgba(255, 0, 0, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 0, 0, 0.05) 75%, rgba(255, 0, 0, 0.05) 76%, transparent 77%, transparent),
          linear-gradient(90deg, transparent 24%, rgba(255, 0, 0, 0.05) 25%, rgba(255, 0, 0, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 0, 0, 0.05) 75%, rgba(255, 0, 0, 0.05) 76%, transparent 77%, transparent)
        `,
        backgroundSize: '50px 50px',
        backgroundPosition: '0 0'
      }} />

      {/* Watermark */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        backgroundColor: 'white',
        padding: '12px 16px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        zIndex: 10,
        fontWeight: 'bold',
        color: '#ef4444',
        fontSize: '14px'
      }}>
        📍 Stayzz Map
      </div>

      {/* Markers */}
      {listings.map((listing) => {
        const x = ((listing.coordinates.longitude - minLng) / (maxLng - minLng)) * 100;
        const y = ((maxLat - listing.coordinates.latitude) / (maxLat - minLat)) * 100;
        const isHovered = hoveredId === listing._id;
        const isSelected = selectedListing?._id === listing._id;

        return (
          <div
            key={listing._id}
            style={{
              position: 'absolute',
              left: `${x}%`,
              top: `${y}%`,
              transform: 'translate(-50%, -50%)',
              cursor: 'pointer',
              zIndex: isSelected ? 20 : isHovered ? 15 : 5
            }}
            onMouseEnter={() => setHoveredId(listing._id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => setSelectedListing(listing)}
          >
            {/* Marker Pin */}
            <div style={{
              width: isHovered || isSelected ? '50px' : '40px',
              height: isHovered || isSelected ? '50px' : '40px',
              backgroundColor: isSelected ? '#dc2626' : isHovered ? '#ef4444' : '#ef4444',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isSelected ? '0 4px 16px rgba(239,68,68,0.4)' : '0 2px 8px rgba(0,0,0,0.3)',
              border: '3px solid white',
              transition: 'all 0.2s ease',
              transform: isHovered || isSelected ? 'scale(1.2)' : 'scale(1)'
            }}>
              <span style={{
                color: 'white',
                fontSize: isHovered || isSelected ? '18px' : '14px',
                fontWeight: 'bold'
              }}>
                ₹
              </span>
            </div>

            {/* Price Badge */}
            <div style={{
              position: 'absolute',
              top: '-8px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'white',
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 'bold',
              color: '#1f2937',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
              border: '1px solid #e5e7eb',
              whiteSpace: 'nowrap'
            }}>
              ₹{listing.price}/night
            </div>
          </div>
        );
      })}

      {/* Legend */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        backgroundColor: 'white',
        padding: '12px 16px',
        borderRadius: '8px',
        fontSize: '12px',
        color: '#6b7280',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '6px', color: '#1f2937' }}>
          {listings.length} Properties
        </div>
        <div>Click pins to view details</div>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 80px)', flexDirection: window.innerWidth < 768 ? 'column' : 'row' }}>
      {/* Left Panel - Map */}
      <div style={{
        flex: window.innerWidth < 768 ? 'none' : '1.5',
        height: window.innerWidth < 768 ? '50%' : '100%',
        backgroundColor: 'white',
        borderRight: window.innerWidth < 768 ? 'none' : '1px solid #e5e7eb',
        borderBottom: window.innerWidth < 768 ? '1px solid #e5e7eb' : 'none',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <InteractiveMap />
      </div>

      {/* Right Panel - Listings */}
      <div style={{
        flex: window.innerWidth < 768 ? 'none' : '1',
        height: window.innerWidth < 768 ? '50%' : '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'white',
        overflowY: 'auto'
      }}>
        {/* Header */}
        <div style={{
          padding: window.innerWidth < 768 ? '12px 16px' : '20px',
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb'
        }}>
          <h2 style={{ margin: '0', color: '#1f2937', fontSize: window.innerWidth < 768 ? '16px' : '18px', fontWeight: 'bold' }}>
            {listings.length} Stays
          </h2>
          <p style={{ margin: '5px 0 0 0', color: '#6b7280', fontSize: window.innerWidth < 768 ? '12px' : '13px' }}>
            Click on the map or a listing
          </p>
        </div>

        {/* Selected Listing Detail */}
        {selectedListing && (
          <div style={{
            padding: window.innerWidth < 768 ? '12px 16px' : '20px',
            borderBottom: '2px solid #fcd34d',
            backgroundColor: '#fef3c7'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
              <h3 style={{ margin: '0', color: '#1f2937', fontSize: window.innerWidth < 768 ? '14px' : '16px', fontWeight: 'bold' }}>
                {selectedListing.title}
              </h3>
              <button
                onClick={() => setSelectedListing(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6b7280',
                  fontSize: '18px'
                }}
              >
                <FaTimes />
              </button>
            </div>

            {selectedListing.image && (
              <img
                src={selectedListing.image.url}
                alt={selectedListing.title}
                style={{
                  width: '100%',
                  height: window.innerWidth < 768 ? '140px' : '180px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginBottom: '12px'
                }}
              />
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
              <div>
                <p style={{ margin: '0', color: '#6b7280', fontSize: '11px' }}>Location</p>
                <p style={{ margin: '4px 0 0 0', color: '#1f2937', fontWeight: 'bold', fontSize: '12px' }}>
                  {selectedListing.location}
                </p>
              </div>
              <div>
                <p style={{ margin: '0', color: '#6b7280', fontSize: '11px' }}>Price</p>
                <p style={{ margin: '4px 0 0 0', color: '#ef4444', fontWeight: 'bold', fontSize: window.innerWidth < 768 ? '14px' : '16px' }}>
                  ₹{selectedListing.price}/night
                </p>
              </div>
            </div>

            {selectedListing.rating && (
              <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaStar style={{ color: '#fbbf24', fontSize: '12px' }} />
                <span style={{ color: '#1f2937', fontWeight: 'bold', fontSize: '12px' }}>
                  {selectedListing.rating}
                </span>
                <span style={{ color: '#6b7280', fontSize: '11px' }}>
                  ({selectedListing.reviews} reviews)
                </span>
              </div>
            )}

            <p style={{ margin: '0', color: '#6b7280', fontSize: '12px', lineHeight: '1.5' }}>
              {selectedListing.description}
            </p>

            <button
              onClick={() => navigate(`/listings/${selectedListing._id}`)}
              style={{
                width: '100%',
                marginTop: '12px',
                padding: window.innerWidth < 768 ? '8px' : '10px',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: window.innerWidth < 768 ? '13px' : '14px',
                transition: 'background 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#dc2626'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#ef4444'}
            >
              View Details
            </button>
          </div>
        )}

        {/* Listings List */}
        <div style={{ flex: '1', overflowY: 'auto', padding: window.innerWidth < 768 ? '12px' : '15px' }}>
          <div style={{ display: 'grid', gap: '12px' }}>
            {listings.map((listing) => (
              <div
                key={listing._id}
                onClick={() => setSelectedListing(listing)}
                onMouseEnter={() => setHoveredId(listing._id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  padding: window.innerWidth < 768 ? '10px' : '12px',
                  borderRadius: '8px',
                  border: hoveredId === listing._id ? '2px solid #ef4444' : '1px solid #e5e7eb',
                  backgroundColor: selectedListing?._id === listing._id ? '#fef3c7' : '#f9fafb',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', gap: window.innerWidth < 768 ? '8px' : '10px' }}>
                  {listing.image && (
                    <img
                      src={listing.image.url}
                      alt={listing.title}
                      style={{
                        width: window.innerWidth < 768 ? '50px' : '60px',
                        height: window.innerWidth < 768 ? '50px' : '60px',
                        borderRadius: '6px',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />
                  )}
                  <div style={{ flex: '1', minWidth: 0 }}>
                    <h4 style={{
                      margin: '0',
                      color: '#1f2937',
                      fontSize: window.innerWidth < 768 ? '12px' : '13px',
                      fontWeight: 'bold',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {listing.title}
                    </h4>
                    <p style={{
                      margin: '2px 0',
                      color: '#6b7280',
                      fontSize: '11px'
                    }}>
                      {listing.location}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '12px' }}>
                        ₹{listing.price}
                      </span>
                      {listing.rating && (
                        <span style={{ color: '#6b7280', fontSize: '10px' }}>
                          ⭐ {listing.rating}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AirbnbLikeMap;
