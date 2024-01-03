import { IOrder } from "../models/IOrder";
import { v4 as uuidv4 } from "uuid";
import {
  checkIfProductIsInOrderModel,
  createOrderModel,
  createOrderProductEntityModel,
  getAllOrdersModel,
  getAllOrdersByUserIdModel,
  getAllOrdersWithVendorProductsModel,
  getOrderByIdModel,
  getProductsOfOrderModel,
  getProductsOfOrderVendorModel, getStatusOfOrderModel,
  updateOrderModel, updateOrderProductModel,
} from "../models/order";
import { getUserByIdModel, getVendorShippingCostModel, getVendorShippingFreeFromModel } from "../models/user";
import {
  IsVendorFormatError,
  UserIdFormatError,
  UserIsNoVendorError,
  UserNotExistingError,
} from "../util/customUserErrors";
import {
  getDiscountOfProductModel,
  getPriceOfProductModel,
  getProductByIdModel,
  updateInventoryAndPurchasesModel,
} from "../models/product";
import {
  InvalidUserError, NoProductsInOrderError,
  OrderNotExistingError,
  OrderPriceFormatError,
  OrderQuantityFormatError, ProductNotInOrderError,
} from "../util/customOrderErrors";
import {
  ProductIsVisibleFormatError,
  ProductNotExistingError,
  ProductOutOfStockError,
  ProductPriceFormatError,
} from "../util/customProductErrors";
import { IOrderProduct } from "../models/IOrderProduct";
import { booleanToNumber, numberToBoolean, validateDecimalNumber } from "../util/util";
import { it } from "node:test";
import { Console } from "inspector";
import { IProduct } from "../models/IProduct";
import { checkIfProductExistsById, getProductByIdService } from "./product";
import { checkIfUserExistsById, checkIfUserIsVendor, getUserByIdService } from "./user";
import { setFlagsFromString } from "v8";
import { AnyAaaaRecord } from "dns";
import { IUser } from "../models/IUser";

export function getOrderByIdService(orderId: string): IOrder {
  if (!checkIfOrderExistsById(orderId)) {
    throw new ProductNotExistingError();
  }
  let order: IOrder = getOrderByIdModel(orderId);
  return individualProduct(order);
}

export function getAllOrdersByUserIdService(reqParams: any) {
  let userId = reqParams.id;
  if (!checkIfUserExistsById(userId)) {
    throw new UserNotExistingError();
  }
  return multipleOrders(getAllOrdersByUserIdModel(userId!));
}

export function getAllVendorOrdersByIdService(reqParams: any) {
  let vendorId = reqParams.id;
  if (!checkIfUserExistsById(vendorId)) {
    throw new UserNotExistingError();
  }
  if (!checkIfUserIsVendor(vendorId)) {
    throw new UserNotExistingError();
  }
  return multipleOrders(getAllOrdersWithVendorProductsModel(vendorId!), vendorId);
}

export function getAllOrdersService() {
  let orders: IOrder[] = getAllOrdersModel();
  return multipleOrders(orders);
}

export function createOrderService(reqBody: any) {
  let products = reqBody.products;
  const createFlag: boolean = true;
  validateIfOrderHasProducts(products);
  const currentTimestamp: string = new Date().toISOString();
  let order: IOrder = buildAndValidateOrderModel(reqBody, currentTimestamp, createFlag);
  createOrderModel(order);
  buildAndValidateOrderProductsModel(products, order.id!, currentTimestamp);
  return getOrderByIdService(order.id!);
}


export function updateOrderService(reqParams: any, reqBody: any) {
  let orderId = reqParams.orderId;
  let products: any = reqBody.products;
  if (!checkIfOrderExistsById(orderId)) {
    throw new OrderNotExistingError();
  }

  checkIfProductIsInOrderAndExists(products, orderId);
  const currentTimestamp: string = new Date().toISOString();
  let order: IOrder = buildAndValidateOrderModel(reqBody, currentTimestamp);
  updateOrderModel(order, orderId);
  buildAndValidateUpdateOrderProductModel(products, orderId, currentTimestamp);
  return getOrderByIdService(orderId);
}

export function userHasOrdersByVendor(vendorId:string, userId: string): boolean {
  let orders: IOrder[] = getAllOrdersByUserIdService(userId);
  for(let order of orders) {
    for (let product of order.products!) {
      if (product.vendorId === vendorId) {
        return true;
      }
    }
  }
  return false;
}

function individualProduct(order: IOrder): IOrder {
  if (order === undefined) {
    throw new OrderNotExistingError();
  }
  return combineOrderWithProductInfo(order);
}

function multipleOrders(orders: IOrder[], vendorId: string = ""): IOrder[] {
  let ordersWithProductInfo: IOrder[] = [];
  for (let order of orders) {
    ordersWithProductInfo.push(combineOrderWithProductInfo(order, vendorId));
  }
  return ordersWithProductInfo;
}

function combineOrderWithProductInfo(order: IOrder, vendorId: string = ""): IOrder {
  let orderProducts: IProduct[] = [];
  if (vendorId !== "") {
    orderProducts = getProductsOfOrderVendorModel(order.id!, vendorId);
  } else {
    orderProducts = getProductsOfOrderModel(order.id!);
  }
  let finalProducts: IProduct[] = [];
  for (let orderProduct of orderProducts) {
    finalProducts.push(combineProductWithOrderStatus(orderProduct, order.id!));
  }
  if (vendorId !== "") {
    let user: IUser = getUserByIdService(order.userId!);
    return {
      ...order,
      user: user,
      products: [...finalProducts]
    }
  } else {
    return {
      ...order,
      products: [...finalProducts],
    };
  }
}

