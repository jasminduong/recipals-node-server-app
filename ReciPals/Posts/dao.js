import model from "./model.js"; 
import db from "../Database/index.js";

// Posts dao.js implements various CRUD operations for handling the users array in the Database

let { posts } = db;

// finds all posts
export const findAllPosts = async () => await model.find();

// creates a post
export async function createPost(post) {
  return await model.create(post);
}

// finds a post by ID
export async function findPostById(postId) {
 return  await model.findOne({post_id: postId});
}

// updates an post
export async function updatePost(postId, post) {
  return await model.findOneAndUpdate({post_id: postId}, {$set: post}, { new: true })
}

// deletes an post
export async function deletePost(postId) {
  return await model.deleteOne({post_id: postId})
}
