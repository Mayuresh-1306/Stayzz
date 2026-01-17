import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';

function MapComponent({ listings = [], onMarkerClick = null }) {
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState(null);
  const [usesFallback, setUsesFallback] = useState(false);
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    // Always set a timeout to fallback to custom map
    const fallbackTimeout = setTimeout(() => {
      if (!mapReady) {
        console.warn('Google Maps not loaded, using fallback visualization');
        setUsesFallback(true);
      }
    }, 6000);

    if (!apiKey) {
      console.warn('Google Maps API Key not configured - using fallback map');
      setUsesFallback(true);
      return () => clearTimeout(fallbackTimeout);
    }

    // Check if script already exists
    const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);
    if (existingScript) {
      console.log('Google Maps script already loaded');
      setMapReady(true);
      initializeMap();
      return () => clearTimeout(fallbackTimeout);
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      console.log('Google Maps API loaded successfully');
      clearTimeout(fallbackTimeout);
      setMapReady(true);
      // Initialize map on next tick to ensure DOM is ready
      setTimeout(() => initializeMap(), 100);
    };

    script.onerror = () => {
      console.error('Failed to load Google Maps API - using fallback map');
      clearTimeout(fallbackTimeout);
      setMapError('Failed to load Google Maps. Displaying alternative map view.');
      setUsesFallback(true);
    };

    // Handle window load for deferred scripts
    window.addEventListener('load', () => {
      if (window.google && !mapReady) {
        console.log('Google Maps loaded via window.load event');
        setMapReady(true);
        setTimeout(() => initializeMap(), 100);
      }
    });

    document.head.appendChild(script);

    return () => {
      clearTimeout(fallbackTimeout);
      window.removeEventListener('load', () => {});
    };
  }, [apiKey]);

  const initializeMap = () => {
    const mapContainer = document.getElementById('google-map-container');
    if (!mapContainer || !window.google) return;

    try {
      // Calculate center from listings
      let center = { lat: 20.5937, lng: 78.9629 }; // Default to India
      
      if (listings && listings.length > 0) {
        const validListings = listings.filter(
          (l) => l.coordinates?.latitude && l.coordinates?.longitude
        );
        if (validListings.length > 0) {
          const avgLat = validListings.reduce((sum, l) => sum + l.coordinates.latitude, 0) / validListings.length;
          const avgLng = validListings.reduce((sum, l) => sum + l.coordinates.longitude, 0) / validListings.length;
          center = { lat: avgLat, lng: avgLng };
        }
      }

      const map = new window.google.maps.Map(mapContainer, {
        zoom: 4,
        center: center,
        styles: [
          {
            elementType: 'geometry',
            stylers: [{ color: '#f5f5f5' }],
          },
          {
            elementType: 'labels.icon',
            stylers: [{ visibility: 'off' }],
          },
          {
            elementType: 'labels.text.fill',
            stylers: [{ color: '#616161' }],
          },
        ],
      });

      // Add markers for listings
      if (listings && listings.length > 0) {
        listings.forEach((listing) => {
          if (listing.coordinates?.latitude && listing.coordinates?.longitude) {
            const marker = new window.google.maps.Marker({
              position: {
                lat: listing.coordinates.latitude,
                lng: listing.coordinates.longitude,
              },
              map: map,
              title: listing.title,
            });

            if (onMarkerClick) {
              marker.addListener('click', () => {
                onMarkerClick(listing);
              });
            }
          }
        });
      }
    } catch (err) {
      console.error('Map initialization error:', err);
      setUsesFallback(true);
    }
  };

  // Fallback map visualization (no API key required)
  const FallbackMap = () => {
    // Normalize coordinates to fit in a 2D grid
    const validListings = listings.filter(
      l => l.coordinates?.latitude && l.coordinates?.longitude
    );

    if (validListings.length === 0) {
      return (
        <div style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#f3f4f6',
          position: 'relative',
          border: '2px solid #d1d5db',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>📍</div>
          <p style={{ color: '#6b7280', fontWeight: 'bold', marginBottom: '6px' }}>
            No Locations to Display
          </p>
          <p style={{ color: '#9ca3af', fontSize: '13px' }}>
            Add a listing with coordinates to view on map
          </p>
        </div>
      );
    }

    const minLat = Math.min(...validListings.map(l => l.coordinates.latitude));
    const maxLat = Math.max(...validListings.map(l => l.coordinates.latitude));
    const minLng = Math.min(...validListings.map(l => l.coordinates.longitude));
    const maxLng = Math.max(...validListings.map(l => l.coordinates.longitude));

    // Add padding to bounds
    const latRange = maxLat - minLat || 1;
    const lngRange = maxLng - minLng || 1;

    return (
      <div style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#e5e7eb',
        position: 'relative',
        border: '2px solid #d1d5db'
      }}>
        {/* Grid background */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />

        {/* Watermark */}
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '15px',
          backgroundColor: 'white',
          padding: '6px 12px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 'bold',
          color: '#dc2626',
          zIndex: 10,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          📍 Stayzz Map View ({validListings.length} {validListings.length === 1 ? 'property' : 'properties'})
        </div>

        {/* Markers */}
        {validListings.map((listing, idx) => {
          const x = ((listing.coordinates.longitude - minLng) / (lngRange || 1)) * 100;
          const y = ((maxLat - listing.coordinates.latitude) / (latRange || 1)) * 100;

          return (
            <div
              key={listing._id || idx}
              onClick={() => onMarkerClick && onMarkerClick(listing)}
              style={{
                position: 'absolute',
                left: `${Math.max(5, Math.min(95, x))}%`,
                top: `${Math.max(5, Math.min(95, y))}%`,
                transform: 'translate(-50%, -50%)',
                cursor: 'pointer',
                zIndex: 5
              }}
              title={listing.title}
            >
              {/* Marker pin */}
              <div style={{
                width: '44px',
                height: '44px',
                backgroundColor: '#dc2626',
                borderRadius: '50% 50% 50% 0',
                transform: 'rotate(-45deg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(220, 38, 38, 0.4)',
                border: '3px solid white',
                transition: 'all 0.2s ease'
              }}>
                <div style={{
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  transform: 'rotate(45deg)'
                }}>
                  ₹
                </div>
              </div>

              {/* Price badge */}
              <div style={{
                position: 'absolute',
                top: '-10px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'white',
                color: '#1f2937',
                padding: '3px 8px',
                borderRadius: '3px',
                fontSize: '10px',
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                border: '1px solid #e5e7eb'
              }}>
                ₹{listing.price}/night
              </div>

              {/* Label */}
              <div style={{
                position: 'absolute',
                top: '50px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 'bold',
                color: '#1f2937',
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                border: '1px solid #d1d5db',
                maxWidth: '120px',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {listing.location?.split(',')[0] || `Property ${idx + 1}`}
              </div>
            </div>
          );
        })}

        {/* Info box */}
        <div style={{
          position: 'absolute',
          bottom: '15px',
          right: '15px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '12px 15px',
          borderRadius: '6px',
          fontSize: '12px',
          color: '#6b7280',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          border: '1px solid #e5e7eb',
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '5px', color: '#1f2937' }}>
            ✓ Alternative Map View
          </div>
          <div style={{ fontSize: '11px', color: '#9ca3af' }}>
            Click pins for details
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-lg bg-gray-100" style={{ height: 'calc(100vh - 500px)', minHeight: '300px', maxHeight: '600px' }}>
      {mapReady && !usesFallback ? (
        <div id="google-map-container" className="w-full h-full" />
      ) : usesFallback ? (
        <FallbackMap />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
          <div className="text-center">
            <div style={{ fontSize: '32px', marginBottom: '12px', animation: 'pulse 2s infinite' }}>📍</div>
            <p className="text-gray-700 font-semibold mb-2">Loading Map...</p>
            <p className="text-gray-500 text-sm mb-2">Showing {listings.length} location{listings.length !== 1 ? 's' : ''}</p>
            <div style={{ marginTop: '12px', width: '40px', height: '3px', backgroundColor: '#dc2626', borderRadius: '2px', margin: '12px auto', animation: 'pulse 1.5s infinite' }}></div>
          </div>
        </div>
      )}
      {mapError && (
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#fef2f2',
          color: '#991b1b',
          padding: '8px 12px',
          borderRadius: '4px',
          fontSize: '11px',
          border: '1px solid #fecaca',
          maxWidth: '90%'
        }}>
          ⚠️ {mapError}
        </div>
      )}
    </div>
  );
}

export default MapComponent;
