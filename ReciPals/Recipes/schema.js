import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
  recipe_id: { 
    type: String, 
    required: true, 
    unique: true 
  },
  post_id: { 
    type: String, 
    required: true 
  },
  user_created: { 
    type: String, 
    required: true 
  },
  name: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 50
  },
  description: { 
    type: String,
    maxlength: 150
  },
  ingredients_sec: [{
    _id: String,
    title: { 
      type: String, 
      required: true 
    },
    ingredients: [String]  
  }],
  steps: [String],
  total_time: String,
  serves: Number,
  tags: [String],
  photo: String
}, 
{ collection: "recipes" });

export default recipeSchema;