import express from "express";
import session from "express-session";
import cors from "cors";
import "dotenv/config";
import UserRoutes from "./ReciPals/Users/routes.js";
import PostRoutes from "./ReciPals/Posts/routes.js";
import RecipeRoutes from "./ReciPals/Recipes/routes.js";
import mongoose from "mongoose";

const CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING 
mongoose.connect(CONNECTION_STRING);

const app = express();

const allowedOrigins = [
  "https://recipals.netlify.app"
]

app.use(
  cors({
    credentials: true,
    origin: allowedOrigins,
  })
);

const sessionOptions = {
  secret:
    process.env.SESSION_SECRET || "recipals",
  resave: false,
  saveUninitialized: false,
};
if (process.env.NODE_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
  };
}

app.use(session(sessionOptions));
app.use(express.json());

UserRoutes(app);
PostRoutes(app);
RecipeRoutes(app);

app.listen(process.env.PORT || 4000);
