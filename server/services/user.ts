import {
  createUser,
  deleteUserById,
  getAllUsers, getUserByEmail,
  getUserById,
  loggedInUser,
  updateUserById,
} from "../models/user";
import { IUser } from "../models/IUser";
import {
  BicFormatError,
  CityFormatError,
  EmailFormatError,
  HouseNumberFormatError,
  IbanFormatError,
  InvalidLoginError,
  IsVendorFormatError,
  PasswordFormatError,
  PostcodeFormatError,
  ShippingCostFormatError,
  ShippingFreeFromFormatError,
  StreetFormatError,
  UserNameFormatError,
  UserNotExistingError,
} from "../util/customUserErrors";
import { v4 as uuidv4 } from "uuid";

export function userById(reqParams: any) {
  let userId = reqParams.userId;
  let user = getUserById(userId);
  if (user !== undefined) {
    return user;
  } else {
    throw new UserNotExistingError();
  }
}

export function userByEmail(email: string) {
  return getUserByEmail(email);
}

export function allUsers() {
  let users: any[] = getAllUsers();
  console.log(users)
  users.forEach((key) => {
    key["isVendor"] = key["isVendor"] !== 0;
  });
  return users;
}

export function addUser(reqBody: any) {
  const currentTimestamp = new Date().toISOString();
  let user: IUser = {
    userId: uuidv4(),
    userName: reqBody.userName ? validateUserNameFormat(reqBody.userName) : (() => {
      throw new UserNameFormatError();
    })(),
    email: reqBody.email ? validateEmailFormat(reqBody.email) : (() => {
      throw new EmailFormatError();
    })(),
    street: reqBody.street ? validateStreetFormat(reqBody.street) : (() => {
      throw new StreetFormatError();
    })(),
    houseNumber: reqBody.houseNumber ? validateHouseNumberFormat(reqBody.houseNumber) : (() => {
      throw new HouseNumberFormatError();
    })(),
    postcode: reqBody.postcode ? validatePostcodeFormat(reqBody.postcode) : (() => {
      throw new PostcodeFormatError();
    })(),
    city: reqBody.city ? validateCityFormat(reqBody.city) : (() => {
      throw new CityFormatError();
    })(),
    password: reqBody.password ? validatePasswordFormat(reqBody.password) : (() => {
      throw new PasswordFormatError();
    })(),
    isVendor: reqBody.isVendor.toString() ? validateIsVendorFormat(reqBody.isVendor) : (() => {
      throw new IsVendorFormatError();
    })(),
    iban: reqBody.isVendor ? validateIbanFormat(reqBody.iban) : undefined,
    bic: reqBody.isVendor ? validateBicFormat(reqBody.bic) : undefined,
    shippingCost: reqBody.isVendor ? validateShippingCostFormat(reqBody.shippingCost) : undefined,
    shippingFreeFrom: reqBody.isVendor ? validateShippingFreeFromFormat(reqBody.shippingFreeFrom) : undefined,
    createdAt: currentTimestamp,
    updatedAt: currentTimestamp,
  };

  return createUser(user);
}

export function updateUser(reqParams: any, reqBody: any) {
  let userId = reqParams.userId;
  if (!getUserById(userId)) {
    throw new UserNotExistingError();
  }

  const currentTimestamp = new Date().toISOString();
  let user: Omit<IUser, "userId" | "createdAt"> = {
    userName: reqBody.userName ? validateUserNameFormat(reqBody.userName) : undefined,
    email: reqBody.email ? validateEmailFormat(reqBody.email) : undefined,
    street: reqBody.street ? validateStreetFormat(reqBody.street) : undefined,
    houseNumber: reqBody.houseNumber ? validateHouseNumberFormat(reqBody.houseNumber) : undefined,
    postcode: reqBody.postcode ? validatePostcodeFormat(reqBody.postcode) : undefined,
    city: reqBody.city ? validateCityFormat(reqBody.city) : undefined,
    password: reqBody.password ? validatePasswordFormat(reqBody.password) : undefined,
    isVendor: reqBody.isVendor !== undefined ? validateIsVendorFormat(reqBody.isVendor) : undefined,
    iban: reqBody.isVendor ? validateIbanFormat(reqBody.iban) : undefined,
    bic: reqBody.isVendor ? validateBicFormat(reqBody.bic) : undefined,
    shippingCost: reqBody.isVendor ? validateShippingCostFormat(reqBody.shippingCost) : undefined,
    shippingFreeFrom: reqBody.isVendor ? validateShippingFreeFromFormat(reqBody.shippingFreeFrom) : undefined,
    updatedAt: currentTimestamp,
  };
  return updateUserById(userId, user);
}

