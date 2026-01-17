import React, { useState, useEffect } from 'react';

function GoogleMapsErrorDiagnostic() {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const [errors, setErrors] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [testResults, setTestResults] = useState(null);

  // Capture console errors
  useEffect(() => {
    const originalError = console.error;
    const originalWarn = console.warn;
    const capturedErrors = [];

    console.error = function(...args) {
      capturedErrors.push({ type: 'error', message: args.join(' '), time: new Date().toLocaleTimeString() });
      setErrors([...capturedErrors]);
      originalError.apply(console, args);
    };

    console.warn = function(...args) {
      if (args[0]?.includes('Maps') || args[0]?.includes('Google')) {
        capturedErrors.push({ type: 'warn', message: args.join(' '), time: new Date().toLocaleTimeString() });
        setErrors([...capturedErrors]);
      }
      originalWarn.apply(console, args);
    };

    return () => {
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  useEffect(() => {
    testGoogleMapsLoading();
  }, []);

  const testGoogleMapsLoading = async () => {
    try {
      const results = {
        apiKeyExists: !!apiKey,
        apiKeyLength: apiKey?.length || 0,
        apiKeyStartsWith: apiKey?.substring(0, 20) || 'N/A',
      };

      // Test 1: Try to create a script tag
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
      script.async = true;
      script.defer = true;

      let scriptLoaded = false;

      script.onload = () => {
        scriptLoaded = true;
        setLoaded(true);
        results.scriptLoaded = true;
        results.windowGoogle = !!window.google;
        setTestResults(results);
        console.log('✅ Google Maps script loaded successfully');
      };

      script.onerror = (error) => {
        results.scriptError = 'Failed to load script';
        results.windowGoogle = !!window.google;
        setTestResults(results);
        console.error('❌ Google Maps script failed to load:', error);
      };

      // Set a timeout to check if script loaded
      setTimeout(() => {
        if (!scriptLoaded) {
          results.scriptLoaded = false;
          results.timeout = true;
          results.windowGoogle = !!window.google;
          setTestResults(results);
        }
      }, 3000);

      // Only append if we haven't already
      if (!document.querySelector('script[src*="maps.googleapis.com"]')) {
        document.head.appendChild(script);
      }
    } catch (error) {
      console.error('Test error:', error);
      setTestResults({ error: error.message });
    }
  };

  return (
    <div style={{
      maxWidth: '1000px',
      margin: '40px auto',
      padding: '30px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1 style={{ marginBottom: '10px', color: '#1f2937' }}>🔍 Google Maps Error Diagnostic</h1>
      <p style={{ color: '#6b7280', marginBottom: '30px' }}>This page will help identify why Google Maps isn't loading</p>

      {/* Configuration Check */}
      <div style={{
        backgroundColor: '#f3f4f6',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #e5e7eb'
      }}>
        <h2 style={{ fontSize: '18px', marginBottom: '15px', color: '#1f2937' }}>✓ Configuration</h2>
        <div style={{ display: 'grid', gap: '12px' }}>
          <div style={{ padding: '12px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #d1d5db' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '600', color: '#374151' }}>API Key Configured:</span>
              <span style={{ 
                color: apiKey ? '#059669' : '#dc2626',
                fontWeight: 'bold',
                fontSize: '14px'
              }}>
                {apiKey ? '✅ YES' : '❌ NO'}
              </span>
            </div>
            {apiKey && (
              <div style={{ marginTop: '8px', color: '#6b7280', fontSize: '13px', fontFamily: 'monospace' }}>
                {apiKey.substring(0, 20)}... ({apiKey.length} chars)
              </div>
            )}
          </div>
          <div style={{ padding: '12px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #d1d5db' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: '600', color: '#374151' }}>Backend URL:</span>
              <span style={{ color: '#6b7280' }}>{process.env.REACT_APP_BACKEND_URL || 'Not set'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Test Results */}
      {testResults && (
        <div style={{
          backgroundColor: testResults.scriptLoaded ? '#d1fae5' : '#fee2e2',
          border: `1px solid ${testResults.scriptLoaded ? '#6ee7b7' : '#fca5a5'}`,
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h2 style={{ fontSize: '18px', marginBottom: '15px', color: testResults.scriptLoaded ? '#065f46' : '#991b1b' }}>
            {testResults.scriptLoaded ? '✅ Script Load Test Passed' : '❌ Script Load Test Failed'}
          </h2>
          <div style={{ fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.6' }}>
            {Object.entries(testResults).map(([key, value]) => (
              <div key={key} style={{ marginBottom: '8px' }}>
                <span style={{ fontWeight: 'bold', color: testResults.scriptLoaded ? '#047857' : '#7f1d1d' }}>
                  {key}:
                </span>
                <span style={{ marginLeft: '10px', color: testResults.scriptLoaded ? '#065f46' : '#991b1b' }}>
                  {String(value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Console Errors & Warnings */}
      <div style={{
        backgroundColor: '#fef3c7',
        border: '1px solid #fcd34d',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h2 style={{ fontSize: '18px', marginBottom: '15px', color: '#92400e' }}>📋 Console Messages</h2>
        {errors.length === 0 ? (
          <p style={{ color: '#b45309' }}>No errors captured yet. Check your browser console (F12) for errors.</p>
        ) : (
          <div style={{ fontFamily: 'monospace', fontSize: '12px', maxHeight: '300px', overflowY: 'auto' }}>
            {errors.map((err, idx) => (
              <div
                key={idx}
                style={{
                  padding: '8px',
                  marginBottom: '8px',
                  backgroundColor: err.type === 'error' ? '#fef2f2' : '#fffbeb',
                  border: `1px solid ${err.type === 'error' ? '#fee2e2' : '#fef3c7'}`,
                  borderRadius: '4px',
                  borderLeft: `3px solid ${err.type === 'error' ? '#dc2626' : '#f59e0b'}`
                }}>
                <div style={{ fontWeight: 'bold', color: err.type === 'error' ? '#991b1b' : '#92400e' }}>
                  [{err.time}] {err.type.toUpperCase()}
                </div>
                <div style={{ color: '#6b7280', marginTop: '4px', wordBreak: 'break-word' }}>
                  {err.message}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Possible Solutions */}
      <div style={{
        backgroundColor: '#f0f9ff',
        border: '1px solid #bfdbfe',
        padding: '20px',
        borderRadius: '8px'
      }}>
        <h2 style={{ fontSize: '18px', marginBottom: '15px', color: '#0c4a6e' }}>💡 Possible Solutions</h2>
        <ol style={{ marginLeft: '20px', color: '#164e63' }}>
          <li style={{ marginBottom: '10px' }}>
            <strong>Invalid or Expired API Key</strong>
            <ul style={{ marginTop: '5px', marginLeft: '20px', color: '#475569' }}>
              <li>Go to: https://console.cloud.google.com/</li>
              <li>Check that your API key is active</li>
              <li>Verify "Maps JavaScript API" is enabled</li>
              <li>Check API key restrictions (should allow any origin for development)</li>
            </ul>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Domain or IP Restrictions</strong>
            <ul style={{ marginTop: '5px', marginLeft: '20px', color: '#475569' }}>
              <li>Your API key might be restricted to specific domains</li>
              <li>For development, use an unrestricted key or add localhost:3000</li>
            </ul>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>API Key Not Enabled</strong>
            <ul style={{ marginTop: '5px', marginLeft: '20px', color: '#475569' }}>
              <li>In Google Cloud Console, enable these APIs:</li>
              <li>✓ Maps JavaScript API</li>
              <li>✓ Places API</li>
              <li>✓ Geocoding API</li>
            </ul>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <strong>Billing Not Enabled</strong>
            <ul style={{ marginTop: '5px', marginLeft: '20px', color: '#475569' }}>
              <li>Google Cloud requires a billing account for Maps API</li>
              <li>Even with free tier, you need to set up billing</li>
              <li>Free tier: $200/month free usage</li>
            </ul>
          </li>
        </ol>
      </div>

      {/* Next Steps */}
      <div style={{
        backgroundColor: '#f3f4f6',
        padding: '20px',
        borderRadius: '8px',
        marginTop: '20px',
        border: '1px solid #e5e7eb'
      }}>
        <h3 style={{ marginBottom: '10px', color: '#1f2937' }}>📌 Next Steps:</h3>
        <ol style={{ marginLeft: '20px', color: '#4b5563' }}>
          <li>Open DevTools: Press <code style={{ backgroundColor: '#e5e7eb', padding: '2px 6px', borderRadius: '3px' }}>F12</code></li>
          <li>Go to Console tab</li>
          <li>Look for any red error messages starting with "Google Maps API error"</li>
          <li>Copy the entire error message</li>
          <li>Share it with me so I can help fix it</li>
        </ol>
      </div>
    </div>
  );
}

export default GoogleMapsErrorDiagnostic;
