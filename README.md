# Stayzz - Modern MERN Travel Marketplace

A full-stack MERN application for booking and listing properties with modern UI and Google Maps integration.

## Features

- 🏠 Property Listings with detailed information
- 🗺️ Google Maps Integration for location visualization
- 👤 User Authentication (Signup/Login with JWT)
- 📝 Create, Read, Update, Delete Listings
- ⭐ Reviews and Ratings System
- 💰 Dynamic Pricing
- 🎨 Modern, Responsive UI with Tailwind CSS
- 📱 Mobile-friendly Design
- ☁️ Cloud Image Upload (Cloudinary)

## Tech Stack

### Backend
- **Node.js & Express.js** - REST API server
- **MongoDB & Mongoose** - Database
- **JWT** - Authentication
- **Cloudinary** - Image hosting
- **Joi** - Data validation

### Frontend
- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Google Maps API** - Location mapping
- **React Toastify** - Notifications

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
