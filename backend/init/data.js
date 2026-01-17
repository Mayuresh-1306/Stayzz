const { ObjectId } = require("mongodb");

const sampleListings = [
  {
    title: "Cozy Beachfront Cottage",
    description: "Escape to this charming beachfront cottage for a relaxing getaway. Enjoy stunning ocean views and easy access to the beach. Perfect for couples and small families seeking seaside tranquility.",
    image:{
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 1500,
    location: "Malibu, California",
    country: "United States",
    coordinates: {
      latitude: 34.0259,
      longitude: -118.6825
    },
    amenities: ["WiFi", "Kitchen", "Beach Access", "Parking"],
    owner: new ObjectId("68546aa46fee67206602954d"),
  },
  {
    title: "Modern Loft in Downtown",
    description: "Stay in the heart of the city in this stylish loft apartment. Experience the vibrant urban lifestyle with easy access to restaurants, shops, and attractions.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 1200,
    location: "Manhattan, New York",
    country: "United States",
    coordinates: {
      latitude: 40.7128,
      longitude: -74.0060
    },
    amenities: ["WiFi", "Air Conditioning", "Elevator Access", "Gym"],
    owner: new ObjectId("68546aa46fee67206602954d"),
  },
  {
    title: "Mountain Retreat",
    description: "Unplug and unwind in this peaceful mountain cabin surrounded by stunning alpine scenery. Perfect place to recharge away from the hustle and bustle.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG90ZWxzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    price: 1000,
    location: "Aspen, Colorado",
    country: "United States",
    coordinates: {
      latitude: 39.1911,
      longitude: -106.8175
    },
    amenities: ["Fireplace", "Hot Tub", "Mountain Views", "Ski Access"],
    owner: new ObjectId("68546aa46fee67206602954d")
  },
  {
    title: "Historic Villa in Tuscany",
    description: "Experience the charm of Tuscany in this beautifully restored villa surrounded by rolling hills and vineyards. Authentic Italian countryside living at its finest.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG90ZWxzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    price: 2500,
    location: "Florence, Tuscany",
    country: "Italy",
    coordinates: {
      latitude: 43.7696,
      longitude: 11.2558
    },
    amenities: ["Wine Cellar", "Garden", "Pool", "Kitchen"],
    owner: new ObjectId("68546aa46fee67206602954d")
  },
  {
    title: "Secluded Treehouse Getaway",
    description: "Live among the treetops in this unique treehouse retreat. A true nature lover's paradise offering privacy and natural beauty in abundance.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGhvdGVsc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 800,
    location: "Portland, Oregon",
    country: "United States",
    coordinates: {
      latitude: 45.5152,
      longitude: -122.6784
    },
    amenities: ["Nature Trails", "Bird Watching", "WiFi", "Outdoor Deck"],
    owner: new ObjectId("68546aa46fee67206602954d")
  },
  {
    title: "Beachfront Paradise",
    description: "Step out of your door onto the sandy beach. This beachfront condo offers the ultimate relaxation with water activities and ocean breezes.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGhvdGVsc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 2000,
    location: "Cancun, Quintana Roo",
    country: "Mexico",
    coordinates: {
      latitude: 21.1619,
      longitude: -87.0385
    },
    amenities: ["Beach Access", "Pool", "Water Sports", "Restaurant"],
    owner: new ObjectId("68546aa46fee67206602954d")
  },
  {
    title: "Rustic Cabin by the Lake",
    description: "Spend your days fishing and kayaking on the serene lake. This cozy cabin is perfect for outdoor enthusiasts seeking peaceful solitude.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG1vdW50YWlufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    price: 900,
    location: "Lake Tahoe, California",
    country: "United States",
    coordinates: {
      latitude: 39.0968,
      longitude: -120.0324
    },
    amenities: ["Fishing", "Kayaking", "Fireplace", "Private Dock"],
    owner: new ObjectId("68546aa46fee67206602954d")
  },
  {
    title: "Luxury Penthouse with City Views",
    description: "Experience ultimate luxury in this stunning penthouse with panoramic city skyline views. State-of-the-art amenities and world-class service.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHBlbnRob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 3500,
    location: "Los Angeles, California",
    country: "United States",
    coordinates: {
      latitude: 34.0522,
      longitude: -118.2437
    },
    amenities: ["Concierge", "Infinity Pool", "Private Elevator", "Spa"],
    owner: new ObjectId("68546aa46fee67206602954d")
  },
  {
    title: "Charming Country Inn",
    description: "Nestled in the heart of picturesque countryside, this charming inn offers warm hospitality and homemade breakfast. Perfect for rural getaways.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1520583181563-430f63602d4f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y291bnRyeSUyMGlubnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 850,
    location: "Cotswolds, England",
    country: "United Kingdom",
    coordinates: {
      latitude: 51.8330,
      longitude: -1.8433
    },
    amenities: ["Breakfast Included", "Library", "Fireplace", "Garden"],
    owner: new ObjectId("68546aa46fee67206602954d")
  },
  {
    title: "Alpine Chalet in the Swiss Alps",
    description: "Luxurious alpine chalet with breathtaking mountain views. Perfect base for skiing, hiking, and experiencing Alpine hospitality at its finest.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1551528033-ace40a67fb1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2hhbGV0fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    price: 3000,
    location: "Verbier, Switzerland",
    country: "Switzerland",
    coordinates: {
      latitude: 46.1142,
      longitude: 7.2261
    },
    amenities: ["Ski Equipment", "Hot Tub", "Sauna", "Mountain Views"],
    owner: new ObjectId("68546aa46fee67206602954d")
  },
  {
    title: "Safari Lodge in the Serengeti",
    description: "Experience the wild in this exclusive safari lodge with front-row seats to the African savanna. Guided game drives and authentic wildlife encounters daily.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1516426122078-823097d0eeb4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Ynx8c2FmYXJpfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    price: 4000,
    location: "Serengeti, Tanzania",
    country: "Tanzania",
    coordinates: {
      latitude: -2.3333,
      longitude: 34.5833
    },
    amenities: ["Game Drives", "Wildlife Viewing", "All Meals Included", "Expert Guides"],
    owner: new ObjectId("68546aa46fee67206602954d")
  },
  {
    title: "Canal House in Amsterdam",
    description: "Charming canal house in the heart of Amsterdam with authentic Dutch architecture. Walking distance to museums, shops, and vibrant nightlife.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGFtc3RlcmRhbXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 1800,
    location: "Amsterdam, Netherlands",
    country: "Netherlands",
    coordinates: {
      latitude: 52.3676,
      longitude: 4.9041
    },
    amenities: ["Bike Included", "Boat Dock", "Canal View", "Kitchen"],
    owner: new ObjectId("68546aa46fee67206602954d")
  },
  {
    title: "Overwater Bungalow in Bora Bora",
    description: "Stay in luxury overwater bungalows surrounded by turquoise lagoons and pristine coral reefs. Paradise island living with world-class diving.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Ym9yYSUyMGJvcmF8ZW58MHx8MHx8fDA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 5000,
    location: "Bora Bora, French Polynesia",
    country: "France",
    coordinates: {
      latitude: -16.5004,
      longitude: -151.7415
    },
    amenities: ["Water Sports", "Diving Access", "Private Deck", "Beach Snorkeling"],
    owner: new ObjectId("68546aa46fee67206602954d")
  },
  {
    title: "Tropical Island Resort in the Maldives",
    description: "All-inclusive tropical resort with pristine white sand beaches, crystal clear waters, and world-renowned diving and snorkeling opportunities.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dHJvcGljYWwlMjBpc2xhbmR8ZW58MHx8MHx8fDA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 1600,
    location: "Malé, Maldives",
    country: "Maldives",
    coordinates: {
      latitude: 4.1694,
      longitude: 73.5093
    },
    amenities: ["All-Inclusive", "Diving", "Snorkeling", "Water Villa"],
    owner: new ObjectId("68546aa46fee67206602954d")
  },
  {
    title: "Parisian Apartment Near the Eiffel Tower",
    description: "Charming Parisian apartment with views of the iconic Eiffel Tower. Experience authentic Paris living with easy access to cafes, museums, and attractions.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGFyaXN8ZW58MHx8MHx8fDA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 1900,
    location: "Paris, France",
    country: "France",
    coordinates: {
      latitude: 48.8566,
      longitude: 2.3522
    },
    amenities: ["Eiffel Tower View", "Balcony", "Wine Bar", "WiFi"],
    owner: new ObjectId("68546aa46fee67206602954d")
  },
  {
    title: "Ryokan Traditional Japanese Inn",
    description: "Experience authentic Japanese hospitality in this traditional ryokan with hot spring baths and kaiseki dining. Immerse yourself in Japanese culture.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1540959375944-7049f642e9a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHJ5b2thbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 1100,
    location: "Tokyo, Japan",
    country: "Japan",
    coordinates: {
      latitude: 35.6762,
      longitude: 139.7674
    },
    amenities: ["Hot Spring", "Kaiseki Dinner", "Tatami Rooms", "Tea Ceremony"],
    owner: new ObjectId("68546aa46fee67206602954d")
  },
  {
    title: "Luxury Desert Resort in Dubai",
    description: "Ultra-luxury resort surrounded by golden dunes with world-class amenities. Experience Arabian hospitality, camel rides, and desert adventures.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1512453979798-5ff266fce4da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZHViYWl8ZW58MHx8MHx8fDA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 2800,
    location: "Dubai, United Arab Emirates",
    country: "United Arab Emirates",
    coordinates: {
      latitude: 25.2048,
      longitude: 55.2708
    },
    amenities: ["Desert Safaris", "Infinity Pool", "Spa", "Private Beach"],
    owner: new ObjectId("68546aa46fee67206602954d")
  },
  {
    title: "Gothic Quarter Apartment in Barcelona",
    description: "Historic apartment in Barcelona's Gothic Quarter amid medieval architecture. Perfect location for exploring La Sagrada Familia and vibrant culture.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1583422409516-2895a77efded?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmFyY2Vsb25hfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    price: 1300,
    location: "Barcelona, Spain",
    country: "Spain",
    coordinates: {
      latitude: 41.3874,
      longitude: 2.1686
    },
    amenities: ["Historic Area", "Cathedral Views", "Tapas Nearby", "WiFi"],
    owner: new ObjectId("68546aa46fee67206602954d")
  },
  {
    title: "Historic Inn in Boston",
    description: "Cozy historic inn in Boston's charming neighborhood with brick facades and cobblestone streets. Walking distance to Freedom Trail attractions.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1578500494198-246f612d03b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Ym9zdG9ufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
    price: 1050,
    location: "Boston, Massachusetts",
    country: "United States",
    coordinates: {
      latitude: 42.3601,
      longitude: -71.0589
    },
    amenities: ["Historic Building", "Fireplace", "Breakfast Included", "WiFi"],
    owner: new ObjectId("68546aa46fee67206602954d")
  },
  {
    title: "Balinese Luxury Villa",
    description: "Private luxury villa in Bali with infinity pool overlooking rice terraces. Experience Balinese hospitality with spa services and yoga classes.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1537215736033-f609908b626d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmFsaXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 1400,
    location: "Ubud, Bali",
    country: "Indonesia",
    coordinates: {
      latitude: -8.5069,
      longitude: 115.2625
    },
    amenities: ["Infinity Pool", "Yoga Classes", "Spa", "Chef Service"],
    owner: new ObjectId("68546aa46fee67206602954d")
  },
  {
    title: "Rocky Mountain Lodge",
    description: "Remote mountain lodge in the Canadian Rockies with stunning glacier views. Perfect for hiking, wildlife watching, and outdoor adventures.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Bnx8Y2FuYWRhJTIwbW91bnRhaW58ZW58MHx8MHx8fDA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 1300,
    location: "Banff, Alberta",
    country: "Canada",
    coordinates: {
      latitude: 51.1788,
      longitude: -115.5724
    },
    amenities: ["Mountain Views", "Hiking Trails", "Wildlife Watching", "Fireplace"],
    owner: new ObjectId("68546aa46fee67206602954d")
  },
  {
    title: "Art Deco Apartment in Miami Beach",
    description: "Trendy Art Deco apartment in Miami Beach with colorful facade and beach access. Experience South Beach nightlife and vibrant culture.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bWlhbWl8ZW58MHx8MHx8fDA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    price: 1600,
    location: "Miami Beach, Florida",
    country: "United States",
    coordinates: {
      latitude: 25.7907,
      longitude: -80.1300
    },
    amenities: ["Beach Access", "Nightlife", "Art Deco Design", "Pool"],
    owner: new ObjectId("68546aa46fee67206602954d")
  },
];

module.exports = { data: sampleListings };