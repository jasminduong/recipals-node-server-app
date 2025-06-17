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

/*export const findUsersByPartialName = async (partialName) => {
  const regex = new RegExp(partialName, "i"); 
  return await model.find({
    $or: [{ firstName: { $regex: regex } }, { lastName: { $regex: regex } }],
  });
};*/

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
