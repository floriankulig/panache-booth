import { IOrder } from "../models/IOrder";
import { v4 as uuidv4 } from "uuid";
import {
  checkIfProductIsInOrder,
  createOrder,
  createOrderProductEntity,
  deleteOrderById,
  getAllOrders,
  getAllOrdersByUserId,
  getAllOrdersWithVendorProducts,
  getOrderById,
  getProductsOfOrder,
  getProductsOfOrderVendor, getQuantityAndDeliveredStatusOfOrder,
  updateOrderById, updateOrderProductEntity,
} from "../models/order";
import { getUserById } from "../models/user";
import { userById } from "./user";
import { UserNotExistingError } from "../util/customUserErrors";
import { getArticleById, updateInventoryAndPurchases } from "../models/product";
import {
  InvalidUserError,
  OrderNotExistingError,
  OrderPriceFormatError,
  OrderQuantityFormatError, ProductNotInOrderError,
} from "../util/customOrderErrors";
import { ProductNotExistingError, ProductPriceFormatError } from "../util/customProductErrors";
import { IOrderProduct } from "../models/IOrderProduct";

export function orderById(id: string) {
  return getOrderById(id);
}

export function allUserOrdersById(reqParams: any) {
  let userId = reqParams.id;
  if (getUserById(userId) !== undefined) {
    let orders: any[] = getAllOrdersByUserId(userId);
    let newArray = [];
    let productsNew = [];

    for (const order of orders) {
      let products: any[] = getProductsOfOrder(order.id);

      for (let product of products) {
        let vendorInfo: any = getUserById(product.vendorId);
        product.delivered =
          product.delivered === 1 ? true : false;
        product.isVisible = product.isVisible === 1 ? true : false;
        const combinedProduct = {
          ...product,
          vendor: vendorInfo,
        };
        productsNew.push(combinedProduct);
      }
      const combinedObject = {
        ...order,
        products: [...productsNew],
      };
      newArray.push(combinedObject);
      productsNew = [];
    }
    return newArray;
  } else {
    throw new UserNotExistingError();
  }
}

export function allVendorOrdersById(reqParams: any) {
  let vendorId = reqParams.id;
  if (getUserById(vendorId) !== undefined) {
    let orders: any[] = getAllOrdersWithVendorProducts(vendorId);
    let newArray = [];
    let productsNew = [];
    let vendorPrice = 0;

    for (const order of orders) {
      let orderProductsVendor: any[] = getProductsOfOrderVendor(
        order.id,
        vendorId,
      );
      for (const orderProductVendor of orderProductsVendor) {
        let vendorInfo: any = getUserById(orderProductVendor.vendorId);
        orderProductVendor.delivered =
          orderProductVendor.delivered === 1 ? true : false;
        orderProductVendor.isVisible = orderProductVendor.isVisible === 1 ? true : false;
        vendorPrice += orderProductVendor.price;
        const combinedProduct = {
          ...orderProductVendor,
          vendor: vendorInfo,
        };
        productsNew.push(combinedProduct);
      }
      order.price = vendorPrice;
      const combinedObject = {
        ...order,
        products: [...productsNew],
      };
      newArray.push(combinedObject);
      productsNew = [];
    }
    return newArray;
  } else {
    throw new UserNotExistingError();
  }
}

export function allOrders() {
  let orders: any[] = getAllOrders();
  let newArray = [];
  let productsNew = [];

  for (const order of orders) {
    let products: any[] = getProductsOfOrder(order.id);

    for (let product of products) {
      let vendorInfo: any = getUserById(product.vendorId);
      let statusOrder: any = getQuantityAndDeliveredStatusOfOrder(order.id, product.id)
      let productDelivered = statusOrder.delivered === 1 ? true : false;
      product.isVisible = product.isVisible === 1 ? true : false;
      const combinedProduct = {
        ...product,
        quantity: statusOrder.quantity,
        delivered: productDelivered,
        vendor: vendorInfo,
      };
      productsNew.push(combinedProduct);
    }
    const combinedObject = {
      ...order,
      products: [...productsNew],
    };
    newArray.push(combinedObject);
    productsNew = [];
  }
  return newArray;
}

