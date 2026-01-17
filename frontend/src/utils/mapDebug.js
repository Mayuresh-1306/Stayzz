// Debug utility for map issues

export const checkMapSetup = async () => {
  const checks = {
    apiKey: !!process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    apiKeyValue: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    backendUrl: process.env.REACT_APP_BACKEND_URL,
    googleMapsLoaded: !!window.google,
    googleMapsVersion: window.google?.maps?.version,
  };

  console.log('=== MAP SETUP DIAGNOSTIC ===');
  console.log('API Key Configured:', checks.apiKey);
  console.log('API Key:', checks.apiKeyValue);
  console.log('Backend URL:', checks.backendUrl);
  console.log('Google Maps Loaded:', checks.googleMapsLoaded);
  
  return checks;
};

export const testBackendConnection = async () => {
  try {
    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5002';
    
    // Test health endpoint
    const healthResponse = await fetch(`${backendUrl}/api/health`);
    const healthData = await healthResponse.json();
    console.log('Backend Health:', healthData);

    // Test listings endpoint
    const listingsResponse = await fetch(`${backendUrl}/api/listings`);
    const listingsData = await listingsResponse.json();
    console.log('Listings Count:', listingsData.length);
    console.log('Sample Listing:', listingsData[0]);

    if (listingsData.length > 0 && listingsData[0].coordinates) {
      console.log('Coordinates in Data:', listingsData[0].coordinates);
    } else {
      console.warn('⚠️ No coordinates found in listings!');
    }

    return {
      success: true,
      health: healthData,
      listingsCount: listingsData.length,
      hasCoodinates: listingsData.length > 0 && !!listingsData[0].coordinates,
    };
  } catch (error) {
    console.error('Backend Connection Error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export const logMapData = (listings, mapCenter) => {
  console.log('=== MAP DATA ===');
  console.log('Total Listings:', listings.length);
  console.log('Listings with Coordinates:', listings.filter(l => l.coordinates?.latitude && l.coordinates?.longitude).length);
  console.log('Map Center:', mapCenter);
  console.log('Full Listings Data:', JSON.stringify(listings, null, 2));
};
