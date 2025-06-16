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