export function addOrder(reqBody: any) {
  const currentTimestamp = new Date().toISOString();
  let products = reqBody.products;
  let order: IOrder = {
    id: uuidv4(),
    createdAt: currentTimestamp,
    updatedAt: currentTimestamp,
    userId: reqBody.userId ? validateOrderUser(reqBody.userId) : (() => {
      throw new InvalidUserError();
    })(),
    price: reqBody.price ? validateOrderPrice(reqBody.price) : (() => {
      throw new OrderPriceFormatError();
    })()
  };
  products.forEach((item: { id: string; quantity: number; }) => {
    validateOrderQuantity(item.quantity);
  });
  let createdOrder = createOrder(order);

  products.forEach((item: { id: string; quantity: number; }) => {
    let orderProductEntity: IOrderProduct = {
      orderId: order.id,
      productId: item.id,
      quantity: item.quantity,
      delivered: false,
      updatedAt: currentTimestamp,
      createdAt: currentTimestamp
    }
    createOrderProductEntity(orderProductEntity);
    updateInventoryAndPurchases(item.id, item.quantity);
  });
  return createdOrder;
}

export function updateOrder(reqParams: any, reqBody: any) {
  let orderId = reqParams.orderId;
  let products: any = reqBody.products;
  if (getOrderById(orderId) === undefined) {
    throw new OrderNotExistingError();
  }
  for (let product of products) {
    if (!getArticleById(product.id)) {
      throw new ProductNotExistingError();
    }
    if (!checkIfProductIsInOrder(product.id, orderId)){
      throw new ProductNotInOrderError();
    }
  }
  const currentTimestamp = new Date().toISOString();
  let order: Pick<IOrder, "updatedAt"> = {
    updatedAt: currentTimestamp
  }
  updateOrderById(order, orderId);

  for (let product of products) {
    console.log(product)
    let orderProduct: Omit<IOrderProduct, "quantity" | "createdAt"> = {
      orderId: orderId,
      productId: product.id,
      delivered: product.delivered,
      updatedAt: currentTimestamp
    }
    console.log(orderProduct.delivered)
    updateOrderProductEntity(orderProduct);
  }
  let newOrder: any = getOrderById(orderId);
  let productsOfOrder: any = getProductsOfOrder(orderId)

  let productsNew = [];

  for (let product of productsOfOrder) {
    let vendorInfo: any = getUserById(product.vendorId);
    let statusOrder: any = getQuantityAndDeliveredStatusOfOrder(orderId, product.id)
    let productDelivered = statusOrder.delivered === 1 ? true : false;
    const combinedProduct = {
      ...product,
      quantity: statusOrder.quantity,
      delivered: productDelivered,
      vendor: vendorInfo,
    };
    productsNew.push(combinedProduct);
  }
  return   {
    ...newOrder,
    products: [...productsNew],
  };
}

export function deleteOrder(id: string) {
  return deleteOrderById(id);
}


function validateOrderUser(userId: any): string {
  if (getUserById(userId) === undefined) {
    throw new InvalidUserError();
  }
  return userId;
}

function validateOrderPrice(price: any): number {
  console.log(price)
  if (typeof price !== "number" && !checkForTwoDecimalPlaces(price)) {
    throw new ProductPriceFormatError() ;
  }
  return price;
}

function validateOrderQuantity(quantity: any): number {
  if (!Number.isInteger(quantity)) {
    throw new OrderQuantityFormatError() ;
  }
  return quantity;
}

function checkForTwoDecimalPlaces(value: number): boolean {
  const decimalRegex = /^\d+(\.\d{1,2})?$/;
  return decimalRegex.test(value.toString());
}