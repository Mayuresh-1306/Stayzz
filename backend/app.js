import dotenv from "dotenv";
if (process.env.NODE_ENV != "production") {
  dotenv.config();
}

import express from "express";
import mongoose from "mongoose";
import path from "path";
import cors from "cors";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import ExpressError from "./utils/ExpressError.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import flash from "connect-flash";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "./models/user.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import listingRouter from "./routes/listing.js";
import reviewRouter from "./routes/review.js";
import userRouter from "./routes/user.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.json());
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://stayzz-frontend.onrender.com",
  "https://stayzz-1olr.onrender.com"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
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

app.use("/api/listings", listingRouter);
app.use("/api/listings/:id/reviews", reviewRouter);
app.use("/api/users", userRouter);

app.use("/listings", listingRouter);

app.get("/", (req, res) => {
  res.send("Stayzz Backend is running!");
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  if (req.headers.accept && req.headers.accept.includes('application/json')) {
    return res.status(statusCode).json({ error: message });
  }
  res.status(statusCode).render("error.ejs", { message });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});