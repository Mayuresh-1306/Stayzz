import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaImage } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

function NewListingPage({ isLoggedIn }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    country: '',
    image: null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData();
    form.append('title', formData.title);
    form.append('description', formData.description);
    form.append('price', formData.price);
    form.append('location', formData.location);
    form.append('country', formData.country);
    if (formData.image) {
      form.append('image', formData.image);
    }

    try {
      await axios.post('http://localhost:5002/api/listings', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      toast.success('Listing created successfully!');
      navigate('/listings');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/listings')}
          className="flex items-center space-x-2 text-red-500 hover:text-red-600 mb-8 font-semibold"
        >
          <FaArrowLeft /> <span>Back to Listings</span>
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">List Your Property</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Property Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Beautiful villa with sea view"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your property..."
                rows="5"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 resize-none"
                required
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Price per Night (₹)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="5000"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500"
                required
              />
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Location (City)</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Mumbai"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="India"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500"
                  required
                />
              </div>
            </div>

            {/* Image */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Property Image</label>
              <div className="relative">
                <input
                  type="file"
                  name="image"
                  onChange={handleChange}
                  accept="image/*"
                  className="hidden"
                  id="image-input"
                />
                <label
                  htmlFor="image-input"
                  className="flex items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg p-8 cursor-pointer hover:border-red-500 transition"
                >
                  <div className="text-center">
                    <FaImage className="mx-auto text-4xl text-gray-400 mb-2" />
                    <p className="text-gray-600">Click to upload an image</p>
                  </div>
                </label>
              </div>
              {formData.image && (
                <p className="text-sm text-green-600 mt-2">✓ {formData.image.name}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition"
            >
              {loading ? 'Creating...' : 'List Property'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NewListingPage;
