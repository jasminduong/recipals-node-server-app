import db from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

// Posts dao.js implements various CRUD operations for handling the users array in the Database

let { posts } = db;

// finds all posts
export const findAllPosts = () => posts;

// creates a post
export function createPost(post) {
  db.posts = [...db.posts, post];
  return post;
}

// finds a post by ID
export function findPostById(postId) {
  return db.posts.find((post) => post.post_id === postId);
}

// adds a comment to a post
export function addComment(postId, commentData) {
  const post = db.posts.find((post) => post.post_id === postId);
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
  return post;
}

// gets comments for a specific post
export function getComments(postId) {
  const post = db.posts.find((post) => post.post_id === postId);
  if (!post) {
    throw new Error("Post not found");
  }
  return post.comments || [];
}

// updates an post
export function updatePost(postId, postUpdates) {
  const { posts } = db;
  const post = posts.find((post) => post.post_id === postId);
  Object.assign(post, postUpdates);
  return post;
}

// deletes an post
export function deletePost(postId) {
  const { posts } = db;
  db.posts = posts.filter((post) => post.post_id !== postId);
}
