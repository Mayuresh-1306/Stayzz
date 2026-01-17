import React from 'react';

function QuickDiagnostic() {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  React.useEffect(() => {
    console.log('=== QUICK DIAGNOSTIC ===');
    console.log('API Key:', apiKey?.substring(0, 20) + '...');
    console.log('Backend URL:', backendUrl);
    console.log('Window Google:', !!window.google);
    console.log('React Version:', React.version);
  }, []);

  const testApiKey = async () => {
    try {
      // Test if API key is valid by trying to load a simple Google Maps script
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        alert('✅ Google Maps API Key is VALID');
        console.log('✅ API Key is valid');
      };
      
      script.onerror = () => {
        alert('❌ Google Maps API Key is INVALID or API not enabled');
        console.log('❌ API Key error');
      };
      
      document.head.appendChild(script);
    } catch (error) {
      alert('Error testing API key: ' + error.message);
    }
  };

  return (
    <div style={{
      maxWidth: '800px',
      margin: '50px auto',
      padding: '30px',
      backgroundColor: '#f9fafb',
      borderRadius: '8px',
      fontFamily: 'system-ui'
    }}>
      <h1 style={{ marginBottom: '30px', color: '#1f2937' }}>🗺️ Quick Diagnostic</h1>

      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '6px',
        marginBottom: '20px',
        border: '1px solid #e5e7eb'
      }}>
        <h2 style={{ fontSize: '18px', marginBottom: '15px', color: '#374151' }}>Environment Variables</h2>
        <div style={{ fontFamily: 'monospace', fontSize: '14px' }}>
          <div style={{ marginBottom: '10px' }}>
            <strong style={{ color: '#4b5563' }}>API Key:</strong>
            <div style={{ color: apiKey ? '#059669' : '#dc2626', marginTop: '5px' }}>
              {apiKey ? `✅ ${apiKey.substring(0, 20)}...` : '❌ NOT SET'}
            </div>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong style={{ color: '#4b5563' }}>Backend URL:</strong>
            <div style={{ color: backendUrl ? '#059669' : '#dc2626', marginTop: '5px' }}>
              {backendUrl ? `✅ ${backendUrl}` : '❌ NOT SET'}
            </div>
          </div>
        </div>
      </div>

      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '6px',
        marginBottom: '20px',
        border: '1px solid #e5e7eb'
      }}>
        <h2 style={{ fontSize: '18px', marginBottom: '15px', color: '#374151' }}>Browser Info</h2>
        <div style={{ fontFamily: 'monospace', fontSize: '14px' }}>
          <div style={{ marginBottom: '10px' }}>
            <strong style={{ color: '#4b5563' }}>Window.google:</strong>
            <div style={{ color: window.google ? '#059669' : '#dc2626', marginTop: '5px' }}>
              {window.google ? '✅ Loaded' : '⏳ Not loaded yet'}
            </div>
          </div>
          <div>
            <strong style={{ color: '#4b5563' }}>User Agent:</strong>
            <div style={{ color: '#6b7280', marginTop: '5px', fontSize: '12px' }}>
              {navigator.userAgent}
            </div>
          </div>
        </div>
      </div>

      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '6px',
        marginBottom: '20px',
        border: '1px solid #e5e7eb'
      }}>
        <h2 style={{ fontSize: '18px', marginBottom: '15px', color: '#374151' }}>Actions</h2>
        <button
          onClick={testApiKey}
          style={{
            backgroundColor: '#ef4444',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          Test API Key
        </button>
      </div>

      <div style={{
        backgroundColor: '#fef3c7',
        border: '1px solid #fcd34d',
        padding: '15px',
        borderRadius: '6px',
        color: '#92400e'
      }}>
        <strong>📌 Tips:</strong>
        <ul style={{ marginTop: '10px', marginLeft: '20px' }}>
          <li>Open DevTools (F12) and check the Console tab</li>
          <li>If you see errors, share them with me</li>
          <li>Click "Test API Key" to validate your key</li>
          <li>Check if Backend is running on port 5002</li>
        </ul>
      </div>
    </div>
  );
}

export default QuickDiagnostic;
