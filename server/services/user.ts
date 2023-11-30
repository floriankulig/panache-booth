import { addNewUser, getUserById } from "../models/user";
import { IUser } from "../models/IUser";

export function userById(id: string){
  return getUserById(id);
}

export function addUser(user: IUser){
  return addNewUser(user);
}