import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  post_id: { 
    type: String, 
    required: true, 
    unique: true 
  },
  recipe_id: { 
    type: String, 
    required: true 
  },
  created_by: { 
    type: String, 
    required: true 
  },
  title: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 50
  },
  caption: { 
    type: String,
    maxlength: 150
  },
  photo: String,
  likes: [String],
  comments: [{
    comment_id: {type: String, required: true},
    user_id: {type: String, required: true},
    text: {type: String, required: true},
    created_at: String
  }]
}, 
{ collection: "posts" });

export default postSchema;