if(process.env.NODE_ENV != "production") {
  require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors"); // ✅ ADDED: CORS package
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl); // ✅ ADDED: 'await' is better practice here
}

// Configuration
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.json()); // ✅ CRITICAL: Allows backend to read JSON from React
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// ✅ ADDED: CORS Configuration
// This enables your Frontend to talk to your Backend
const allowedOrigins = [
  "http://localhost:3000",                  // Local React
  "http://localhost:5173",                  // Local Vite (just in case)
  "https://stayzz-frontend.onrender.com",   // Your Frontend Render URL (Check this!)
  "https://stayzz-1olr.onrender.com"        // Your other Frontend URL seen in logs
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Session Store
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => { // ✅ FIXED: added 'err' argument
  console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// ✅ UPDATED ROUTES: Added '/api' prefix to match your React Frontend
app.use("/api/listings", listingRouter);
app.use("/api/listings/:id/reviews", reviewRouter);
app.use("/api/users", userRouter); 

// Legacy support (optional): If you still use EJS views for some things
app.use("/listings", listingRouter); 

app.get("/", (req, res) => {
  // Redirect to the API or send a welcome message
  res.send("Stayzz Backend is running!"); 
});

app.use((err, req, res, next) => {
  let {statusCode = 500, message = "Something went wrong!"} = err;
  // If request wants JSON (React), send JSON error
  if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.status(statusCode).json({ error: message });
  }
  res.status(statusCode).render("error.ejs", { message });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});