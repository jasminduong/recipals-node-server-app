import express from "express";
import session from "express-session";
import cors from "cors";
import "dotenv/config";
import UserRoutes from "./ReciPals/Users/routes.js";
import PostRoutes from "./ReciPals/Posts/routes.js";
import RecipeRoutes from "./ReciPals/Recipes/routes.js";
import mongoose from "mongoose";

console.log("=== SERVER STARTING ===");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("PORT:", process.env.PORT);
console.log("SESSION_SECRET exists:", !!process.env.SESSION_SECRET);
console.log(
  "MONGO_CONNECTION_STRING exists:",
  !!process.env.MONGO_CONNECTION_STRING
);

const CONNECTION_STRING =
  process.env.MONGO_CONNECTION_STRING || "mongodb://127.0.0.1:27017/recipals";

mongoose
  .connect(CONNECTION_STRING)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const app = express();

const allowedOrigins = [
  "https://recipals.netlify.app",
  "http://localhost:5173",
];

console.log("Allowed origins:", allowedOrigins);

app.use(
  cors({
    credentials: true,
    origin: allowedOrigins,
  })
);

// Add a simple health check route
app.get("/health", (req, res) => {
  console.log("Health check requested");
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
  });
});

app.use((req, res, next) => {
  console.log("=== REQUEST RECEIVED ===");
  console.log("Time:", new Date().toISOString());
  console.log("Method:", req.method);
  console.log("Path:", req.path);
  console.log("Origin:", req.get("Origin"));
  console.log("User-Agent:", req.get("User-Agent"));
  next();
});

const sessionOptions = {
  secret: process.env.SESSION_SECRET || "recipals",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  },
};

if (process.env.NODE_ENV === "production") {
  console.log("Configuring for PRODUCTION");
  sessionOptions.proxy = true;
  sessionOptions.cookie.secure = true;
  sessionOptions.cookie.sameSite = "none";
} else {
  console.log("Configuring for DEVELOPMENT");
  sessionOptions.cookie.secure = false;
  sessionOptions.cookie.sameSite = "lax";
}

console.log("Session options:", JSON.stringify(sessionOptions, null, 2));

app.use(session(sessionOptions));
app.use(express.json());

app.use((req, res, next) => {
  console.log("Session ID:", req.sessionID);
  console.log("Session data:", req.session);
  next();
});

UserRoutes(app);
PostRoutes(app);
RecipeRoutes(app);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(
    `📍 Server URL: ${
      process.env.NODE_ENV === "production"
        ? "https://your-app.onrender.com"
        : `http://localhost:${PORT}`
    }`
  );
});
