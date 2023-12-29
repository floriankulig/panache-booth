import {
  createUserModel,
  deleteUserByIdModel,
  getAllUsersModel, getUserByEmailModel,
  getUserByIdModel,
  loggedInUserModel,
  updateUserByIdModel,
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
import { booleanToNumber, numberToBoolean, validateDecimalNumber } from "../util/util";

export function getUserByIdService(userId: string): IUser {
  if (!checkIfUserExistsById(userId)) {
    throw new UserNotExistingError();
  }
  let user: IUser = getUserByIdModel(userId);
  return individualUser(user);
}

export function getUserByEmailService(email: string): IUser {
  let user: IUser = getUserByEmailModel(email);
  return individualUser(user);
}

export function getAllUsersService(): IUser[] {
  let users: IUser[] = getAllUsersModel();
  return multipleUsers(users);
}

export function createUserService(reqBody: any): IUser {
  const createFlag: boolean = true;
  let user: IUser = buildAndValidateUserModel(reqBody, createFlag);
  createUserModel(user);
  return getUserByIdService(user.userId!);
}

export function updateUserService(reqParams: any, reqBody: any): IUser {
  let userId: string = reqParams.userId;
  if (!checkIfUserExistsById(userId)) {
    throw new UserNotExistingError();
  }
  let existingUser: IUser = getUserByIdService(userId);
  let createFlag: boolean = false;
  let updatedUser: IUser = buildAndValidateUserModel(reqBody, createFlag, existingUser);
  updateUserByIdModel(userId, updatedUser);
  return getUserByIdService(userId);
}

export function deleteUserService(reqParams: any): void {
  let userId = reqParams.userId;
  if (!checkIfUserExistsById(userId)) {
    deleteUserByIdModel(userId);
  } else {
    throw new UserNotExistingError();
  }
}

export function loginUserService(reqBody: any) {
  let user: any = loggedInUserModel(reqBody.email, reqBody.password);
  if (user != undefined) {
    user.isVendor = user.isVendor === 1;
    return user;
  } else {
    throw new InvalidLoginError();
  }
}

function checkIfUserExistsById(userId: string): boolean {
  let user: IUser = getUserByIdModel(userId);
  return user !== undefined;
}

function individualUser(user: IUser): IUser {
  if (user === undefined) {
    throw new UserNotExistingError();
  }
  user.isVendor = numberToBoolean(user.isVendor);
  return user;
}

function multipleUsers(users: IUser[]): IUser[] {
  users.forEach((key: IUser) => {
    key.isVendor = numberToBoolean(key.isVendor);
  });
  return users;
}

function buildAndValidateUserModel(userModelData: any, createFlag: boolean = false, existingUser?: IUser): IUser {
  const currentTimestamp: string = new Date().toISOString();
  let user: IUser = {
    userId: createFlag ? uuidv4() : existingUser?.userId,
    userName: validateUserName(userModelData.userName, createFlag),
    email: validateEmail(userModelData.email, createFlag),
    street: validateStreet(userModelData.street, createFlag),
    houseNumber: validateHouseNumber(userModelData.houseNumber, createFlag),
    postcode: validatePostcode(userModelData.postcode, createFlag),
    city: validateCity(userModelData.city, createFlag),
    password: validatePassword(userModelData.password, createFlag),
    isVendor: createFlag ? validateIsVendor(userModelData.isVendor, createFlag) : existingUser?.isVendor,
    iban: createFlag && userModelData.isVendor ? validateIban(userModelData.iban, createFlag) :
      existingUser?.isVendor ? validateIban(userModelData.iban) : undefined,
    bic: createFlag && userModelData.isVendor ? validateBic(userModelData.bic, createFlag) :
      existingUser?.isVendor ? validateBic(userModelData.bic) : undefined,
    shippingCost: createFlag && userModelData.isVendor ? validateShippingCost(userModelData.shippingCost, createFlag) :
      existingUser?.isVendor ? validateShippingCost(userModelData.shippingCost) : undefined,
    shippingFreeFrom: createFlag && userModelData.isVendor ? validateShippingFreeFrom(userModelData.shippingFreeFrom, createFlag) :
      existingUser?.isVendor ? validateShippingFreeFrom(userModelData.shippingFreeFrom) : undefined,
    createdAt: createFlag ? currentTimestamp : undefined,
    updatedAt: currentTimestamp,
  };
  return user;
}

function validateShippingCost(shippingCost: any, createFlag: boolean = false): number | undefined {
  if (typeof shippingCost !== "number") {
    if (createFlag || shippingCost !== undefined) {
      throw new ShippingCostFormatError();
    }
    return undefined;
  }
  if (!validateDecimalNumber(shippingCost)) {
    throw new ShippingCostFormatError();
  }
  return shippingCost;
}

function validateShippingFreeFrom(shippingFreeForm: any, createFlag: boolean = false): number | undefined {
  if (typeof shippingFreeForm !== "number") {
    if (createFlag || shippingFreeForm !== undefined) {
      throw new ShippingFreeFromFormatError();
    }
    return undefined;
  }
  if (!validateDecimalNumber(shippingFreeForm)) {
    if (shippingFreeForm === -1) {
      return shippingFreeForm;
    }
    throw new ShippingFreeFromFormatError();
  }
  return shippingFreeForm;
}

function validateIban(iban: any, createFlag: boolean = false): string | undefined {
  if (typeof iban !== "string") {
    if (createFlag || iban !== undefined) {
      throw new IbanFormatError();
    }
    return undefined;
  }
  if (iban.length > 22) {
    throw new IbanFormatError();
  }
  return iban;
}

function validateBic(bic: any, createFlag: boolean = false): string | undefined {
  if (typeof bic !== "string") {
    if (createFlag || bic !== undefined) {
      throw new BicFormatError();
    }
    return undefined;
  }
  if (bic.length > 11) {
    throw new BicFormatError();
  }
  return bic;
}

function validateUserName(userName: any, createFlag: boolean = false): string | undefined {
  if (typeof userName !== "string") {
    if (createFlag || userName !== undefined) {
      throw new UserNameFormatError();
    }
    return undefined;
  }
  if (userName.length < 4 || userName.length > 32) {
    throw new UserNameFormatError();
  }
  return userName;
}

function validateEmail(email: any, createFlag: boolean = false): string | undefined {
  if (typeof email !== "string") {
    if (createFlag || email !== undefined) {
      throw new EmailFormatError();
    }
    return undefined;
  }
  if (email.length > 255) {
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

function validateStreet(street: any, createFlag: boolean = false): string | undefined {
  if (typeof street !== "string") {
    if (createFlag || street !== undefined) {
      throw new StreetFormatError();
    }
    return undefined;
  }
  if (street.length < 1 || street.length > 255) {
    throw new StreetFormatError();
  }
  return street;
}

function validateHouseNumber(houseNumber: any, createFlag: boolean = false): string | undefined {
  if (typeof houseNumber !== "string") {
    if (createFlag || houseNumber !== undefined) {
      throw new HouseNumberFormatError();
    }
    return undefined;
  }
  if (houseNumber.length > 3 || houseNumber.length < 1) {
    throw new HouseNumberFormatError();
  }
  return houseNumber;
}

function validatePostcode(postcode: any, createFlag: boolean = false): string | undefined {
  if (typeof postcode !== "string") {
    if (createFlag || postcode !== undefined) {
      throw new PostcodeFormatError();
    }
    return undefined;
  }
  if (postcode.length !== 5) {
    throw new PostcodeFormatError();
  }
  return postcode;
}

function validateIsVendor(isVendor: any, createFlag: boolean = false): number | undefined {
  if (typeof isVendor !== "boolean") {
    if (createFlag || isVendor !== undefined) {
      throw new IsVendorFormatError();
    }
    return undefined;
  }
  return booleanToNumber(isVendor);
}

function validateCity(city: any, createFlag: boolean = false): string | undefined {
  if (typeof city !== "string") {
    if (createFlag || city !== undefined) {
      throw new CityFormatError();
    }
    return undefined;
  }
  if (city.length < 1 || city.length > 50) {
    throw new CityFormatError();
  }
  return city;
}

function validatePassword(password: any, createFlag: boolean = false): string | undefined {
  if (typeof password !== "string") {
    if (createFlag || password !== undefined) {
      throw new PasswordFormatError();
    }
    return undefined;
  }
  if (password.length < 6 || password.length > 12) {
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
