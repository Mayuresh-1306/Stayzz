import React, { useState } from 'react';
import GoogleMapReact from 'google-map-react';

const Marker = ({ text }) => (
  <div style={{
    height: '40px',
    width: '40px',
    backgroundColor: '#EF4444',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    fontSize: '12px',
    fontWeight: 'bold',
    cursor: 'pointer'
  }}>
    📍
  </div>
);

function SimpleMapTest() {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const [mapReady, setMapReady] = useState(false);

  console.log('API Key available:', !!apiKey);

  const defaultProps = {
    center: { lat: 40.7128, lng: -74.0060 },
    zoom: 13
  };

  if (!apiKey) {
    return (
      <div style={{
        width: '100%',
        height: '400px',
        backgroundColor: '#f3f4f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '8px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#4b5563', fontWeight: 'bold', marginBottom: '8px' }}>
            ❌ API Key Not Found
          </p>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            Add REACT_APP_GOOGLE_MAPS_API_KEY to .env
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '400px', position: 'relative' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: apiKey }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
        onGoogleApiLoaded={() => {
          console.log('✅ Google Maps Loaded Successfully!');
          setMapReady(true);
        }}
        yesIWantToUseGoogleMapApiInternals
        options={{
          fullscreenControl: true,
        }}
      >
        <Marker
          lat={40.7128}
          lng={-74.0060}
          text="NYC"
        />
      </GoogleMapReact>
      {!mapReady && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(243, 244, 246, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1,
          borderRadius: '8px'
        }}>
          <p style={{ color: '#4b5563', fontWeight: 'bold' }}>Loading Map...</p>
        </div>
      )}
    </div>
  );
}

export default SimpleMapTest;
