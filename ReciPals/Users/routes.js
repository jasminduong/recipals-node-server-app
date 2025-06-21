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
    try {
      console.log("=== SIGNUP ATTEMPT ===");
      console.log("Request body:", req.body);
      console.log("Username to check:", req.body.username);

      const user = await dao.findUserByUsername(req.body.username);
      console.log(
        "Existing user check result:",
        user ? "USER EXISTS" : "USERNAME AVAILABLE"
      );

      if (user) {
        console.log("❌ Username already taken:", req.body.username);
        res.status(400).json({ message: "Username already taken :(" });
        return;
      }

      console.log("✅ Username available, creating user...");
      console.log("User data to create:", {
        username: req.body.username,
        password: req.body.password ? "[PROVIDED]" : "[MISSING]",
        otherFields: Object.keys(req.body).filter((key) => key !== "password"),
      });

      const currentUser = await dao.createUser(req.body);
      console.log("✅ User created successfully:");
      console.log("- User ID:", currentUser._id);
      console.log("- Username:", currentUser.username);

      req.session["currentUser"] = currentUser;
      console.log("✅ User stored in session");

      res.json(currentUser);
    } catch (error) {
      console.error("❌ Signup error:", error);
      res
        .status(500)
        .json({ message: "Server error during signup", error: error.message });
    }
  };

  // signin operation logs in the user if credentials match
  const signin = async (req, res) => {
    try {
      console.log("=== SIGNIN ATTEMPT ===");
      console.log("Request body:", req.body);
      console.log("Session ID before signin:", req.sessionID);

      const { username, password } = req.body;
      console.log("Extracted credentials:");
      console.log("- Username:", username);
      console.log("- Password provided:", password ? "YES" : "NO");
      console.log("- Password length:", password ? password.length : 0);

      console.log("Calling dao.findUserByCredentials...");
      const currentUser = await dao.findUserByCredentials(username, password);
      console.log(
        "Database query result:",
        currentUser ? "USER FOUND" : "NO USER FOUND"
      );

      if (currentUser) {
        console.log("✅ User found, setting session...");
        console.log("Found user:", {
          _id: currentUser._id,
          username: currentUser.username,
        });
        req.session["currentUser"] = currentUser;
        console.log(
          "Session after setting user:",
          req.session.currentUser ? "SET" : "NOT SET"
        );
        res.json(currentUser);
      } else {
        console.log("❌ Invalid credentials for username:", username);
        res.status(401).json({ message: "Unable to login. Try again later." });
      }
    } catch (error) {
      console.error("❌ Signin error:", error);
      res.status(500).json({ message: "Server error during signin" });
    }
  };

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
}
