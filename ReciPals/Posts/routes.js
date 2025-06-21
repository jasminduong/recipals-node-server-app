import * as postsDao from "./dao.js";
import mongoose from "mongoose";

export default function PostRoutes(app) {
  // creates a new recipe post
  app.post("/api/posts", async (req, res) => {
    const post = req.body;
    const newPost = await postsDao.createPost(post);
    res.json(newPost);
  });

  // finds all posts of the user
  const findAllPosts = async (req, res) => {
    const posts = await postsDao.findAllPosts();
    res.json(posts);
  };
  app.get("/api/posts", findAllPosts);

  // gets a single post by ID
  app.get("/api/posts/:postId", async (req, res) => {
    const { postId } = req.params;
    const post = await postsDao.findPostById(postId);
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  });

  // adds a comment to a post - using updatePost
  app.post("/api/posts/:postId/comments", async (req, res) => {
    try {
      const { postId } = req.params;
      const commentData = req.body;
      
      // Get the current post
      const currentPost = await postsDao.findPostById(postId);
      if (!currentPost) {
        return res.status(404).json({ message: "Post not found" });
      }

      // Create new comment
      const newComment = {
        comment_id: new mongoose.Types.ObjectId().toString(),
        user_id: commentData.user_id,
        text: commentData.text,
        created_at: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      };

      // Add comment to existing comments array
      const updatedComments = [...(currentPost.comments || []), newComment];
      
      // Use updatePost to save the updated comments
      const updatedPost = await postsDao.updatePost(postId, { 
        comments: updatedComments 
      });

      res.json(updatedPost);
    } catch (error) {
      console.error("Error adding comment:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // gets comments for a specific post - using findPostById
  app.get("/api/posts/:postId/comments", async (req, res) => {
    try {
      const { postId } = req.params;
      
      // Use findPostById to get the post
      const post = await postsDao.findPostById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      // Return the comments array
      res.json(post.comments || []);
    } catch (error) {
      console.error("Error getting comments:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // updates a post
  app.put("/api/posts/:postId", async (req, res) => {
    try {
      const { postId } = req.params;
      const postUpdates = req.body;

      if (!postId || postId === "undefined") {
        return res.status(400).json({ message: "Post ID is required" });
      }

      const updatedPost = await postsDao.updatePost(postId, postUpdates);
      res.json(updatedPost);
    } catch (error) {
      console.error("Error updating post:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // deletes a post
  app.delete("/api/posts/:postId", async (req, res) => {
    const { postId } = req.params;
    await postsDao.deletePost(postId);
    res.json();
  });
}
