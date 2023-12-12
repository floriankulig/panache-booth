import {
  createUser,
  deleteUserById,
  getAllUsers,
  getUserById,
  loggedInUser,
  updateUserById,
} from "../models/user";
import { IUser } from "../models/IUser";

export function userById(id: string) {
  return getUserById(id);
}

export function allUsers() {
  return getAllUsers();
}

export function addUser(user: IUser) {
  return createUser(user);
}

export function updateUser(userChanges: Map<string, string>, id: string) {
  return updateUserById(userChanges, id);
}

export function deleteUser(id: string) {
  return deleteUserById(id);
}

export function loginUser(email: string, password: string) {
  return loggedInUser(email, password);
}
