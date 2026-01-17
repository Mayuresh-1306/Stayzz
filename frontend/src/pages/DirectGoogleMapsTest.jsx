import React, { useEffect, useRef, useState } from 'react';

function DirectGoogleMapsTest() {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [apiKey] = useState(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);

  useEffect(() => {
    if (!apiKey) {
      setError('API Key not found in .env');
      return;
    }

    // Load Google Maps API directly
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      console.log('✅ Google Maps API loaded successfully');
      
      // Initialize map
      if (mapRef.current && window.google) {
        try {
          const map = new window.google.maps.Map(mapRef.current, {
            center: { lat: 40.7128, lng: -74.0060 },
            zoom: 13,
            styles: [
              { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
              { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
              { elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
            ]
          });

          // Add a marker
          new window.google.maps.Marker({
            position: { lat: 40.7128, lng: -74.0060 },
            map: map,
            title: 'New York City'
          });

          setMapLoaded(true);
          console.log('✅ Map initialized successfully');
        } catch (err) {
          setError('Error initializing map: ' + err.message);
          console.error('Map initialization error:', err);
        }
      }
    };

    script.onerror = (err) => {
      const errorMsg = 'Failed to load Google Maps API. Check your API key.';
      setError(errorMsg);
      console.error('❌ Script load error:', err);
      
      // Log network details
      fetch(`https://maps.googleapis.com/maps/api/js?key=${apiKey}`)
        .then(res => {
          console.log('API Response Status:', res.status);
          console.log('API Response OK:', res.ok);
          return res.text();
        })
        .then(text => {
          console.log('API Response (first 500 chars):', text.substring(0, 500));
          if (text.includes('ERROR')) {
            const match = text.match(/error["\s:]*([^"]+)/i);
            if (match) {
              setError('API Error: ' + match[1]);
            }
          }
        })
        .catch(e => console.error('Fetch error:', e));
    };

    // Add error event listener
    script.addEventListener('error', (event) => {
      console.error('Script error event:', event);
      setError('Script loading failed');
    });

    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [apiKey]);

  return (
    <div style={{
      maxWidth: '900px',
      margin: '40px auto',
      padding: '20px',
      fontFamily: 'system-ui'
    }}>
      <h1 style={{ marginBottom: '10px', color: '#1f2937' }}>🗺️ Direct Google Maps Test</h1>
      <p style={{ color: '#6b7280', marginBottom: '20px' }}>Testing Google Maps API directly (without google-map-react wrapper)</p>

      {/* Configuration */}
      <div style={{
        backgroundColor: apiKey ? '#d1fae5' : '#fee2e2',
        border: `1px solid ${apiKey ? '#6ee7b7' : '#fca5a5'}`,
        padding: '15px',
        borderRadius: '6px',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <strong style={{ color: apiKey ? '#065f46' : '#991b1b' }}>API Key Status:</strong>
            <p style={{ fontSize: '13px', color: apiKey ? '#065f46' : '#991b1b', margin: '5px 0' }}>
              {apiKey ? `✅ Configured (${apiKey.length} characters)` : '❌ NOT CONFIGURED'}
            </p>
            {apiKey && (
              <p style={{ fontSize: '12px', fontFamily: 'monospace', color: '#6b7280', margin: '5px 0' }}>
                {apiKey.substring(0, 15)}...{apiKey.substring(apiKey.length - 10)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div style={{
          backgroundColor: '#fee2e2',
          border: '1px solid #fca5a5',
          padding: '15px',
          borderRadius: '6px',
          marginBottom: '20px'
        }}>
          <div style={{ color: '#991b1b', fontWeight: 'bold' }}>❌ Error:</div>
          <div style={{ color: '#7f1d1d', marginTop: '8px', fontSize: '14px', lineHeight: '1.5' }}>
            {error}
          </div>
        </div>
      )}

      {/* Map Container */}
      <div style={{
        backgroundColor: '#f3f4f6',
        border: '2px solid #e5e7eb',
        borderRadius: '8px',
        overflow: 'hidden',
        marginBottom: '20px'
      }}>
        {!mapLoaded && !error && (
          <div style={{
            height: '400px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>⏳</div>
            <p style={{ color: '#6b7280' }}>Loading Google Maps...</p>
          </div>
        )}
        {mapLoaded && (
          <div style={{
            height: '400px',
            backgroundColor: '#e5e7eb'
          }}>
            <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
          </div>
        )}
        {error && (
          <div style={{
            height: '400px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            backgroundColor: '#fef2f2'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>❌</div>
            <p style={{ color: '#991b1b', fontWeight: 'bold' }}>Map Failed to Load</p>
            <p style={{ color: '#7f1d1d', fontSize: '13px', marginTop: '10px', maxWidth: '300px', textAlign: 'center' }}>
              {error}
            </p>
          </div>
        )}
      </div>

      {/* Status */}
      <div style={{
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        padding: '15px',
        borderRadius: '6px',
        marginBottom: '20px'
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#1f2937' }}>Status:</h3>
        <div style={{ fontSize: '13px', color: '#6b7280' }}>
          <div style={{ marginBottom: '8px' }}>
            API Key: {apiKey ? '✅' : '❌'} {apiKey ? 'Present' : 'Missing'}
          </div>
          <div style={{ marginBottom: '8px' }}>
            Maps Loaded: {mapLoaded ? '✅' : '❌'} {mapLoaded ? 'Yes' : 'No'}
          </div>
          <div>
            Error: {error ? '❌ ' + error : '✅ None'}
          </div>
        </div>
      </div>

      {/* Troubleshooting */}
      <div style={{
        backgroundColor: '#fef3c7',
        border: '1px solid #fcd34d',
        padding: '15px',
        borderRadius: '6px'
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#92400e' }}>📌 How to Debug:</h3>
        <ol style={{ marginLeft: '20px', color: '#b45309', fontSize: '13px' }}>
          <li style={{ marginBottom: '8px' }}>
            Press <strong>F12</strong> to open DevTools
          </li>
          <li style={{ marginBottom: '8px' }}>
            Go to <strong>Console</strong> tab
          </li>
          <li style={{ marginBottom: '8px' }}>
            Look for any RED error messages
          </li>
          <li style={{ marginBottom: '8px' }}>
            Check <strong>Network</strong> tab → search for "maps.googleapis.com"
          </li>
          <li style={{ marginBottom: '8px' }}>
            Click on the request and check the <strong>Response</strong>
          </li>
          <li>
            Copy any error messages and share them
          </li>
        </ol>
      </div>

      {/* Common Issues */}
      <div style={{
        backgroundColor: '#f0f9ff',
        border: '1px solid #bfdbfe',
        padding: '15px',
        borderRadius: '6px',
        marginTop: '20px'
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#0c4a6e' }}>🔧 Common Fixes:</h3>
        <ul style={{ marginLeft: '20px', color: '#164e63', fontSize: '13px' }}>
          <li style={{ marginBottom: '8px' }}>
            <strong>Invalid API Key:</strong> Get a new one from <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#0369a1' }}>Google Cloud Console</a>
          </li>
          <li style={{ marginBottom: '8px' }}>
            <strong>API Not Enabled:</strong> In Google Cloud, enable "Maps JavaScript API"
          </li>
          <li style={{ marginBottom: '8px' }}>
            <strong>Domain Restrictions:</strong> Remove IP/domain restrictions on the API key
          </li>
          <li style={{ marginBottom: '8px' }}>
            <strong>Billing:</strong> Ensure billing is enabled in Google Cloud Console
          </li>
          <li>
            <strong>Rate Limited:</strong> Check if you've exceeded your quota
          </li>
        </ul>
      </div>
    </div>
  );
}

export default DirectGoogleMapsTest;
