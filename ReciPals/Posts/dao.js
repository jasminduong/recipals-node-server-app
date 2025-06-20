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
 return  await model.findById(postId);
}

// adds a comment to a post
export function addComment(postId, commentData) {
  throw new Error("addComment not implemented yet - needs database integration");
  /*const post = db.posts.find((post) => post.post_id === postId);
  if (!post) {
    throw new Error("Post not found");
  }

  const newComment = {
    comment_id: uuidv4(),
    user_id: commentData.user_id,
    text: commentData.text,
    created_at: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
  };

  post.comments = [...(post.comments || []), newComment];
  return post;*/
}

// gets comments for a specific post
export function getComments(postId) {
  throw new Error("getComments not implemented yet - needs database integration");
  /*const post = db.posts.find((post) => post.post_id === postId);
  if (!post) {
    throw new Error("Post not found");
  }
  return post.comments || [];*/
}

// updates an post
export async function updatePost(postId, post) {
  return await model.updateOne({post_id: postId}, {$set: post})
}

// deletes an post
export async function deletePost(postId) {
  return await model.deleteOne({post_id: postId})
}
