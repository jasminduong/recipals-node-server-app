import express from "express";
import session from "express-session";
import cors from "cors";
import "dotenv/config";
import UserRoutes from "./ReciPals/Users/routes.js";
import PostRoutes from "./ReciPals/Posts/routes.js";
import RecipeRoutes from "./ReciPals/Recipes/routes.js";

const app = express();

app.use(
  cors({
    credentials: true,
    origin: process.env.NETLIFY_URL || "http://localhost:5173",
  })
);
const sessionOptions = {
  secret: process.env.SESSION_SECRET || "recipals",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: "lax",
  },
};

if (process.env.NODE_ENV === "production") {
  sessionOptions.proxy = true;
  sessionOptions.cookie.secure = true;
  sessionOptions.cookie.sameSite = "none";
}
app.use(session(sessionOptions));
app.use(express.json());

UserRoutes(app);
PostRoutes(app);
RecipeRoutes(app);
PostRoutes(app);

app.listen(process.env.PORT || 4000);
