# 🚀 Stayzz Deployment Guide - Render

## 📋 Prerequisites

Before deploying, you need:
1. ✅ Render account (free at https://render.com)
2. ✅ GitHub repository (already done - Stayzz)
3. ✅ MongoDB Atlas account (free tier at https://www.mongodb.com/cloud/atlas)
4. ✅ Cloudinary account (optional, for image upload)
5. ✅ Google Maps API key (optional, fallback works without it)

---

## 🎯 Deployment Strategy

**Deploy in this order:**
1. **MongoDB Atlas** - Database
2. **Backend** - Express API (Render Web Service)
3. **Frontend** - React app (Render Static Site or Web Service)

---

## 📊 Step 1: Set Up MongoDB Atlas

### 1.1 Create MongoDB Atlas Account
- Go to https://www.mongodb.com/cloud/atlas
- Sign up with email or GitHub
- Create a free cluster (M0)

### 1.2 Create a Database
1. Click "Create Deployment"
2. Select "Free" tier
3. Choose region closest to you
4. Wait for cluster to be created (takes ~5 mins)

### 1.3 Get Connection String
1. Click "Connect" button
2. Select "Drivers" → "Node.js"
3. Copy the connection string
4. Replace `<password>` with your database password
5. Replace `<dbname>` with `stayzz`

**Example format:**
```
mongodb+srv://username:password@cluster.mongodb.net/stayzz
```

### 1.4 Create Database User
1. Go to "Database Access"
2. Click "Add New Database User"
3. Username: `stayzz_user`
4. Password: (auto-generate or create strong one)
5. Add user

### 1.5 Add IP Whitelist
1. Go to "Network Access"
2. Click "Add IP Address"
3. Select "Allow access from anywhere" (0.0.0.0/0)
4. Confirm

---

## 🔧 Step 2: Deploy Backend on Render

### 2.1 Create Web Service
1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub (authorize if needed)
4. Select **"Stayzz"** repository
5. Click "Connect"

### 2.2 Configure Service
Fill in these details:

| Field | Value |
|-------|-------|
| **Name** | `stayzz-backend` |
| **Environment** | `Node` |
| **Region** | Choose closest region |
| **Branch** | `main` |
| **Build Command** | `cd backend && npm install` |
| **Start Command** | `cd backend && npm start` |

### 2.3 Add Environment Variables
1. Scroll down to "Environment"
2. Click "Add Environment Variable"
3. Add these variables:

```
MONGODB_URI = mongodb+srv://stayzz_user:PASSWORD@cluster.mongodb.net/stayzz
JWT_SECRET = your_secret_key_here_min_32_chars
CLOUDINARY_CLOUD_NAME = your_cloudinary_name (optional)
CLOUDINARY_API_KEY = your_cloudinary_key (optional)
CLOUDINARY_API_SECRET = your_cloudinary_secret (optional)
NODE_ENV = production
PORT = 5000
```

**Get these from:**
- **MONGODB_URI**: MongoDB Atlas connection string
- **JWT_SECRET**: Create random string (use online generator)
- **Cloudinary**: https://cloudinary.com (optional)

### 2.4 Deploy
1. Click **"Create Web Service"**
2. Wait for deployment (takes 2-5 minutes)
3. You'll see a live URL like: `https://stayzz-backend.onrender.com`
4. Copy this URL - you'll need it for frontend

### 2.5 Test Backend
Go to: `https://stayzz-backend.onrender.com/api/listings`
Should see: `[]` (empty array) or your listings in JSON

---

## 🎨 Step 3: Deploy Frontend on Render

### 3.1 Create Static Site (Recommended)
1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Static Site"**
3. Connect your GitHub
4. Select **"Stayzz"** repository
5. Click "Connect"

### 3.2 Configure Frontend
Fill in these details:

| Field | Value |
|-------|-------|
| **Name** | `stayzz-frontend` |
| **Environment** | Leave default |
| **Branch** | `main` |
| **Build Command** | `cd frontend && npm install && npm run build` |
| **Publish Directory** | `frontend/build` |

### 3.3 Add Environment Variables
1. Scroll to "Environment"
2. Click "Add Environment Variable"

```
REACT_APP_BACKEND_URL = https://stayzz-backend.onrender.com
REACT_APP_GOOGLE_MAPS_API_KEY = your_google_maps_key (optional)
```

**Important:** Update `REACT_APP_BACKEND_URL` with the backend URL from Step 2.4

### 3.4 Deploy
1. Click **"Create Static Site"**
2. Wait for deployment (takes 3-5 minutes)
3. You'll see a URL like: `https://stayzz-frontend.onrender.com`

### 3.5 Test Frontend
Go to: `https://stayzz-frontend.onrender.com`
You should see the Stayzz homepage!

---

## ✅ Verification Checklist

- [ ] Backend URL working: `https://stayzz-backend.onrender.com/api/listings`
- [ ] Frontend URL working: `https://stayzz-frontend.onrender.com`
- [ ] Map page loads: `https://stayzz-frontend.onrender.com/map`
- [ ] Can view sample properties
- [ ] No console errors in browser DevTools

---

## 🔗 Important URLs After Deployment

| Service | URL |
|---------|-----|
| **Frontend** | https://stayzz-frontend.onrender.com |
| **Backend API** | https://stayzz-backend.onrender.com |
| **MongoDB Atlas** | https://cloud.mongodb.com/v2 |
| **Render Dashboard** | https://dashboard.render.com |

---

## 🛠️ Backend File Structure (Important)

Your `backend/server.js` should have:

```javascript
const express = require('express');
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/listings', listingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

**Important:** Use `process.env.PORT` instead of hardcoded port!

---

## 🎨 Frontend File Structure (Important)

Update `frontend/src/services/` or API calls to use:

```javascript
const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5002';

axios.get(`${backendUrl}/api/listings`)
```

Check `AirbnbLikeMap.jsx` and other pages to ensure they use:
```javascript
const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5002';
```

---

## 🔐 Environment Variables Summary

### Backend (.env or Render)
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/stayzz
JWT_SECRET=your_random_secret_key_min_32_chars
NODE_ENV=production
PORT=5000
CLOUDINARY_CLOUD_NAME=optional
CLOUDINARY_API_KEY=optional
CLOUDINARY_API_SECRET=optional
```

### Frontend (.env or Render)
```
REACT_APP_BACKEND_URL=https://stayzz-backend.onrender.com
REACT_APP_GOOGLE_MAPS_API_KEY=optional
```

---

## 🐛 Troubleshooting

### Frontend shows blank page or 404
- [ ] Check browser console for errors
- [ ] Verify `REACT_APP_BACKEND_URL` is correct
- [ ] Check Render build logs for build errors

### Backend API not responding
- [ ] Check backend logs in Render dashboard
- [ ] Verify `MONGODB_URI` is correct
- [ ] Check MongoDB Atlas whitelist includes Render IP (0.0.0.0/0)
- [ ] Verify environment variables are set

### "Cannot find module" errors
- [ ] Check `package.json` has all dependencies
- [ ] Make sure build command is: `cd backend && npm install && npm start`
- [ ] Clear Render cache and redeploy

### CORS errors
- [ ] Update backend `CORS` to allow Render frontend URL
- [ ] In backend, add: `app.use(cors({ origin: process.env.FRONTEND_URL }))`

### Database connection timeout
- [ ] Check MongoDB Atlas Network Access whitelist
- [ ] Verify connection string is correct
- [ ] Test with MongoDB Compass locally first

---

## 📈 After Deployment

### Monitor Your App
1. Go to Render dashboard
2. Click on your service
3. View logs in "Logs" tab

### Custom Domain (Optional)
1. Go to service settings
2. Click "Custom Domains"
3. Add your domain (requires DNS setup)

### Auto-Deploy from GitHub (Already set up)
- Any push to `main` branch auto-deploys
- You can see deployment history in Render

### Environment Variables Update
1. Go to service settings
2. Click "Environment"
3. Edit and save
4. Service auto-redeploys

---

## 💰 Pricing

**Render Free Tier:**
- ✅ 1 web service (backend) - spins down after 15 mins of inactivity
- ✅ 1 static site (frontend) - always free
- ✅ 1 PostgreSQL database - but use MongoDB Atlas (free tier)

**MongoDB Atlas Free:**
- ✅ M0 cluster (512 MB storage)
- ✅ Unlimited databases
- ✅ Perfect for development

**Total Cost:** $0 (completely free!)

---

## 🚀 Quick Deployment Recap

1. **MongoDB Atlas Setup** - 5-10 minutes
2. **Backend Deployment** - 5-10 minutes
3. **Frontend Deployment** - 5-10 minutes
4. **Testing** - 5 minutes

**Total Time: ~30-40 minutes**

---

## 📞 Need Help?

- Render Docs: https://render.com/docs
- MongoDB Docs: https://docs.mongodb.com
- React Docs: https://react.dev
- Express Docs: https://expressjs.com

---

**Your Stayzz app will be live soon! 🎉**
