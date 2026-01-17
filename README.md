# 🏨 Stayzz - Airbnb-Style Property Rental Platform

A modern, full-stack property rental platform built with React and Express, featuring an **interactive Airbnb-like map interface** for discovering and booking unique accommodations worldwide. Fully responsive design optimized for mobile, tablet, and desktop devices.

## ✨ Highlights

- 🗺️ **Interactive Airbnb-Style Map** with real-time property visualization and coordinate mapping
- 📱 **Fully Responsive Design** - seamless experience on all devices
- 🔍 **Advanced Listing Discovery** with filtering and detailed property information
- 💬 **Integrated Review System** for transparent guest feedback
- 🔐 **Secure Authentication** with JWT-based login/signup
- 🏠 **Complete Property Management** - create, edit, and manage listings
- ☁️ **Cloud Image Upload** via Cloudinary
- 📍 **Location Intelligence** with GPS coordinates and map integration

## 🎯 Key Features

### For Travelers
- ✅ Browse properties on beautiful interactive map view
- ✅ View detailed listing information with high-quality images
- ✅ Read authentic guest reviews and ratings
- ✅ Search and filter properties by location
- ✅ Responsive mobile-friendly interface
- ✅ See exact property coordinates and locations

### For Property Owners
- ✅ Create and manage property listings easily
- ✅ Upload property images (unlimited with Cloudinary)
- ✅ Set and adjust competitive pricing
- ✅ Edit listing details anytime
- ✅ Track customer reviews and ratings
- ✅ Monitor bookings and reservations

### Technical Features
- ✅ Smart fallback map visualization (works without Google Maps API)
- ✅ Auto-generating sample data for demo purposes
- ✅ Real-time location mapping with coordinate normalization
- ✅ Responsive grid layouts for all screen sizes
- ✅ Comprehensive error handling and graceful degradation

## 🛠️ Tech Stack

### Backend
- **Node.js 22.16.0** - JavaScript runtime
- **Express 5.1.0** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **Cloudinary** - Image hosting & CDN
- **Joi** - Schema validation

### Frontend
- **React 18.2.0** - UI library
- **React Router v6** - Client-side routing
- **Tailwind CSS 3.3.6** - Utility-first CSS framework
- **Axios** - Promise-based HTTP client
- **React Icons** - Icon library
- **Google Maps JavaScript API** - Map integration
- **React Toastify** - Toast notifications

## Project Structure

```
MajorProject-1/
├── backend/
│   ├── models/          # Mongoose schemas
│   ├── controllers/      # Business logic
│   ├── routes/          # API routes
│   ├── middleware/      # Express middleware
│   ├── utils/           # Helper functions
│   ├── init/            # Database initialization
│   ├── server.js        # Express app
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── public/          # Static files
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   ├── App.jsx
│   │   └── index.js
│   ├── package.json
│   ├── tailwind.config.js
│   └── .env.example
│
└── README.md
```

## Installation

### Prerequisites
- Node.js (v22.16.0 or higher)
- MongoDB Atlas account
- Cloudinary account
- Google Maps API Key

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your credentials:
```
ATLASDB_URL=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GOOGLE_MAPS_API_KEY=your_google_maps_key
```

5. Start the backend server:
```bash
npm run dev
```

Server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env`:
```
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_key
REACT_APP_BACKEND_URL=http://localhost:5000
```

5. Start the React app:
```bash
npm start
```

App will open on `http://localhost:3000`

## API Endpoints

### Users
- `POST /api/users/signup` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/:id` - Get user profile

### Listings
- `GET /api/listings` - Get all listings
- `GET /api/listings/:id` - Get single listing
- `POST /api/listings` - Create new listing (authenticated)
- `PUT /api/listings/:id` - Update listing (owner only)
- `DELETE /api/listings/:id` - Delete listing (owner only)

### Reviews
- `GET /api/reviews` - Get reviews for a listing
- `POST /api/reviews` - Add review (authenticated)
- `DELETE /api/reviews/:id` - Delete review (owner only)

## Key Features Implementation

### Google Maps Integration
- Interactive map component showing all listings
- Location markers with property information
- Custom styled map markers
- Responsive map container

### Modern UI Components
- Navbar with authentication status
- Filter sidebar with price range and amenities
- Responsive grid layout
- Smooth animations and transitions
- Toast notifications for user feedback

### Authentication
- JWT-based authentication
- Password hashing with bcryptjs
- Protected routes
- Token stored in localStorage

### Image Upload
- Cloudinary integration for image hosting
- Drag-and-drop support
- Multiple image handling

## Environment Variables

### Backend (.env)
```
ATLASDB_URL=mongodb connection string
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
JWT_SECRET=secret_key
CLOUDINARY_NAME=your_name
CLOUDINARY_API_KEY=api_key
CLOUDINARY_API_SECRET=api_secret
GOOGLE_MAPS_API_KEY=maps_key
```

### Frontend (.env)
```
REACT_APP_GOOGLE_MAPS_API_KEY=maps_key
REACT_APP_BACKEND_URL=http://localhost:5000
```

## Running the Application

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

### Terminal 2 - Frontend
```bash
cd frontend
npm start
```

## Building for Production

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
```

## Future Enhancements

- Payment integration (Stripe/Razorpay)
- Advanced search filters
- Booking system with calendar
- User wishlist
- Host profile and ratings
- Messaging between users
- Admin dashboard
- Email notifications
- Two-factor authentication

## License

This project is licensed under the ISC License.

## Author

Mayuresh Sarkale

## Support

For issues and feature requests, please create an issue in the repository.