function combineProductWithOrderStatus(orderProduct: IProduct, orderId: string): IProduct {
  let productInfo: IProduct = getProductByIdService(orderProduct.id!);
  let statusOfOrder: IOrderProduct = getStatusOfOrderModel(orderId, orderProduct.id!);
  productInfo.price = statusOfOrder.priceProduct;
  productInfo.discount = statusOfOrder.discountProduct;
  productInfo.vendor!.shippingFreeFrom = statusOfOrder.vendorShippingFreeFrom;
  productInfo.vendor!.shippingCost = statusOfOrder.vendorShippingCost;
  return {
    ...productInfo,
    quantity: statusOfOrder.quantity,
    delivered: numberToBoolean(statusOfOrder.delivered),
    paid: numberToBoolean(statusOfOrder.paid),
  };
}

function buildAndValidateOrderModel(orderModelData: any, timestamp: string, createFlag: boolean = false): IOrder {
  return {
    id: createFlag ? uuidv4() : undefined,
    userId: createFlag ? validateOrderUser(orderModelData.userId, createFlag) : undefined,
    price: createFlag ? validateOrderPrice(orderModelData.price, createFlag) : undefined,
    createdAt: createFlag ? timestamp : undefined,
    updatedAt: timestamp,
  };
}

function buildAndValidateOrderProductsModel(products: any, orderId: string, timestamp: string): void {
  products.forEach((item: { id: string; quantity: number; vendorId: string; }) => {
    let productPrice: any = getPriceOfProductModel(item.id);
    let productDiscount: any = getDiscountOfProductModel(item.id);
    let vendorShippingCost: any = getVendorShippingCostModel(item.vendorId);
    let vendorShippingFreeFrom: any = getVendorShippingFreeFromModel(item.vendorId);
    let orderProductEntity: IOrderProduct = {
      orderId: orderId,
      productId: item.id,
      quantity: item.quantity,
      delivered: false,
      paid: false,
      updatedAt: timestamp,
      createdAt: timestamp,
      priceProduct: productPrice.price,
      discountProduct: productDiscount.discount,
      vendorShippingCost: vendorShippingCost.shippingCost,
      vendorShippingFreeFrom: vendorShippingFreeFrom.shippingFreeFrom,
    };
    createOrderProductEntityModel(orderProductEntity);
    updateInventoryAndPurchasesModel(item.id, item.quantity);
  });
}

function buildAndValidateUpdateOrderProductModel(products: any, orderId: string, timestamp: string): void {
  for (let product of products) {
    let orderProduct: Omit<IOrderProduct, "quantity" | "createdAt" | "priceProduct" | "discountProduct" | "vendorShippingCost" | "vendorShippingFreeFrom"> = {
      orderId: orderId,
      productId: product.id,
      delivered: validateDeliveredFormat(product.delivered),
      paid: validatePaidFormat(product.paid),
      updatedAt: timestamp,
    };
    updateOrderProductModel(orderProduct);
  }
}

function checkIfProductIsInOrderAndExists(products: any, orderId: string): boolean {
  for (let product of products) {
    if (!checkIfProductExistsById(product.id)) {
      throw new ProductNotExistingError();
    }
    if (!checkIfProductIsInOrderService(orderId, product.id)) {
      throw new ProductNotInOrderError();
    }
  }
  return true;
}

function checkIfOrderExistsById(orderId: string): boolean {
  let order: IOrder = getOrderByIdModel(orderId);
  return order !== undefined;
}

function checkIfProductIsInOrderService(orderId: string, productId: string): boolean {
  let product: IProduct = checkIfProductIsInOrderModel(productId, orderId);
  return product !== undefined;
}

function validateIfOrderHasProducts(products: any): void {
  if (products === undefined || products.length === 0) {
    throw new NoProductsInOrderError();
  }
  products.forEach((item: { id: string; quantity: number; }) => {
    validateProductId(item.id);
    validateOrderQuantity(item.quantity);
    checkOutOfStock(item.id, item.quantity);
  });
}

function validateOrderUser(userId: any, createFlag: boolean): string | undefined {
  if (!createFlag) {
    return undefined;
  }
  if (typeof userId !== "string") {
    throw new UserIdFormatError();
  }
  if (!checkIfUserExistsById(userId)) {
    throw new InvalidUserError();
  }
  return userId;
}

function validateProductId(productId: string) {
  if (getProductByIdModel(productId) === undefined) {
    throw new ProductNotExistingError();
  }
}

function validateOrderPrice(price: any, createFlag: boolean): number | undefined {
  if (typeof price !== "number") {
    if (createFlag || price !== undefined) {
      throw new ProductPriceFormatError();
    }
    return undefined;
  }
  if (!validateDecimalNumber(price)) {
    throw new ProductPriceFormatError();
  }
  return price;
}

function validateOrderQuantity(quantity: any): number {
  if (!Number.isInteger(quantity)) {
    throw new OrderQuantityFormatError() ;
  }
  return quantity;
}

function checkOutOfStock(productId: string, quantity: number) {
  let product = getProductByIdModel(productId);
  console.log(productId)
  // Hizugefügtes !!! cheken !!!
  if (product.inventory! < quantity) {
    throw new ProductOutOfStockError();
  }
}

function validateDeliveredFormat(delivered: any): number | undefined {
  if (typeof delivered !== "boolean") {
    if (delivered !== undefined) {
      throw new IsVendorFormatError();
    }
    return undefined;
  }
  return booleanToNumber(delivered);
}

function validatePaidFormat(paid: any): number | undefined {
  if (typeof paid !== "boolean") {
    if (paid !== undefined) {
      throw new IsVendorFormatError();
    }
    return undefined;
  }
  return booleanToNumber(paid);
}