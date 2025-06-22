import * as dao from "./dao.js";

// UserRoutes expose the database operations of users through a RESTful API
export default function UserRoutes(app) {
  // creates a new user
  const createUser = async (req, res) => {
    const user = await dao.createUser(req.body);
    res.json(user);
  };
  app.post("/api/users", createUser);

  // deletes a user
  const deleteUser = async (req, res) => {
    const status = await dao.deleteUser(req.params.userId);
    res.json(status);
  };
  app.delete("/api/users/:userId", deleteUser);

  // signup operation creates a new user
  const signup = async (req, res) => {
    const user = await dao.findUserByUsername(req.body.username);
    if (user) {
      res.status(400).json({ message: "Username already taken :(" });
      return;
    }
    const currentUser = await dao.createUser(req.body);
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };
  app.post("/api/users/signup", signup);

  // signin operation logs in the user if credentials match
  const signin = async (req, res) => {
    const { username, password } = req.body;
    const currentUser = await dao.findUserByCredentials(username, password);

    if (currentUser) {
      req.session["currentUser"] = currentUser;
      res.json(currentUser);
    } else {
      res.status(401).json({ message: "Unable to login. Try again later." });
    }
  };
  app.post("/api/users/signin", signin);

  // profile operation
  const profile = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    res.json(currentUser);
  };
  app.get("/api/users/profile", profile);

  // updates current user's profile
  const updateUser = async (req, res) => {
    const userId = req.params.userId;
    const userUpdates = req.body;
    dao.updateUser(userId, userUpdates);
    const currentUser = await dao.findUserById(userId);
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };
  app.put("/api/users/:userId", updateUser);

  // sign out resets the currentUser to null in the server
  const signout = async (req, res) => {
    if (!req.session) {
      return res.sendStatus(200);
    }
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).send("Error signing out");
      }
      res.clearCookie("connect.sid");
      res.sendStatus(200);
    });
  };
  app.post("/api/users/signout", signout);

  // finds all users
  const findAllUsers = async (req, res) => {
    const { name } = req.query;
    if (name) {
      const users = await dao.findUsersByPartialName(name);
      res.json(users);
      return;
    }
    const users = await dao.findAllUsers();
    res.json(users);
  };
  app.get("/api/users", findAllUsers);

  const findUserById = async (req, res) => {
    const user = await dao.findUserById(req.params.userId);
    res.json(user);
  };
  app.get("/api/users/:userId", findUserById);

  // saves a recipe for a user - using updateUser
  const saveRecipe = async (req, res) => {
    try {
      const { userId } = req.params;
      const { recipeId } = req.body;

      // Get the current user
      const currentUser = await dao.findUserById(userId);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Add recipe to saved_recipes array if not already saved
      const savedRecipes = currentUser.saved_recipes || [];
      if (!savedRecipes.includes(recipeId)) {
        savedRecipes.push(recipeId);
      }

      // Use updateUser to save the updated saved_recipes
      const updatedUser = await dao.updateUser(userId, {
        saved_recipes: savedRecipes,
      });

      // Update session if this is the current user
      const sessionUser = req.session["currentUser"];
      if (sessionUser && sessionUser._id === userId) {
        req.session["currentUser"] = updatedUser;
      }

      res.json(updatedUser);
    } catch (error) {
      console.error("Error saving recipe:", error);
      res.status(500).json({ message: error.message });
    }
  };
  app.put("/api/users/:userId/save", saveRecipe);

  // unsaves a recipe for a user - using updateUser
  const unsaveRecipe = async (req, res) => {
    try {
      const { userId } = req.params;
      const { recipeId } = req.body;

      // Get the current user
      const currentUser = await dao.findUserById(userId);
      if (!currentUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Remove recipe from saved_recipes array
      const savedRecipes = (currentUser.saved_recipes || []).filter(
        (id) => id !== recipeId
      );

      // Use updateUser to save the updated saved_recipes
      const updatedUser = await dao.updateUser(userId, {
        saved_recipes: savedRecipes,
      });

      // Update session if this is the current user
      const sessionUser = req.session["currentUser"];
      if (sessionUser && sessionUser._id === userId) {
        req.session["currentUser"] = updatedUser;
      }

      res.json(updatedUser);
    } catch (error) {
      console.error("Error unsaving recipe:", error);
      res.status(500).json({ message: error.message });
    }
  };
  app.put("/api/users/:userId/unsave", unsaveRecipe);

  // follow a user
  const followUser = async (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      const targetUserId = req.params.targetUserId;
      const currentUserId = currentUser._id;

      if (currentUserId === targetUserId) {
        return res.status(400).json({ message: "Cannot follow yourself" });
      }

      const targetUser = await dao.findUserById(targetUserId);
      if (!targetUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const currentUserData = await dao.findUserById(currentUserId);

      // update current user's following array
      const currentFollowing = currentUserData.following || [];
      if (!currentFollowing.includes(targetUserId)) {
        currentFollowing.push(targetUserId);
        await dao.updateUser(currentUserId, { following: currentFollowing });
      }

      // update target user's followers array
      const targetFollowers = targetUser.followers || [];
      if (!targetFollowers.includes(currentUserId)) {
        targetFollowers.push(currentUserId);
        await dao.updateUser(targetUserId, { followers: targetFollowers });
      }

      // update session with current user's new data
      const updatedCurrentUser = await dao.findUserById(currentUserId);
      req.session["currentUser"] = updatedCurrentUser;

      res.json({
        message: "Successfully followed user",
        currentUser: updatedCurrentUser,
      });
    } catch (error) {
      console.error("Error following user:", error);
      res.status(500).json({ message: "Error following user" });
    }
  };
  app.post("/api/users/follow/:targetUserId", followUser);

  // unfollow a user
  const unfollowUser = async (req, res) => {
    try {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      const targetUserId = req.params.targetUserId;
      const currentUserId = currentUser._id;

      const targetUser = await dao.findUserById(targetUserId);
      if (!targetUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const currentUserData = await dao.findUserById(currentUserId);

      // update current user's following array
      const currentFollowing = (currentUserData.following || []).filter(
        (id) => id !== targetUserId
      );
      await dao.updateUser(currentUserId, { following: currentFollowing });

      // update target user's followers array
      const targetFollowers = (targetUser.followers || []).filter(
        (id) => id !== currentUserId
      );
      await dao.updateUser(targetUserId, { followers: targetFollowers });

      // update session with current user's new data
      const updatedCurrentUser = await dao.findUserById(currentUserId);
      req.session["currentUser"] = updatedCurrentUser;

      res.json({
        message: "Successfully unfollowed user",
        currentUser: updatedCurrentUser,
      });
    } catch (error) {
      console.error("Error unfollowing user:", error);
      res.status(500).json({ message: "Error unfollowing user" });
    }
  };
  app.post("/api/users/unfollow/:targetUserId", unfollowUser);
}
