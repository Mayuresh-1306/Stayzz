import React, { useEffect, useState } from 'react';

function DebugMapPage() {
  const [diagnostics, setDiagnostics] = useState(null);
  const [listings, setListings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5002';
      
      // Check API Key
      const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
      
      // Test backend health
      const healthRes = await fetch(`${backendUrl}/api/health`);
      const health = await healthRes.json();

      // Fetch listings
      const listingsRes = await fetch(`${backendUrl}/api/listings`);
      const listingsData = await listingsRes.json();

      setListings(listingsData);
      setDiagnostics({
        apiKeyConfigured: !!apiKey,
        apiKeyValue: apiKey?.substring(0, 10) + '...' || 'NOT SET',
        backendUrl,
        backendRunning: health.status,
        listingsCount: listingsData.length,
        hasCoodinates: listingsData.length > 0 && !!listingsData[0].coordinates,
        sampleListingCoordinates: listingsData.length > 0 ? listingsData[0].coordinates : 'N/A',
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">🗺️ Map Diagnostics</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
            <strong>Error:</strong> {error}
          </div>
        )}

        {diagnostics && (
          <div className="space-y-6">
            {/* Configuration */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Configuration</h2>
              <div className="space-y-3">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold">API Key Configured:</span>
                  <span className={diagnostics.apiKeyConfigured ? 'text-green-600' : 'text-red-600'}>
                    {diagnostics.apiKeyConfigured ? '✓ Yes' : '✗ No'}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold">API Key Value:</span>
                  <span className="text-gray-600">{diagnostics.apiKeyValue}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold">Backend URL:</span>
                  <span className="text-gray-600">{diagnostics.backendUrl}</span>
                </div>
              </div>
            </div>

            {/* Backend Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Backend Status</h2>
              <div className="space-y-3">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold">Backend Running:</span>
                  <span className="text-green-600">✓ {diagnostics.backendRunning}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold">Listings in DB:</span>
                  <span className="text-gray-600">{diagnostics.listingsCount} listings</span>
                </div>
              </div>
            </div>

            {/* Data Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Data Status</h2>
              <div className="space-y-3">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-semibold">Has Coordinates:</span>
                  <span className={diagnostics.hasCoodinates ? 'text-green-600' : 'text-red-600'}>
                    {diagnostics.hasCoodinates ? '✓ Yes' : '✗ No'}
                  </span>
                </div>
                <div className="border-b pb-2">
                  <span className="font-semibold">Sample Coordinates:</span>
                  <div className="text-gray-600 mt-2">
                    <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                      {JSON.stringify(diagnostics.sampleListingCoordinates, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            {/* Listings Data */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Listings Data</h2>
              <div className="overflow-auto max-h-96 border rounded">
                <pre className="p-4 text-xs bg-gray-50">
                  {JSON.stringify(listings.slice(0, 3), null, 2)}
                </pre>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-blue-900 mb-4">✓ Recommendations</h2>
              <ul className="list-disc list-inside space-y-2 text-blue-800">
                {!diagnostics.apiKeyConfigured && (
                  <li>Add REACT_APP_GOOGLE_MAPS_API_KEY to .env file</li>
                )}
                {!diagnostics.hasCoodinates && (
                  <li>Your listings don't have coordinates. Run: <code className="bg-blue-100 px-2 py-1 rounded">node backend/init/index.js</code></li>
                )}
                {diagnostics.listingsCount === 0 && (
                  <li>No listings in database. Seed the database first.</li>
                )}
                {diagnostics.hasCoodinates && diagnostics.listingsCount > 0 && diagnostics.apiKeyConfigured && (
                  <li>✓ Everything looks good! Try navigating to the homepage.</li>
                )}
              </ul>
            </div>
          </div>
        )}

        {!diagnostics && !error && (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading diagnostics...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DebugMapPage;
