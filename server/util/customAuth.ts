import { checkIfUserIsVendor, getUserByEmailService } from "../services/user";
import { IUser } from "../models/IUser";
import {
  AuthenticationRequired,
  CustomAuthError, NoPermission,
  UsernamePasswordMismatch,
} from "./customAuthError";
import { UserError } from "./customUserErrors";
import { checkIsVendorsProduct } from "../services/product";
import { checkIfProductIsInOrderService } from "../services/order";
import { ProductNotInOrderError } from "./customOrderErrors";
import { IOrder } from "../models/IOrder";

export async function customAuthUser(req: any, res: any, next: any) {
  try {
    let [email, password] = getEmailAndPasswordFromHeader(req.headers);
    req.user = getUserAndCheckPassword(email, password);
    next();
  } catch (error) {
    if (error instanceof CustomAuthError || error instanceof UserError) {
      return res.status(401).send(error.message);
    } else {
      return res.status(500).send("Internal server error!");
    }
  }
}

export async function customAuthGetUser(req: any, res: any, next: any) {
  try {
    if (req.headers.authorization !== undefined) {
      let [email, password] = getEmailAndPasswordFromHeader(req.headers);
      let user: IUser = getUserAndCheckPassword(email, password);
      isUserOrIsVendorAndUserHasOrder(req.params.userId, user.id!);
      req.user = user;
      next();
    } else {
      isVendor(req.params.userId);
      next();
    }


  } catch (error) {
    if (error instanceof CustomAuthError || error instanceof UserError) {
      return res.status(401).send(error.message);
    } else {
      return res.status(500).send("Internal server error!");
    }
  }
}

export async function customAuthIsVendor(req: any, res: any, next: any) {
  try {
    let [email, password] = getEmailAndPasswordFromHeader(req.headers);
    let user: IUser = getUserAndCheckPassword(email, password);
    isVendor(user.id!);
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof CustomAuthError || error instanceof UserError) {
      return res.status(401).send(error.message);
    } else {
      return res.status(500).send("Internal server error!");
    }
  }
}

export async function customAuthIsVendorOwnProduct(req: any, res: any, next: any) {
  try {
    let [email, password] = getEmailAndPasswordFromHeader(req.headers);
    let user: IUser = getUserAndCheckPassword(email, password);
    isVendor(user.id!);
    isVendorsProduct(user.id!, req.params.productId);
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof CustomAuthError || error instanceof UserError) {
      return res.status(401).send(error.message);
    } else {
      return res.status(500).send("Internal server error!");
    }
  }
}

export async function customAuthGetOrder(req: any, res: any, next: any) {
  try {
    let [email, password] = getEmailAndPasswordFromHeader(req.headers);
    let user: IUser = getUserAndCheckPassword(email, password);
    isSameUser(user.id!, req.params.id);
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof CustomAuthError || error instanceof UserError) {
      return res.status(401).send(error.message);
    } else {
      return res.status(500).send("Internal server error!");
    }
  }
}

export async function customAuthUpdateOrder(req: any, res: any, next: any) {
  try {
    let [email, password] = getEmailAndPasswordFromHeader(req.headers);
    let user: IUser = getUserAndCheckPassword(email, password);
    let orderId: string = req.params.orderId;
    let products = req.body.products;
    isVendorProductAndInOrder(products, user.id!, orderId);

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof CustomAuthError || error instanceof UserError) {
      return res.status(401).send(error.message);
    } else {
      return res.status(500).send("Internal server error!");
    }
  }
}


function getEmailAndPasswordFromHeader(reqHeader: any): string[] {
  if (reqHeader.authorization === undefined) {
    throw new AuthenticationRequired();
  }
  const b64auth = reqHeader.authorization.split(" ")[1];
  let [email, password] = Buffer.from(b64auth, "base64").toString().split(":");
  if (email === "") {
    throw new AuthenticationRequired();
  }
  return [email, password];
}

function getUserAndCheckPassword(email: string, password: string): IUser {
  let user: IUser = getUserByEmailService(email);
  if (!user || user.password !== password) {
    throw new UsernamePasswordMismatch();
  }
  const userWithoutPassword: IUser = Object.assign({}, user);
  delete userWithoutPassword.password;
  return userWithoutPassword;
}

function isVendor(userId: string): boolean {
  if (!checkIfUserIsVendor(userId)) {
    throw new NoPermission();
  }
  return true;
}

function isVendorsProduct(userId: string, productId: string): void {
  if (!checkIsVendorsProduct(userId, productId)) {
    throw new NoPermission();
  }
}

function isUserOrIsVendorAndUserHasOrder(userIdParams: string, userId: string): void {
  if (checkIfUserIsVendor(userIdParams)) {
    return;
  }
  if (isSameUser(userIdParams, userId)) {
    return;
  }
  //isVendor(userId);
  /*if (!userHasOrdersByVendor(userId, userIdParams)) {
    throw new NoPermission();
  }*/
}


function isVendorProductAndInOrder(products: any, userId: string, orderId: string): void {
  for (let product of products) {
    isVendorsProduct(userId, product.id);
    if (!checkIfProductIsInOrderService(orderId, product.id)) {
      throw new ProductNotInOrderError();
    }
  }
}

function isSameUser(userId: string, orderUserId: string): boolean {
  if (!(userId === orderUserId)) {
    throw new NoPermission();
  }
  return true;
}

function orderHasProductOfVendor(order: IOrder, userId: String): void {
  for (let product of order.products!) {
    if (product.vendorId === userId) {
      return;
    }
  }
  throw new NoPermission();
}


