import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

// Users dao.js implements various CRUD operations for handling the users array in the Database

// find all users
export const findAllUsers = async () => await model.find();
 
// find by id
export const findUserById = async (userId) => await model.findOne({ _id: userId });

// find by username
export const findUserByUsername = async (username) =>
  await model.findOne({ username: username });

// find by partial name
export const findUsersByPartialName = async (partialName) => {
  const regex = new RegExp(partialName, "i");
  return await model.find({
    $or: [{ name: { $regex: regex } }, { username: { $regex: regex } }],
  });
};

// used for sign in operation
export const findUserByCredentials = async (username, password) =>
  await model.findOne({ username, password });

// used for sign up operation
export const createUser = async (user) => {
  const newUser = { ...user, _id: uuidv4() };
  return await model.create(newUser);
};

// updates user info
export const updateUser = async (userId, user) => {
  await model.updateOne({ _id: userId }, { $set: user });
  return await model.findOne({ _id: userId }); // Return the updated user
};

// deletes a user
export const deleteUser = async (userId) =>
  await model.deleteOne({ _id: userId });


