import React, { useEffect, useState } from 'react';

function APIKeyValidator() {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const [tests, setTests] = useState({
    keyExists: null,
    canFetchAPI: null,
    scriptLoads: null,
    mapInitializes: null,
    errorDetails: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    runTests();
  }, []);

  const runTests = async () => {
    const results = { ...tests };

    // Test 1: Check if key exists
    results.keyExists = !!apiKey;

    if (!apiKey) {
      setTests(results);
      setLoading(false);
      return;
    }

    // Test 2: Try to fetch the API directly
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/js?key=${apiKey}`
      );
      results.canFetchAPI = response.ok;
      
      if (!response.ok) {
        const text = await response.text();
        results.errorDetails = `HTTP ${response.status}: ${text.substring(0, 200)}`;
      }
    } catch (error) {
      results.canFetchAPI = false;
      results.errorDetails = `Fetch error: ${error.message}`;
    }

    // Test 3: Try to load script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;

    script.onload = () => {
      results.scriptLoads = true;
      results.mapInitializes = !!window.google?.maps;
      setTests(results);
      setLoading(false);
    };

    script.onerror = (err) => {
      results.scriptLoads = false;
      results.errorDetails = 'Script failed to load';
      setTests(results);
      setLoading(false);
    };

    // Set timeout
    setTimeout(() => {
      if (loading) {
        results.scriptLoads = false;
        results.errorDetails = 'Script load timeout (3s)';
        setTests(results);
        setLoading(false);
      }
    }, 3000);

    document.head.appendChild(script);
  };

  const getStatus = (value) => {
    if (value === null) return '⏳ Pending';
    return value ? '✅ Pass' : '❌ Fail';
  };

  const getStatusColor = (value) => {
    if (value === null) return '#f59e0b';
    return value ? '#10b981' : '#ef4444';
  };

  return (
    <div style={{
      maxWidth: '900px',
      margin: '40px auto',
      padding: '30px',
      fontFamily: 'system-ui',
      backgroundColor: '#f9fafb',
      borderRadius: '8px'
    }}>
      <h1 style={{ marginBottom: '10px', color: '#1f2937' }}>🔑 Google Maps API Key Validator</h1>
      <p style={{ color: '#6b7280', marginBottom: '30px' }}>
        Testing your API key configuration to identify the issue
      </p>

      {/* API Key Display */}
      <div style={{
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        padding: '20px',
        borderRadius: '6px',
        marginBottom: '20px'
      }}>
        <h2 style={{ fontSize: '16px', marginBottom: '12px', color: '#1f2937' }}>API Key Status</h2>
        <div style={{
          backgroundColor: tests.keyExists ? '#d1fae5' : '#fee2e2',
          border: `1px solid ${tests.keyExists ? '#a7f3d0' : '#fecaca'}`,
          padding: '12px',
          borderRadius: '4px',
          fontFamily: 'monospace',
          fontSize: '13px'
        }}>
          <div style={{ color: tests.keyExists ? '#065f46' : '#991b1b', fontWeight: 'bold', marginBottom: '8px' }}>
            {tests.keyExists ? '✅ API Key Configured' : '❌ API Key Missing'}
          </div>
          {apiKey && (
            <div style={{ color: '#6b7280' }}>
              {apiKey.substring(0, 20)}...{apiKey.substring(apiKey.length - 10)}
            </div>
          )}
        </div>
      </div>

      {/* Test Results */}
      {apiKey && (
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          padding: '20px',
          borderRadius: '6px',
          marginBottom: '20px'
        }}>
          <h2 style={{ fontSize: '16px', marginBottom: '12px', color: '#1f2937' }}>Validation Tests</h2>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '12px',
              backgroundColor: '#f3f4f6',
              borderRadius: '4px'
            }}>
              <span style={{ fontWeight: '500', color: '#374151' }}>1. API Endpoint Accessible</span>
              <span style={{
                color: getStatusColor(tests.canFetchAPI),
                fontWeight: 'bold'
              }}>
                {getStatus(tests.canFetchAPI)}
              </span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '12px',
              backgroundColor: '#f3f4f6',
              borderRadius: '4px'
            }}>
              <span style={{ fontWeight: '500', color: '#374151' }}>2. Script Loads</span>
              <span style={{
                color: getStatusColor(tests.scriptLoads),
                fontWeight: 'bold'
              }}>
                {getStatus(tests.scriptLoads)}
              </span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '12px',
              backgroundColor: '#f3f4f6',
              borderRadius: '4px'
            }}>
              <span style={{ fontWeight: '500', color: '#374151' }}>3. Google Maps Object Available</span>
              <span style={{
                color: getStatusColor(tests.mapInitializes),
                fontWeight: 'bold'
              }}>
                {getStatus(tests.mapInitializes)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Error Details */}
      {tests.errorDetails && (
        <div style={{
          backgroundColor: '#fee2e2',
          border: '1px solid #fca5a5',
          padding: '20px',
          borderRadius: '6px',
          marginBottom: '20px'
        }}>
          <h2 style={{ fontSize: '16px', marginBottom: '12px', color: '#991b1b' }}>❌ Error Details</h2>
          <div style={{
            backgroundColor: 'white',
            padding: '12px',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '13px',
            color: '#7f1d1d',
            wordBreak: 'break-word',
            lineHeight: '1.5'
          }}>
            {tests.errorDetails}
          </div>
        </div>
      )}

      {/* Solutions */}
      <div style={{
        backgroundColor: '#f0f9ff',
        border: '1px solid #bfdbfe',
        padding: '20px',
        borderRadius: '6px'
      }}>
        <h2 style={{ fontSize: '16px', marginBottom: '12px', color: '#0c4a6e' }}>💡 Solutions</h2>

        {!tests.keyExists ? (
          <div style={{ color: '#164e63', lineHeight: '1.6' }}>
            <p style={{ marginBottom: '10px', fontWeight: '500' }}>Your API key is not configured:</p>
            <ol style={{ marginLeft: '20px', marginBottom: '15px' }}>
              <li style={{ marginBottom: '8px' }}>
                Go to <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#0369a1', textDecoration: 'underline' }}>Google Cloud Console</a>
              </li>
              <li style={{ marginBottom: '8px' }}>Create a new project or select existing one</li>
              <li style={{ marginBottom: '8px' }}>Search for and enable: <strong>Maps JavaScript API</strong></li>
              <li style={{ marginBottom: '8px' }}>Go to Credentials → Create API Key</li>
              <li style={{ marginBottom: '8px' }}>Copy the key and update <code style={{ backgroundColor: '#dbeafe', padding: '2px 4px' }}>.env</code> file</li>
              <li>Restart your app</li>
            </ol>
          </div>
        ) : tests.canFetchAPI === false ? (
          <div style={{ color: '#164e63', lineHeight: '1.6' }}>
            <p style={{ marginBottom: '10px', fontWeight: '500' }}>Your API key cannot access Google Maps:</p>
            <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
              <li style={{ marginBottom: '8px' }}>❌ API key is invalid or expired</li>
              <li style={{ marginBottom: '8px' }}>❌ Maps JavaScript API is not enabled</li>
              <li style={{ marginBottom: '8px' }}>❌ API key has domain restrictions (allow localhost)</li>
              <li style={{ marginBottom: '8px' }}>❌ Billing is not enabled</li>
            </ul>
            <p style={{ fontWeight: '500', marginBottom: '10px' }}>Try:</p>
            <ol style={{ marginLeft: '20px' }}>
              <li style={{ marginBottom: '8px' }}>Generate a brand new API key</li>
              <li style={{ marginBottom: '8px' }}>Ensure Maps JavaScript API is enabled</li>
              <li style={{ marginBottom: '8px' }}>Remove any domain restrictions</li>
              <li>Enable billing in Google Cloud Console</li>
            </ol>
          </div>
        ) : tests.scriptLoads === false ? (
          <div style={{ color: '#164e63', lineHeight: '1.6' }}>
            <p style={{ marginBottom: '10px', fontWeight: '500' }}>The Google Maps script failed to load:</p>
            <ul style={{ marginLeft: '20px' }}>
              <li style={{ marginBottom: '8px' }}>🔍 Check your internet connection</li>
              <li style={{ marginBottom: '8px' }}>🔍 Check browser console (F12) for CORS errors</li>
              <li style={{ marginBottom: '8px' }}>🔍 Try a new API key</li>
              <li>🔍 Check if Google's servers are accessible</li>
            </ul>
          </div>
        ) : tests.mapInitializes === true ? (
          <div style={{ color: '#164e63', padding: '15px', backgroundColor: '#d1fae5', borderRadius: '4px' }}>
            <p style={{ fontWeight: '500', margin: '0' }}>✅ Your API key is working correctly!</p>
            <p style={{ margin: '8px 0 0 0', fontSize: '13px' }}>The maps should now display properly. If you still don't see a map, check that listings have coordinates.</p>
          </div>
        ) : null}
      </div>

      {loading && (
        <div style={{
          marginTop: '20px',
          textAlign: 'center',
          color: '#6b7280',
          fontStyle: 'italic'
        }}>
          Testing your API key... (this may take up to 3 seconds)
        </div>
      )}
    </div>
  );
}

export default APIKeyValidator;
