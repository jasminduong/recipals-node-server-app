import mongoose from "mongoose";

// describes the structure for the users collection
const userSchema = new mongoose.Schema(
  {
    _id: String,
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    bio: String,
    tags: [String],
    profile: String,
    posts: [String],
    saved_recipes: [String],
    followers: [String],
    following: [String],
  },
  { collection: "users" }
);
export default userSchema;