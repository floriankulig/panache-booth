import {
  createUser,
  deleteUserById,
  getAllUsers,
  getUserById,
  loggedInUser,
  updateUserById
} from "../models/user";
import { IUser } from "../models/IUser";
import { InvalidLogin } from "../util/customUserErrors";
import { v4 as uuidv4 } from "uuid";

export function userById(id: string) {
  return getUserById(id);
}

export function allUsers() {
  let users = getAllUsers();
  users.forEach((key) => {
    // @ts-ignore
    key["isVendor"] = key["isVendor"] !== 0;
  });
  return users;
}

export function addUser(userBody: any) {
  const currentTimestamp = new Date().toISOString();
  const user: IUser = {
    userId: uuidv4(),
    userName: userBody.userName,
    email: userBody.email,
    street: userBody.street,
    houseNumber: userBody.houseNumber,
    postcode: userBody.postcode,
    city: userBody.city,
    password: userBody.password,
    isVendor: userBody.isVendor,
    iban: userBody.iban ?? null,
    bic: userBody.bic ?? null,
    shippingCost: userBody.shippingCost ?? null,
    shippingFreeFrom: userBody.shippingFreeFrom ?? null,
    createdAt: currentTimestamp,
    updatedAt: currentTimestamp
  };
  return createUser(user);
}

export function updateUser(userChanges: Map<string, string>, id: string) {
  return updateUserById(userChanges, id);
}

export function deleteUser(id: string) {
  return deleteUserById(id);
}

export function loginUser(email: string, password: string) {
  let user: any = loggedInUser(email, password);
  if (user != undefined) {
    user.isVendor = user.isVendor === 1;
    return user;
  } else {
    throw new InvalidLogin();
  }
}
