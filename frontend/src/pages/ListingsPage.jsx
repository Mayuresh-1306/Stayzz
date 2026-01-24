import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaWifi, FaParking, FaSwimmingPool } from 'react-icons/fa';
import axios from 'axios';

function ListingsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const location = searchParams.get('location') || '';

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    filterListings();
  }, [listings, location, priceRange, selectedAmenities]);

  const fetchListings = async () => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5002';
      const response = await axios.get(`${backendUrl}/api/listings`);
      setListings(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching listings:', error);
      setLoading(false);
    }
  };

  const filterListings = () => {
    let filtered = listings;

    // Filter by location
    if (location) {
      filtered = filtered.filter((l) =>
        l.location.toLowerCase().includes(location.toLowerCase()) ||
        l.country.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Filter by price
    filtered = filtered.filter(
      (l) => l.price >= priceRange[0] && l.price <= priceRange[1]
    );

    setFilteredListings(filtered);
  };

  const toggleAmenity = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          {location ? `Listings in ${location}` : 'All Listings'}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-20">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Filters</h3>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3">Price Range</h4>
                <input
                  type="range"
                  min="0"
                  max="100000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full"
                />
                <p className="text-sm text-gray-600 mt-2">
                  ₹{priceRange[0]} - ₹{priceRange[1]}
                </p>
              </div>

              {/* Amenities */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Amenities</h4>
                <div className="space-y-3">
                  {[
                    { id: 'wifi', label: 'WiFi', icon: FaWifi },
                    { id: 'parking', label: 'Parking', icon: FaParking },
                    { id: 'pool', label: 'Swimming Pool', icon: FaSwimmingPool },
                  ].map(({ id, label, icon: Icon }) => (
                    <label key={id} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(id)}
                        onChange={() => toggleAmenity(id)}
                        className="w-4 h-4 text-red-500 rounded"
                      />
                      <Icon className="text-red-500" />
                      <span className="text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Listings Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-xl">Loading listings...</p>
              </div>
            ) : filteredListings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-xl">No listings found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredListings.map((listing) => (
                  <div
                    key={listing._id}
                    onClick={() => navigate(`/listings/${listing._id}`)}
                    className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition cursor-pointer transform hover:scale-105"
                  >
                    {/* Image */}
                    {listing.image && (
                      <div className="relative">
                        <img
                          src={listing.image.url || "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"}
                          alt={listing.title}
                          className="w-full h-64 object-cover"
                          onError={(e) => {
                            console.error("Image failed to load:", listing.image.url);
                            e.target.src = "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60";
                          }}
                        />
                        <span className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold">
                          ₹{listing.price}
                        </span>
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {listing.title}
                      </h3>

                      <p className="text-gray-600 flex items-center space-x-1 mb-3">
                        <FaMapMarkerAlt className="text-red-500" />
                        <span>{listing.location}</span>
                      </p>

                      <p className="text-gray-700 line-clamp-2 mb-4">
                        {listing.description}
                      </p>

                      {/* Amenities Preview */}
                      <div className="flex space-x-4 mb-4">
                        <FaWifi className="text-gray-400 text-lg" />
                        <FaParking className="text-gray-400 text-lg" />
                        <FaSwimmingPool className="text-gray-400 text-lg" />
                      </div>

                      <button className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition font-semibold">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListingsPage;
