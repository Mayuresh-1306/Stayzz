import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaUser, FaStar, FaArrowLeft, FaEdit, FaTrash } from 'react-icons/fa';
import MapComponent from '../components/MapComponent';
import axios from 'axios';

function ListingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(5);

  useEffect(() => {
    fetchListing();
    fetchReviews();
  }, [id]);

  const fetchListing = async () => {
    try {
      const response = await axios.get(`http://localhost:5002/api/listings/${id}`);
      setListing(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching listing:', error);
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`http://localhost:5002/api/reviews?listingId=${id}`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleDeleteListing = async () => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        await axios.delete(`http://localhost:5002/api/listings/${id}`);
        navigate('/listings');
      } catch (error) {
        console.error('Error deleting listing:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Listing not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate('/listings')}
          className="flex items-center space-x-2 text-red-500 hover:text-red-600 mb-6 font-semibold transition text-sm sm:text-base"
        >
          <FaArrowLeft /> <span>Back to Listings</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image */}
            {listing.image && (
              <img
                src={listing.image.url}
                alt={listing.title}
                className="w-full h-64 sm:h-96 object-cover rounded-lg shadow-lg mb-6 sm:mb-8"
              />
            )}

            {/* Title and Price */}
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8 mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-4">
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-4xl font-bold text-gray-800">{listing.title}</h1>
                  <p className="text-gray-600 flex items-center space-x-2 mt-2 text-sm sm:text-base">
                    <FaMapMarkerAlt className="text-red-500 flex-shrink-0" />
                    <span>{listing.location}, {listing.country}</span>
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-3xl sm:text-4xl font-bold text-red-500">₹{listing.price}</p>
                  <p className="text-gray-600 text-sm sm:text-base">per night</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-6">
                {listing.description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={() => navigate(`/listings/${id}/edit`)}
                  className="flex items-center justify-center sm:justify-start space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition font-semibold text-sm sm:text-base"
                >
                  <FaEdit /> <span>Edit</span>
                </button>
                <button
                  onClick={handleDeleteListing}
                  className="flex items-center justify-center sm:justify-start space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition font-semibold text-sm sm:text-base"
                >
                  <FaTrash /> <span>Delete</span>
                </button>
              </div>
            </div>

            {/* Location Section */}
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8 mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                <FaMapMarkerAlt className="text-red-500" />
                <span>Location</span>
              </h2>

              {/* Location Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 sm:p-6">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-600 mb-2">Address</h3>
                  <p className="text-lg sm:text-xl font-bold text-gray-800">{listing.location}</p>
                  <p className="text-gray-600 text-sm sm:text-base">{listing.country}</p>
                </div>
                {listing.coordinates && (
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 sm:p-6">
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-600 mb-2">Coordinates</h3>
                    <p className="text-base sm:text-lg font-mono text-gray-800">{listing.coordinates.latitude.toFixed(4)}°</p>
                    <p className="text-base sm:text-lg font-mono text-gray-800">{listing.coordinates.longitude.toFixed(4)}°</p>
                  </div>
                )}
              </div>

              {/* Map */}
              <div className="bg-gray-100 rounded-lg overflow-hidden shadow-md" style={{ height: '350px' }}>
                <MapComponent listings={[listing]} />
              </div>

              {/* Location Description */}
              <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  This property is located in {listing.location}, {listing.country}. The exact coordinates are marked on the map above. 
                  You can zoom in to see nearby amenities and attractions.
                </p>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">Reviews</h2>

              {/* Add Review Form */}
              <div className="mb-6 sm:mb-8 pb-6 sm:pb-8 border-b">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Leave a Review</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">Rating</label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500 text-sm sm:text-base"
                    >
                      {[1, 2, 3, 4, 5].map((r) => (
                        <option key={r} value={r}>
                          {r} Star{r > 1 ? 's' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  <textarea
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                    placeholder="Share your experience..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500 h-24 resize-none text-sm sm:text-base"
                  />
                  <button className="bg-red-500 hover:bg-red-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition font-semibold text-sm sm:text-base w-full sm:w-auto">
                    Submit Review
                  </button>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-4 sm:space-y-6">
                {reviews.length === 0 ? (
                  <p className="text-gray-600 text-sm sm:text-base">No reviews yet. Be the first to review!</p>
                ) : (
                  reviews.map((review) => (
                    <div key={review._id} className="border-b pb-4 sm:pb-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                        <p className="font-semibold text-gray-800 flex items-center space-x-1 text-sm sm:text-base">
                          <FaUser className="text-gray-600" />
                          <span>{review.author}</span>
                        </p>
                        <div className="flex text-yellow-400">
                          {[...Array(review.rating)].map((_, i) => (
                            <FaStar key={i} className="text-sm sm:text-base" />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm sm:text-base">{review.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Booking Card */}
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8 lg:sticky lg:top-20">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-6">Reserve</h3>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">Check-in</label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500 text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">Check-out</label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500 text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">Guests</label>
                  <input
                    type="number"
                    defaultValue="1"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500 text-sm sm:text-base"
                  />
                </div>
              </div>

              <button className="w-full bg-red-500 hover:bg-red-600 text-white py-2 sm:py-3 rounded-lg transition font-bold text-base sm:text-lg">
                Reserve
              </button>

              <p className="text-gray-600 text-xs sm:text-sm text-center mt-4">
                You won't be charged yet
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListingDetailPage;
