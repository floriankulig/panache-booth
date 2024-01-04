import { checkIfUserIsVendor, getUserByEmailService } from "../services/user";
import { IUser } from "../models/IUser";
import {
  AuthenticationRequired,
  CustomAuthError, NoPermission,
  UsernamePasswordMismatch,
} from "./customAuthError";
import { UserError } from "./customUserErrors";
import { checkIsVendorsProduct } from "../services/product";
import {
  checkIfProductIsInOrderService,
  getAllOrdersByUserIdService,
  getAllVendorOrdersByIdService, getOrderByIdService,
  userHasOrdersByVendor,
} from "../services/order";
import { checkIfProductIsInOrderModel } from "../models/order";
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

export async function customAuthUserOrVendor(req: any, res: any, next: any) {
  try {
    let [email, password] = getEmailAndPasswordFromHeader(req.headers);
    let user: IUser = getUserAndCheckPassword(email, password);
    isVendorAndUserHasOrder(user.userId!, req.params.userId);
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

export async function customAuthIsVendor(req: any, res: any, next: any) {
  try {
    let [email, password] = getEmailAndPasswordFromHeader(req.headers);
    let user: IUser = getUserAndCheckPassword(email, password);
    isVendor(user.userId!);
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
    isVendor(user.userId!);
    console.log(req.params.productId);
    isVendorsProduct(user.userId!, req.params.productId);
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
    let order: IOrder = getOrderByIdService(req.params.orderId);
    if (req.query.isVendor === "false") {
      isSameUser(user.userId!, order.userId!);
    } else {
      orderHasProductOfVendor(order, user.userId!);
    }
    req.user = user;
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
    isVendorProductAndInOrder(products, user.userId!, orderId);

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
  return user;
}

function isVendor(userId: string): void {
  if (!checkIfUserIsVendor(userId)) {
    throw new NoPermission();
  }
}

function isVendorsProduct(userId: string, productId: string): void {
  if (!checkIsVendorsProduct(userId, productId)) {
    throw new NoPermission();
  }
}

function isVendorAndUserHasOrder(vendorId: string, userId: string): void {
  isVendor(vendorId);
  if (!userHasOrdersByVendor(vendorId, userId)) {
    throw new NoPermission();
  }
}

function isVendorProductAndInOrder(products: any, userId: string, orderId: string): void {
  for (let product of products) {
    isVendorsProduct(userId, product.id);
    if (!checkIfProductIsInOrderService(orderId, product.id)) {
      throw new ProductNotInOrderError();
    }
  }
}

function isSameUser(userId: string, orderUserId: string): void {
  if (!(userId === orderUserId)) {
    throw new NoPermission();
  }
}

function orderHasProductOfVendor(order: IOrder, userId: String): void {
  for (let product of order.products!) {
    if (product.vendorId === userId) {
      return;
    }
  }
  throw new NoPermission();
}


