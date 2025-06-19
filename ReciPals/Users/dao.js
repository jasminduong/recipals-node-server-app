import db from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

// Users dao.js implements various CRUD operations for handling the users array in the Database

let { users } = db;

// used for sign up operation
export const createUser = (user) => {
  const newUser = { ...user, _id: uuidv4() };
  users = [...users, newUser];
  return newUser;
};

export const findAllUsers = () => users;

export const findUserById = (userId) =>
  users.find((user) => user._id === userId);

export const findUserByUsername = (username) =>
  users.find((user) => user.username === username);

// Fixed function to search by username 
export const findUsersByPartialName = (partialName) => {
  const searchLower = partialName.toLowerCase();
  return users.filter(user => 
    user.username?.toLowerCase().includes(searchLower)
  );
};

// used for sign in operation
export const findUserByCredentials = (username, password) =>
  users.find(
    (user) => user.username === username && user.password === password
  );

// used for updating user info
export const updateUser = (userId, user) =>
  (users = users.map((u) => (u._id === userId ? user : u)));

// used for deleting users
export const deleteUser = (userId) =>
  (users = users.filter((u) => u._id !== userId));

// saves a recipe to user's saved list
export const saveRecipe = (userId, recipeId) => {
  const user = users.find((u) => u._id === userId);
  if (!user) {
    throw new Error("User not found");
  }
  
  if (!user.saved_recipes) {
    user.saved_recipes = [];
  }
  
  if (!user.saved_recipes.includes(recipeId)) {
    user.saved_recipes.push(recipeId);
  }
  
  return user;
};

// removes a recipe from user's saved list
export const unsaveRecipe = (userId, recipeId) => {
  const user = users.find((u) => u._id === userId);
  if (!user) {
    throw new Error("User not found");
  }
  
  if (user.saved_recipes) {
    user.saved_recipes = user.saved_recipes.filter(id => id !== recipeId);
  }
  
  return user;
};