export function deleteUser(reqParams: any) {
  let userId = reqParams.userId;
  if (userById(userId) !== undefined) {
    return deleteUserById(userId);
  } else {
    throw new UserNotExistingError();
  }
}

export function loginUser(reqBody: any) {
  let user: any = loggedInUser(reqBody.email, reqBody.password);
  if (user != undefined) {
    user.isVendor = user.isVendor === 1;
    return user;
  } else {
    throw new InvalidLoginError();
  }
}

function validateShippingCostFormat(shippingCost: any): number {
  if (typeof shippingCost !== "number") {
    throw new ShippingCostFormatError();
  }
  return shippingCost;
}

function validateShippingFreeFromFormat(shippingFreeForm: any): number {
  if (typeof shippingFreeForm !== "number") {
    throw new ShippingFreeFromFormatError() ;
  }
  return shippingFreeForm;
}

function validateIbanFormat(iban: any): string {
  if (iban === undefined || iban.length > 22) {
    throw new IbanFormatError();
  }
  return iban;
}

function validateBicFormat(bic: any): string {
  if (bic === undefined || bic.length > 11) {
    throw new BicFormatError();
  }
  return bic;
}

function validateUserNameFormat(userName: any): string {
  if (userName === undefined || userName.length < 1 || userName.length > 32) {
    throw new UserNameFormatError();
  }
  return userName;
}

function validateEmailFormat(email: any): string {
  if (email === undefined || email.length > 255) {
    throw new EmailFormatError();
  } else {
    if (!checkEmailFormat(email)) {
      throw new EmailFormatError();
    }
  }
  return email;
}

function checkEmailFormat(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateStreetFormat(street: any): string {
  if (street === undefined || street.length > 255) {
    throw new StreetFormatError();
  }
  return street;
}

function validateHouseNumberFormat(houseNumber: any): string {
  if (houseNumber === undefined || houseNumber.length > 10 || houseNumber.length < 1) {
    throw new HouseNumberFormatError();
  }
  return houseNumber;
}

function validatePostcodeFormat(postcode: any): string {
  if (postcode === undefined || postcode.length !== 5) {
    throw new PostcodeFormatError();
  }
  return postcode;
}

function validateIsVendorFormat(isVendor: any): boolean {
  if (typeof isVendor !== "boolean") {
    throw new IsVendorFormatError();
  }
  return isVendor;
}

function validateCityFormat(city: any): string {
  if (city === undefined || city.length > 50) {
    throw new CityFormatError();
  }
  return city;
}

function validatePasswordFormat(password: any): string {
  if (password === undefined || password.length < 6 || password.length > 12) {
    throw new PasswordFormatError();
  }
  if (!passwordRequirements(password)) {
    throw new PasswordFormatError();
  }
  return password;
}

function passwordRequirements(password: string): boolean {
  const uppercaseRegex = /[A-Z]/;
  const lowercaseRegex = /[a-z]/;
  const numberRegex = /\d/;

  return (
    uppercaseRegex.test(password) &&
    lowercaseRegex.test(password) &&
    numberRegex.test(password)
  );
}
