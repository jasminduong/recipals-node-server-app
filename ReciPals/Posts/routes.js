import * as postsDao from "./dao.js";

export default function PostRoutes(app) {
  // creates a new recipe post
  app.post("/api/posts", async (req, res) => {
    const post = req.body;
    const newPost = await postsDao.createPost(post);
    res.json(newPost);
  });

  // finds all posts of the user
  const findAllPosts = (req, res) => {
    const posts = postsDao.findAllPosts();
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

  // updates a post
  app.put("/api/posts/:postId", async (req, res) => {
    try {
      console.log("=== POSTS ROUTE UPDATE ===");
      console.log("URL params:", req.params);
      console.log("Post ID from URL:", req.params.postId);
      console.log("Request body:", req.body);

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
