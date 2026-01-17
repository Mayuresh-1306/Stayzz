# Google Map Location - Troubleshooting Guide

## What I've Done

I've created a **diagnostic page** to help identify why the map isn't showing locations. This will help us pinpoint the exact issue.

## Steps to Test the Map Fix

### Step 1: Access the Diagnostic Page
1. Make sure both servers are running:
   - **Backend**: `npm run dev` in the `backend/` folder
   - **Frontend**: `npm start` in the `frontend/` folder

2. Open your browser and go to:
   ```
   http://localhost:3000/debug/map
   ```

### Step 2: Check the Diagnostic Report
The page will show:
- ✓ **Configuration**: Is your Google Maps API key set?
- ✓ **Backend Status**: Is the server running?
- ✓ **Data Status**: Do listings have coordinates?
- ✓ **Recommendations**: What to fix

## Common Issues & Solutions

### Issue 1: API Key Not Configured
**Error Message**: "API Key Configured: ✗ No"

**Solution**:
1. Open `frontend/.env`
2. Make sure this line exists and is not empty:
   ```
   REACT_APP_GOOGLE_MAPS_API_KEY=AIzaSyBDG-LY5_U9hSVXn1YUhEStUYEiTwIB1RM
   ```
3. Restart the frontend server

### Issue 2: No Listings in Database
**Error Message**: "Listings in DB: 0 listings"

**Solution**:
1. Go to the `backend/` folder
2. Run the seed script to populate sample data:
   ```bash
   node init/index.js
   ```
3. You should see:
   ```
   ✅ Successfully inserted X listings
   ```

### Issue 3: Listings Don't Have Coordinates
**Error Message**: "Has Coordinates: ✗ No"

**Solution**:
1. Clear your database and re-seed it:
   ```bash
   # Delete the database or clear collections
   # Then run:
   node init/index.js
   ```

2. The seed data includes coordinates for all listings:
   - Malibu, California: 34.0259, -118.6825
   - Manhattan, New York: 40.7128, -74.0060
   - Aspen, Colorado: 39.1911, -106.8175
   - Florence, Tuscany: 43.7696, 11.2558
   - Portland, Oregon: 45.5152, -122.6784
   - Cancun, Mexico: 21.1619, -86.8515

### Issue 4: Backend Not Running
**Error Message**: "Error: Cannot connect to backend"

**Solution**:
1. Make sure MongoDB is running (for local development)
2. Check that the backend is listening on port 5002:
   ```bash
   cd backend
   npm run dev
   ```

## How to Run Everything

### Quick Start (All servers)

**Terminal 1 - Backend**:
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend**:
```bash
cd frontend
npm start
```

**Terminal 3 - MongoDB (if using local)**:
```bash
# Make sure mongod is running
mongod
```

## Testing the Map

Once everything passes the diagnostic:

1. Go to `http://localhost:3000` (HomePage)
2. You should see the **"Browse Locations"** section with the Google Map
3. Red markers should appear for each listing

## Browser Console Tips

Open Developer Tools (F12) and check the Console tab for messages like:
- `MapComponent received listings: [...]`
- `Valid listings with coordinates: 6`
- `Map center calculated: {lat: ..., lng: ...}`

These messages help confirm data is flowing correctly.

## If Map Still Doesn't Show

1. **Check API Key**:
   - Visit: https://console.cloud.google.com/
   - Verify your API key is active
   - Ensure "Maps JavaScript API" is enabled

2. **Check CORS**:
   - The backend allows requests from `http://localhost:3000`
   - If you're running on a different port, update `CLIENT_URL` in backend/.env

3. **Check Google Maps Library**:
   - Open DevTools (F12)
   - Run: `console.log(window.google)` 
   - Should show the Google Maps API object

## Files Modified

- ✅ `frontend/src/components/MapComponent.jsx` - Enhanced with error handling
- ✅ `frontend/src/pages/HomePage.jsx` - Added debug logging
- ✅ `frontend/src/utils/mapDebug.js` - Diagnostic utility (NEW)
- ✅ `frontend/src/pages/MapDebugPage.jsx` - Diagnostic page (NEW)
- ✅ `frontend/src/App.jsx` - Added debug route

## Next Steps

1. Access: **http://localhost:3000/debug/map**
2. Share the diagnostic output
3. We'll fix any remaining issues!

---

**Your map should work once all diagnostics pass! 🗺️**
