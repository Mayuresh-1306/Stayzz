import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import MapComponent from '../components/MapComponent';
import axios from 'axios';

// Sample data with coordinates for fallback
const SAMPLE_LISTINGS = [
  {
    _id: 'sample-1',
    title: 'Cozy Beachfront Cottage',
    description: 'Escape to this charming beachfront cottage for a relaxing getaway.',
    price: 1500,
    location: 'Malibu, California',
    country: 'United States',
    coordinates: {
      latitude: 34.0259,
      longitude: -118.6825
    },
    image: {
      url: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60'
    }
  },
  {
    _id: 'sample-2',
    title: 'Modern Loft in Downtown',
    description: 'Stay in the heart of the city in this stylish loft apartment.',
    price: 1200,
    location: 'Manhattan, New York',
    country: 'United States',
    coordinates: {
      latitude: 40.7128,
      longitude: -74.0060
    },
    image: {
      url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60'
    }
  },
  {
    _id: 'sample-3',
    title: 'Mountain Retreat',
    description: 'Unplug and unwind in this peaceful mountain cabin.',
    price: 1000,
    location: 'Aspen, Colorado',
    country: 'United States',
    coordinates: {
      latitude: 39.1911,
      longitude: -106.8175
    },
    image: {
      url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60'
    }
  },
  {
    _id: 'sample-4',
    title: 'Historic Villa in Tuscany',
    description: 'Experience the charm of Tuscany in this beautifully restored villa.',
    price: 2500,
    location: 'Florence, Tuscany',
    country: 'Italy',
    coordinates: {
      latitude: 43.7696,
      longitude: 11.2558
    },
    image: {
      url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60'
    }
  },
  {
    _id: 'sample-5',
    title: 'Secluded Treehouse Getaway',
    description: 'Live among the treetops in this unique treehouse retreat.',
    price: 800,
    location: 'Portland, Oregon',
    country: 'United States',
    coordinates: {
      latitude: 45.5152,
      longitude: -122.6784
    },
    image: {
      url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60'
    }
  },
  {
    _id: 'sample-6',
    title: 'Beachfront Paradise',
    description: 'Step out of your door onto the sandy beach.',
    price: 2000,
    location: 'Cancun, Mexico',
    country: 'Mexico',
    coordinates: {
      latitude: 21.1619,
      longitude: -86.8515
    },
    image: {
      url: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60'
    }
  }
];

function HomePage() {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [listings, setListings] = useState(SAMPLE_LISTINGS); // Use sample data by default
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5002';
      const response = await axios.get(`${backendUrl}/api/listings`);
      console.log('Fetched listings:', response.data); // Debug log
      if (response.data && response.data.length > 0) {
        setListings(response.data.slice(0, 6)); // Show only 6 featured listings
      } else {
        console.log('No listings from backend, using sample data');
        setListings(SAMPLE_LISTINGS);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching listings:', error);
      console.log('Using sample data as fallback');
      setListings(SAMPLE_LISTINGS);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/listings?location=${location}`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-red-500 to-red-600 text-white">
        <div className="absolute inset-0 opacity-40 bg-black"></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="text-5xl font-bold mb-4">Explore Amazing Places</h1>
          <p className="text-xl mb-8">Find your perfect stay around the world</p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="w-full max-w-2xl">
            <div className="flex bg-white rounded-full shadow-lg overflow-hidden">
              <input
                type="text"
                placeholder="Where do you want to go?"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="flex-1 px-6 py-4 text-gray-800 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-red-500 hover:bg-red-600 px-8 py-4 text-white font-semibold transition flex items-center space-x-2"
              >
                <FaSearch /> <span>Search</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Browse Locations</h2>
          <MapComponent listings={listings} />
        </div>
      </div>

      {/* Featured Listings */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">Featured Listings</h2>
        
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading listings...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.map((listing) => (
              <div
                key={listing._id}
                onClick={() => navigate(`/listings/${listing._id}`)}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition cursor-pointer transform hover:scale-105"
              >
                {/* Image */}
                {listing.image && (
                  <img
                    src={listing.image.url}
                    alt={listing.title}
                    className="w-full h-48 object-cover"
                  />
                )}

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-800">{listing.title}</h3>
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      ₹{listing.price}
                    </span>
                  </div>

                  <p className="text-gray-600 flex items-center space-x-1 mb-3">
                    <FaMapMarkerAlt className="text-red-500" />
                    <span>{listing.location}</span>
                  </p>

                  <p className="text-gray-700 line-clamp-2 mb-4">
                    {listing.description}
                  </p>

                  <button className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition font-semibold">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/listings')}
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-semibold transition"
          >
            View All Listings
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-4xl font-bold mb-2">1000+</h3>
              <p className="text-gray-400">Properties Available</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold mb-2">50+</h3>
              <p className="text-gray-400">Countries Covered</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold mb-2">5000+</h3>
              <p className="text-gray-400">Happy Customers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
