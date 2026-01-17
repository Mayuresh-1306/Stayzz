# Stayzz MERN Setup Guide

## Quick Start Guide

### Step 1: Backend Setup

```bash
# Navigate to backend
cd h:\Mayuresh\MajorProject-1\backend

# Install dependencies
npm install

# Create .env file and add your configurations
# Copy from .env.example and fill in your values
```

### Step 2: Frontend Setup

```bash
# Navigate to frontend
cd h:\Mayuresh\MajorProject-1\frontend

# Install dependencies
npm install

# Create .env file
# Copy from .env.example and fill in your values
```

### Step 3: Get API Keys

#### Google Maps API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Maps JavaScript API
4. Create API Key
5. Add to `.env` files

#### Cloudinary
1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Get API credentials from Dashboard
3. Add to backend `.env`

#### MongoDB Atlas
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Add to backend `.env` as `ATLASDB_URL`

### Step 4: Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

## Available Scripts

### Backend
- `npm start` - Run production server
- `npm run dev` - Run development server with nodemon

### Frontend
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## File Structure Explanation

### Backend Organization
```
backend/
├── models/
│   ├── user.js          # User schema with authentication
│   ├── listing.js       # Property listing schema
│   └── review.js        # Review schema
├── controllers/
│   ├── user.js          # User logic (signup, login)
│   ├── listing.js       # Listing CRUD operations
│   └── review.js        # Review operations
├── routes/
│   ├── user.js          # User API routes
│   ├── listing.js       # Listing API routes
│   └── review.js        # Review API routes
├── middleware/
│   └── auth.js          # JWT verification
├── utils/
│   └── ExpressError.js  # Custom error handler
├── init/
│   └── data.js          # Sample data for testing
└── server.js            # Express app entry point
```

### Frontend Organization
```
frontend/src/
├── components/
│   ├── Navbar.jsx       # Navigation bar
│   ├── Footer.jsx       # Footer component
│   └── MapComponent.jsx # Google Maps integration
├── pages/
│   ├── HomePage.jsx     # Landing page with map
│   ├── ListingsPage.jsx # All listings with filters
│   ├── ListingDetailPage.jsx  # Single listing details
│   ├── NewListingPage.jsx     # Create listing
│   ├── EditListingPage.jsx    # Edit listing
│   └── Users/
│       ├── LoginPage.jsx      # User login
│       └── SignupPage.jsx     # User registration
├── services/            # API call functions
├── App.jsx             # Main app component
└── index.js            # React entry point
```

## Database Schema Overview

### User Model
- username
- email
- password (hashed)
- phone
- listings (array of listing IDs)

### Listing Model
- title
- description
- price
- location
- country
- coordinates (for map)
- image (Cloudinary URL)
- owner (user ID)
- reviews (array of review IDs)

### Review Model
- comment
- rating
- author (user ID)
- listing (listing ID)
- createdAt

## Authentication Flow

1. User signs up → Password hashed → JWT token created
2. Token stored in localStorage on frontend
3. Token sent in Authorization header for protected routes
4. Backend verifies JWT before processing request

## Important Notes

1. **API Base URL:** Update in frontend `.env`
2. **CORS:** Enabled for `http://localhost:3000`
3. **Image Upload:** Uses Cloudinary (free tier available)
4. **Maps:** Google Maps API quota limits apply
5. **Database:** Use MongoDB Atlas for free tier

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Kill process on port 3000 (frontend)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### CORS Errors
- Check `CLIENT_URL` in backend `.env`
- Ensure frontend and backend are running
- Clear browser cache

### Google Maps Not Loading
- Verify API key in `.env`
- Check API is enabled in Google Cloud Console
- Ensure proper quotas

### Database Connection Failed
- Check MongoDB Atlas connection string
- Verify network access whitelist
- Ensure `ATLASDB_URL` is correct

## Next Steps

1. Customize styling with Tailwind CSS
2. Add booking system with payment integration
3. Implement email notifications
4. Add admin dashboard
5. Set up CI/CD pipeline
6. Deploy to production (Heroku, Vercel, Railway)

## Support & Resources

- [Express.js Docs](https://expressjs.com/)
- [React Docs](https://react.dev/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Google Maps API](https://developers.google.com/maps)
- [Tailwind CSS](https://tailwindcss.com/)
