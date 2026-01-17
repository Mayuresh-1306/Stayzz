# Stayzz - Airbnb-like Property Rental Platform

## 🏨 Project Description

**Stayzz** is a modern, full-stack property rental platform built with React and Express. It features an interactive Airbnb-like map interface for discovering and booking unique accommodations worldwide. The platform provides a seamless experience for both property owners and travelers with responsive design for desktop and mobile devices.

### Key Highlights
- 🗺️ **Interactive Airbnb-Style Map** with real-time property location visualization
- 📱 **Fully Responsive Design** - optimized for mobile, tablet, and desktop
- 🔍 **Advanced Listing Discovery** with filtering and detailed property views
- 💬 **Review System** for transparent guest feedback
- 🔐 **Secure Authentication** with JWT-based login
- 🏠 **Property Management** - create, edit, and manage listings
- 📍 **Location Intelligence** with GPS coordinates and map integration

---

## ✨ Features

### For Travelers
- Browse properties on interactive map view
- View detailed listing information with high-quality images
- Read authentic guest reviews and ratings
- Search and filter properties by location
- Responsive mobile-friendly interface
- View property coordinates and exact locations

### For Property Owners
- Create and manage property listings
- Upload property images
- Set competitive pricing
- Edit listing details anytime
- Track customer reviews
- Monitor bookings and reservations

### Technical Features
- Smart fallback map visualization (works even without Google Maps API)
- Auto-generating sample data for demo purposes
- Real-time location mapping with coordinate normalization
- Responsive grid layouts for all screen sizes
- Error handling and graceful degradation

---

## 🛠️ Tech Stack

### Frontend
- **React 18.2.0** - UI library
- **React Router v6** - Navigation and routing
- **Tailwind CSS 3.3.6** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Icons** - Icon library
- **Google Maps JavaScript API** - Map integration

### Backend
- **Node.js 22.16.0** - JavaScript runtime
- **Express 5.1.0** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Cloudinary** - Image hosting

### Tools & Infrastructure
- **Git & GitHub** - Version control
- **NPM** - Package management
- **VS Code** - Development environment

---

## 📦 Project Structure

```
Stayzz/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── MapComponent.jsx
│   │   │   └── Footer.jsx
│   │   ├── pages/           # Page components
│   │   │   ├── HomePage.jsx
│   │   │   ├── ListingDetailPage.jsx
│   │   │   ├── AirbnbLikeMap.jsx      # ⭐ Main map feature
│   │   │   ├── ListingsPage.jsx
│   │   │   └── Users/
│   │   ├── App.jsx
│   │   └── index.js
│   └── package.json
│
├── backend/                 # Express server
│   ├── controllers/         # Request handlers
│   │   ├── listing.js
│   │   ├── review.js
│   │   └── user.js
│   ├── models/             # MongoDB schemas
│   │   ├── listing.js
│   │   ├── review.js
│   │   └── user.js
│   ├── routes/             # API endpoints
│   │   ├── listing.js
│   │   ├── review.js
│   │   └── user.js
│   ├── middleware/         # Custom middleware
│   ├── server.js
│   └── package.json
│
├── README.md               # Project documentation
├── SETUP_GUIDE.md         # Installation instructions
└── package.json
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Google Maps API Key (optional - fallback map works without it)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Mayuresh-1306/Stayzz.git
cd Stayzz
```

2. **Install dependencies**
```bash
# Install backend
cd backend
npm install

# Install frontend (in new terminal)
cd frontend
npm install
```

3. **Configure environment variables**
```bash
# backend/.env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# frontend/.env
REACT_APP_BACKEND_URL=http://localhost:5002
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

4. **Start the application**
```bash
# Terminal 1: Backend (port 5002)
cd backend
npm run dev

# Terminal 2: Frontend (port 3000)
cd frontend
npm start
```

5. **Access the application**
- Frontend: http://localhost:3000
- API: http://localhost:5002/api

---

## 📍 Airbnb-Like Map Feature

The interactive map view (`/map` route) provides:

- **Split-screen layout**: Map on left, property listings on right
- **Visual property markers**: Red pins showing exact property locations
- **Price badges**: Displays nightly rate at each marker
- **Property details**: Click any marker to see full property information
- **Responsive design**: Stacks vertically on mobile, horizontally on desktop
- **Fallback visualization**: Custom map rendering if Google Maps API unavailable
- **Interactive cards**: Click listings to highlight on map

### Map Features
- 6 pre-loaded sample properties with real coordinates
- Automatic coordinate normalization
- Click-to-view property details
- Hover effects and visual feedback
- Location labels and price information
- Works on mobile and desktop

---

## 📱 Responsive Design

### Mobile View (< 768px)
- Stacked single-column layout
- Touch-optimized spacing and buttons
- Readable font sizes
- Full-width cards and inputs
- Optimized map heights

### Desktop View (768px+)
- Multi-column grid layouts
- Sticky sidebar components
- Horizontal property cards
- Side-by-side map and listings
- Larger imagery and typography

### Tested Breakpoints
- Mobile: 320px - 767px
- Tablet: 768px - 1024px
- Desktop: 1025px+

---

## 🔐 Authentication

- **JWT-based authentication**
- **Secure password hashing** with bcrypt
- **Protected routes** for authenticated users
- **Session management** with localStorage

---

## 📚 API Endpoints

### Listings
- `GET /api/listings` - Get all listings
- `GET /api/listings/:id` - Get listing by ID
- `POST /api/listings` - Create new listing
- `PUT /api/listings/:id` - Update listing
- `DELETE /api/listings/:id` - Delete listing

### Reviews
- `GET /api/reviews?listingId=:id` - Get listing reviews
- `POST /api/reviews` - Create review
- `DELETE /api/reviews/:id` - Delete review

### Users
- `POST /api/users/register` - Register user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile

---

## 🎨 UI/UX Highlights

- **Modern Design**: Clean, professional interface inspired by Airbnb
- **Consistent Styling**: Tailwind CSS for unified look and feel
- **Interactive Elements**: Smooth hover effects and transitions
- **Visual Feedback**: Loading states, error messages, success notifications
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation

---

## 🐛 Known Features & Fallbacks

- ✅ **Smart API Key Handling**: App works with or without Google Maps API key
- ✅ **Fallback Visualization**: Beautiful custom map renders if API unavailable
- ✅ **Sample Data**: Pre-loaded properties ensure demo works immediately
- ✅ **Error Recovery**: Graceful error handling throughout the app
- ✅ **Mobile Optimization**: Every page tested on multiple screen sizes

---

## 📈 Future Enhancements

- [ ] Payment integration (Stripe/Razorpay)
- [ ] Real-time booking notifications
- [ ] Advanced search filters (price range, amenities)
- [ ] User dashboard and booking history
- [ ] Email verification and password reset
- [ ] Wishlist/favorites functionality
- [ ] Chat between hosts and guests
- [ ] Advanced analytics for property owners
- [ ] Multi-language support
- [ ] Dark mode

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

**Mayuresh** - [GitHub Profile](https://github.com/Mayuresh-1306)

---

## 📞 Support

For issues, feature requests, or questions, please open an issue on GitHub.

---

## 🙏 Acknowledgments

- Inspired by Airbnb's property discovery interface
- Built with React and Express best practices
- Community contributions and feedback

---

**Happy Listing! 🏠✨**
