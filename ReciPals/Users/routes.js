import * as dao from "./dao.js";
import * as recipeDao from "../Recipes/dao.js";

// UserRoutes expose the database operations of users through a RESTful API
export default function UserRoutes(app) {
  const createUser = (req, res) => {};
  const deleteUser = (req, res) => {};
  const findUserById = (req, res) => {};

  app.post("/api/users", createUser);
  app.get("/api/users/:userId", findUserById);
  app.delete("/api/users/:userId", deleteUser);

  // signup operation creates a new user
  const signup = (req, res) => {
    const user = dao.findUserByUsername(req.body.username);
    if (user) {
      res.status(400).json({ message: "Username already taken :(" });
      return;
    }
    const currentUser = dao.createUser(req.body);
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };
  app.post("/api/users/signup", signup);

  // signin operation logs in the user if credentials match
  const signin = (req, res) => {
    const { username, password } = req.body;
    const currentUser = dao.findUserByCredentials(username, password);

    if (currentUser) {
      req.session["currentUser"] = currentUser;
      res.json(currentUser);
    } else {
      res.status(401).json({ message: "Unable to login. Try again later." });
    }
  };
  app.post("/api/users/signin", signin);

  // profile operation
  // In your UserRoutes, update the profile function:
  const profile = (req, res) => {
    const currentUser = req.session["currentUser"];

    if (!currentUser) {
      console.log("No current user in session");
      res.sendStatus(401);
      return;
    }
    res.json(currentUser);
  };
  app.post("/api/users/profile", profile);

  // updates current user's profile
  const updateUser = (req, res) => {
    const userId = req.params.userId;
    const userUpdates = req.body;
    dao.updateUser(userId, userUpdates);
    const currentUser = dao.findUserById(userId);
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };
  app.put("/api/users/:userId", updateUser);

  // sign out resets the currentUser to null in the server
  const signout = (req, res) => {
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
  const findAllUsers = (req, res) => {
    const users = dao.findAllUsers();
    res.json(users);
  };
  app.get("/api/users", findAllUsers);
}
