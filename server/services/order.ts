import { IOrder } from "../models/IOrder";
import { v4 as uuidv4 } from "uuid";
import {
  checkIfProductIsInOrder,
  createOrder,
  createOrderProductEntity,
  getAllOrders,
  getAllOrdersByUserId,
  getAllOrdersWithVendorProducts,
  getOrderById,
  getProductsOfOrder,
  getProductsOfOrderVendor, getStatusOfOrder,
  updateOrderById, updateOrderProductEntity,
} from "../models/order";
import { getUserById, getVendorShippingCost, getVendorShippingFreeFrom } from "../models/user";
import { IsVendorFormatError, UserNotExistingError } from "../util/customUserErrors";
import {
  getDiscountOfProduct,
  getPriceOfProduct,
  getProductById,
  updateInventoryAndPurchases,
} from "../models/product";
import {
  InvalidUserError, NoProductsInOrderError,
  OrderNotExistingError,
  OrderPriceFormatError,
  OrderQuantityFormatError, ProductNotInOrderError,
} from "../util/customOrderErrors";
import { ProductNotExistingError, ProductOutOfStockError, ProductPriceFormatError } from "../util/customProductErrors";
import { IOrderProduct } from "../models/IOrderProduct";
import { validateDecimalNumber } from "../util/util";
import { it } from "node:test";

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
        let statusOrder: any = getStatusOfOrder(order.id, product.id);
        product.price = statusOrder.priceProduct;
        product.discount = statusOrder.discountProduct;
        vendorInfo.vendorShippingCost = statusOrder.shippingCost;
        vendorInfo.vendorShippingFreeFrom = statusOrder.shippingFreeFrom;
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
      console.log(order)
      let orderProductsVendor: any[] = getProductsOfOrderVendor(
        order.id,
        vendorId,
      );
      let vendorInfo: any = getUserById(vendorId);
      for (const orderProductVendor of orderProductsVendor) {
        let statusOrder: any = getStatusOfOrder(order.id, orderProductVendor.id);
        vendorInfo.shippingCost = statusOrder.vendorShippingCost;
        vendorInfo.shippingFreeFrom = statusOrder.vendorShippingFreeFrom;
        orderProductVendor.price = statusOrder.priceProduct;
        orderProductVendor.discount = statusOrder.discountProduct;
        orderProductVendor.delivered =
          orderProductVendor.delivered === 1 ? true : false;
        orderProductVendor.isVisible = orderProductVendor.isVisible === 1 ? true : false;
        vendorPrice += orderProductVendor.price - orderProductVendor.price * orderProductVendor.discount;
        const combinedProduct = {
          ...orderProductVendor,
          vendor: vendorInfo,
        };
        productsNew.push(combinedProduct);
      }
      if (vendorPrice < vendorInfo.shippingFreeFrom) {
        order.price = vendorPrice + vendorInfo.shippingCost;
      } else {
        order.price = vendorPrice;
      }
      console.log(order.price);
      let user = getUserById(order.userId)
      console.log(user)
      const combinedObject = {
        ...order,
        user: user,
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
      console.log(product)
      let vendorInfo: any = getUserById(product.vendorId);
      let statusOrder: any = getStatusOfOrder(order.id, product.id);
      console.log(statusOrder)
      let productDelivered = statusOrder.delivered === 1 ? true : false;
      product.isVisible = product.isVisible === 1 ? true : false;
      product.price = statusOrder.priceProduct;
      product.discount = statusOrder.discountProduct;
      vendorInfo.shippingCost = statusOrder.vendorShippingCost;
      vendorInfo.shippingFreeFrom = statusOrder.vendorShippingFreeFrom;
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
  if (products === undefined || products.length === 0) {
    throw new NoProductsInOrderError();
  }
  let order: IOrder = {
    id: uuidv4(),
    createdAt: currentTimestamp,
    updatedAt: currentTimestamp,
    userId: reqBody.userId ? validateOrderUser(reqBody.userId) : (() => {
      throw new InvalidUserError();
    })(),
    price: reqBody.price ? validateOrderPrice(reqBody.price) : (() => {
      throw new OrderPriceFormatError();
    })(),
  };
  products.forEach((item: { id: string; quantity: number; }) => {
    validateProductId(item.id);
    validateOrderQuantity(item.quantity);
    checkOutOfStock(item.id, item.quantity);
  });
  let createdOrder = createOrder(order);

  products.forEach((item: { id: string; quantity: number; vendorId: string; }) => {
    let productPrice: any = getPriceOfProduct(item.id);
    let productDiscount: any = getDiscountOfProduct(item.id);
    let vendorShippingCost: any = getVendorShippingCost(item.vendorId);
    let vendorShippingFreeFrom: any = getVendorShippingFreeFrom(item.vendorId);
    let orderProductEntity: IOrderProduct = {
      orderId: order.id,
      productId: item.id,
      quantity: item.quantity,
      delivered: false,
      updatedAt: currentTimestamp,
      createdAt: currentTimestamp,
      priceProduct: productPrice.price,
      discountProduct: productDiscount.discount,
      vendorShippingCost: vendorShippingCost.shippingCost,
      vendorShippingFreeFrom: vendorShippingFreeFrom.shippingFreeFrom,
    };
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
    if (!getProductById(product.id)) {
      throw new ProductNotExistingError();
    }
    if (!checkIfProductIsInOrder(product.id, orderId)) {
      throw new ProductNotInOrderError();
    }
    validateDeliveredFormat(product.delivered);
  }
  const currentTimestamp = new Date().toISOString();
  let order: Pick<IOrder, "updatedAt"> = {
    updatedAt: currentTimestamp,
  };
  updateOrderById(order, orderId);

  for (let product of products) {
    let orderProduct: Omit<IOrderProduct, "quantity" | "createdAt" | "priceProduct" | "discountProduct" | "vendorShippingCost" | "vendorShippingFreeFrom"> = {
      orderId: orderId,
      productId: product.id,
      delivered: product.delivered,
      updatedAt: currentTimestamp,
    };
    updateOrderProductEntity(orderProduct);
  }
  let newOrder: any = getOrderById(orderId);
  let productsOfOrder: any = getProductsOfOrder(orderId);

  let productsNew = [];

  for (let product of productsOfOrder) {
    let vendorInfo: any = getUserById(product.vendorId);
    let statusOrder: any = getStatusOfOrder(orderId, product.id);
    let productDelivered = statusOrder.delivered === 1 ? true : false;
    product.price = statusOrder.priceProduct;
    product.discount = statusOrder.discountProduct;
    vendorInfo.shippingCost = statusOrder.vendorShippingCost;
    vendorInfo.shippingFreeFrom = statusOrder.vendorShippingFreeFrom;
    const combinedProduct = {
      ...product,
      quantity: statusOrder.quantity,
      delivered: productDelivered,
      vendor: vendorInfo,
    };
    productsNew.push(combinedProduct);
  }
  return {
    ...newOrder,
    products: [...productsNew],
  };
}

function validateOrderUser(userId: any): string {
  if (getUserById(userId) === undefined) {
    throw new InvalidUserError();
  }
  return userId;
}

function validateProductId(productId: string) {
  if (getProductById(productId) === undefined) {
    throw new ProductNotExistingError();
  }
}

function validateOrderPrice(price: any): number {
  if (typeof price !== "number") {
    throw new ProductPriceFormatError() ;
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
  let product = getProductById(productId);
  if (product.inventory < quantity) {
    throw new ProductOutOfStockError();
  }
}

function validateDeliveredFormat(delivered: any) {
  if (typeof delivered !== "boolean") {
    throw new IsVendorFormatError();
  }
}