# ⚡ Quick Render Deployment Checklist

## Before You Start
- [ ] Render account created (https://render.com)
- [ ] GitHub repository pushed (Stayzz)
- [ ] MongoDB Atlas account ready

---

## 📊 Step 1: MongoDB Atlas Setup (5-10 mins)

- [ ] Create MongoDB Atlas cluster
- [ ] Create database user
- [ ] Get connection string
- [ ] Add IP whitelist (0.0.0.0/0)
- [ ] Copy `MONGODB_URI`

---

## 🔧 Step 2: Deploy Backend (5-10 mins)

### Create Web Service
- [ ] Go to Render dashboard
- [ ] Click "New +" → "Web Service"
- [ ] Select Stayzz GitHub repo
- [ ] Click "Connect"

### Configure Service
- [ ] Name: `stayzz-backend`
- [ ] Environment: `Node`
- [ ] Branch: `main`
- [ ] Build Command: `cd backend && npm install`
- [ ] Start Command: `cd backend && npm start`

### Environment Variables
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_random_secret_key
NODE_ENV=production
PORT=5000
```

- [ ] Add all environment variables
- [ ] Click "Create Web Service"
- [ ] Wait for deployment (~2-5 mins)
- [ ] Copy backend URL: `https://stayzz-backend.onrender.com`

### Test Backend
- [ ] Open: `https://stayzz-backend.onrender.com/api/listings`
- [ ] Should see: `[]` or JSON response

---

## 🎨 Step 3: Deploy Frontend (5-10 mins)

### Create Static Site
- [ ] Go to Render dashboard
- [ ] Click "New +" → "Static Site"
- [ ] Select Stayzz GitHub repo
- [ ] Click "Connect"

### Configure Frontend
- [ ] Name: `stayzz-frontend`
- [ ] Branch: `main`
- [ ] Build Command: `cd frontend && npm install && npm run build`
- [ ] Publish Directory: `frontend/build`

### Environment Variables
```
REACT_APP_BACKEND_URL=https://stayzz-backend.onrender.com
REACT_APP_GOOGLE_MAPS_API_KEY=optional
```

- [ ] Add environment variables
- [ ] Click "Create Static Site"
- [ ] Wait for deployment (~3-5 mins)

---

## ✅ Verification

- [ ] Backend: `https://stayzz-backend.onrender.com` (returns data)
- [ ] Frontend: `https://stayzz-frontend.onrender.com` (page loads)
- [ ] Map page: `/map` works
- [ ] Sample listings visible
- [ ] No console errors

---

## 🎉 Done!

Your Stayzz app is now live on:
- **Frontend:** https://stayzz-frontend.onrender.com
- **Backend:** https://stayzz-backend.onrender.com

---

## 💡 Important Notes

1. **Free tier services spin down** after 15 mins of inactivity
   - First request after spin-down takes 30-50 seconds
   - Upgrade to paid to keep always running

2. **Auto-deploys on GitHub push**
   - Push to `main` branch = automatic deployment
   - No manual builds needed

3. **MongoDB is separate**
   - Using free MongoDB Atlas (not Render PostgreSQL)
   - Free tier: 512 MB storage

4. **Update frontend ENV variables**
   - Make sure `REACT_APP_BACKEND_URL` points to your backend
   - Don't hardcode localhost!

---

## 🔗 Useful Links

| Link | Purpose |
|------|---------|
| https://dashboard.render.com | Render Dashboard |
| https://cloud.mongodb.com | MongoDB Atlas |
| GitHub Repo | https://github.com/Mayuresh-1306/Stayzz |
| Frontend URL | https://stayzz-frontend.onrender.com |
| Backend URL | https://stayzz-backend.onrender.com |

---

**Total Time: ~30-40 minutes ⏱️**

Need help? Check the detailed guide: `RENDER_DEPLOYMENT_GUIDE.md`
