import React, { useState, useEffect } from 'react';

function MapDebugger() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const url = `${backendUrl}/api/listings`;
      console.log('Fetching from:', url);
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Listings fetched:', data);
      setListings(data);
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const listingsWithCoords = listings.filter(
    l => l.coordinates?.latitude && l.coordinates?.longitude
  );

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '40px auto',
      padding: '30px',
      fontFamily: 'system-ui'
    }}>
      <h1 style={{ marginBottom: '30px', color: '#1f2937' }}>🗺️ Map Debugger - Why is Map Empty?</h1>

      {/* Configuration */}
      <div style={{
        backgroundColor: '#f0f9ff',
        border: '1px solid #bfdbfe',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h2 style={{ fontSize: '16px', marginBottom: '12px', color: '#0c4a6e' }}>Configuration</h2>
        <div style={{ display: 'grid', gap: '10px', fontSize: '14px' }}>
          <div>
            <span style={{ fontWeight: 'bold', color: '#164e63' }}>Backend URL:</span>
            <span style={{ marginLeft: '10px', color: '#0369a1' }}>{backendUrl}</span>
          </div>
          <div>
            <span style={{ fontWeight: 'bold', color: '#164e63' }}>API Key:</span>
            <span style={{ marginLeft: '10px', color: apiKey ? '#059669' : '#dc2626' }}>
              {apiKey ? `✅ Configured (${apiKey.substring(0, 20)}...)` : '❌ Not set'}
            </span>
          </div>
        </div>
      </div>

      {/* Fetch Status */}
      <div style={{
        backgroundColor: loading ? '#fef3c7' : error ? '#fee2e2' : '#d1fae5',
        border: `1px solid ${loading ? '#fcd34d' : error ? '#fca5a5' : '#6ee7b7'}`,
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h2 style={{ fontSize: '16px', marginBottom: '12px', color: loading ? '#92400e' : error ? '#991b1b' : '#065f46' }}>
          {loading ? '⏳ Loading...' : error ? '❌ Error' : '✅ Success'}
        </h2>
        {error && (
          <div style={{ backgroundColor: 'white', padding: '10px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '13px', color: '#7f1d1d' }}>
            {error}
          </div>
        )}
      </div>

      {/* Listings Summary */}
      <div style={{
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h2 style={{ fontSize: '16px', marginBottom: '12px', color: '#1f2937' }}>📊 Listings Data</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
          <div style={{ backgroundColor: '#f3f4f6', padding: '15px', borderRadius: '6px' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
              {listings.length}
            </div>
            <div style={{ fontSize: '13px', color: '#6b7280' }}>Total Listings in Database</div>
          </div>
          <div style={{
            backgroundColor: listingsWithCoords.length > 0 ? '#d1fae5' : '#fee2e2',
            padding: '15px',
            borderRadius: '6px',
            border: `1px solid ${listingsWithCoords.length > 0 ? '#a7f3d0' : '#fecaca'}`
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: listingsWithCoords.length > 0 ? '#065f46' : '#991b1b' }}>
              {listingsWithCoords.length}
            </div>
            <div style={{ fontSize: '13px', color: listingsWithCoords.length > 0 ? '#047857' : '#7f1d1d' }}>
              Listings with Coordinates {listingsWithCoords.length > 0 ? '✅' : '❌'}
            </div>
          </div>
        </div>

        {/* Issue Diagnosis */}
        {listings.length === 0 && (
          <div style={{
            backgroundColor: '#fee2e2',
            border: '1px solid #fca5a5',
            padding: '15px',
            borderRadius: '6px'
          }}>
            <div style={{ color: '#991b1b', fontWeight: 'bold', marginBottom: '8px' }}>❌ No listings in database!</div>
            <p style={{ color: '#7f1d1d', margin: '0 0 10px 0' }}>This is why your map is empty. You need to seed the database with sample listings.</p>
            <p style={{ color: '#7f1d1d', margin: '0 0 10px 0' }}>Run this command in your terminal:</p>
            <div style={{
              backgroundColor: 'white',
              padding: '10px',
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '13px',
              color: '#1f2937'
            }}>
              cd backend && node init/index.js
            </div>
          </div>
        )}

        {listings.length > 0 && listingsWithCoords.length === 0 && (
          <div style={{
            backgroundColor: '#fee2e2',
            border: '1px solid #fca5a5',
            padding: '15px',
            borderRadius: '6px'
          }}>
            <div style={{ color: '#991b1b', fontWeight: 'bold', marginBottom: '8px' }}>❌ No coordinates in listings!</div>
            <p style={{ color: '#7f1d1d', margin: '0' }}>Your listings exist but don't have location coordinates. The map needs coordinates to display markers.</p>
          </div>
        )}

        {listings.length > 0 && listingsWithCoords.length > 0 && (
          <div style={{
            backgroundColor: '#d1fae5',
            border: '1px solid #a7f3d0',
            padding: '15px',
            borderRadius: '6px'
          }}>
            <div style={{ color: '#065f46', fontWeight: 'bold', marginBottom: '8px' }}>✅ Good! Data is ready for map</div>
            <p style={{ color: '#047857', margin: '0' }}>You have {listingsWithCoords.length} listings with coordinates. The issue is with loading the Google Maps API.</p>
          </div>
        )}
      </div>

      {/* Sample Listings */}
      {listings.length > 0 && (
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h2 style={{ fontSize: '16px', marginBottom: '12px', color: '#1f2937' }}>📍 Sample Listings</h2>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {listings.slice(0, 3).map((listing, idx) => (
              <div key={idx} style={{
                padding: '12px',
                marginBottom: '10px',
                backgroundColor: '#f9fafb',
                borderRadius: '6px',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ fontWeight: 'bold', color: '#1f2937', marginBottom: '6px' }}>
                  {idx + 1}. {listing.title}
                </div>
                <div style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.5' }}>
                  <div>📍 Location: {listing.location || 'N/A'}</div>
                  <div>🌍 Coordinates: {
                    listing.coordinates?.latitude && listing.coordinates?.longitude
                      ? `✅ (${listing.coordinates.latitude}, ${listing.coordinates.longitude})`
                      : '❌ Missing'
                  }</div>
                  <div>💰 Price: ₹{listing.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Solutions */}
      <div style={{
        backgroundColor: '#f0f9ff',
        border: '1px solid #bfdbfe',
        padding: '20px',
        borderRadius: '8px'
      }}>
        <h2 style={{ fontSize: '16px', marginBottom: '12px', color: '#0c4a6e' }}>💡 Solutions</h2>
        
        {listings.length === 0 ? (
          <ol style={{ marginLeft: '20px', color: '#164e63', lineHeight: '1.8' }}>
            <li style={{ marginBottom: '10px' }}>
              Open Terminal and run:
              <div style={{
                backgroundColor: '#dbeafe',
                padding: '10px',
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '13px',
                marginTop: '5px'
              }}>
                cd h:\Mayuresh\MajorProject-1\backend && node init/index.js
              </div>
            </li>
            <li style={{ marginBottom: '10px' }}>
              You should see: <code style={{ backgroundColor: '#dbeafe', padding: '2px 4px', borderRadius: '2px' }}>✅ Successfully inserted 6 listings</code>
            </li>
            <li>Refresh the page and the map will show markers</li>
          </ol>
        ) : listingsWithCoords.length === 0 ? (
          <ol style={{ marginLeft: '20px', color: '#164e63', lineHeight: '1.8' }}>
            <li style={{ marginBottom: '10px' }}>Clear your database or update listings with coordinates</li>
            <li style={{ marginBottom: '10px' }}>Re-seed with sample data (this adds coordinates automatically)</li>
            <li>Run: <code style={{ backgroundColor: '#dbeafe', padding: '2px 4px', borderRadius: '2px' }}>node init/index.js</code></li>
          </ol>
        ) : (
          <ol style={{ marginLeft: '20px', color: '#164e63', lineHeight: '1.8' }}>
            <li style={{ marginBottom: '10px' }}>Your data is ready! The issue is with Google Maps API loading</li>
            <li style={{ marginBottom: '10px' }}>Check if your API key is valid at: <a href="http://localhost:3000/diagnostic/key" style={{ color: '#0369a1', textDecoration: 'underline' }}>API Key Validator</a></li>
            <li style={{ marginBottom: '10px' }}>If API key is invalid, get a new one from: <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#0369a1', textDecoration: 'underline' }}>Google Cloud Console</a></li>
            <li>Update .env file with new API key and restart the app</li>
          </ol>
        )}
      </div>

      {/* Refresh Button */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button
          onClick={fetchListings}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          🔄 Refresh Data
        </button>
      </div>
    </div>
  );
}

export default MapDebugger;
