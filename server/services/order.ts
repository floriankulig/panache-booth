import { IOrder } from "../models/IOrder";
import { v4 as uuidv4 } from "uuid";
import {
  createOrder,
  createOrderProductEntity,
  deleteOrderById,
  getAllOrders,
  getAllOrdersByUserId,
  getAllOrdersByVendorId, getAllOrdersWithVendorProducts,
  getOrderById,
  getProductsOfOrder, getProductsOfOrderVendor,
  updateOrderById,
} from "../models/order";
import { getUserById } from "../models/user";

export function orderById(id: string) {
  return getOrderById(id);
}

export function allUserOrdersById(id: string) {
  let orders: any[] = getAllOrdersByUserId(id);
  let newArray = [];
  let productsNew = [];

  for (const order of orders) {
    let products: any[] = getProductsOfOrder(order.id);

    for (const product of products) {
      let vendorInfo: any = getUserById(product.vendorId)
      const combinedProduct = {
        ...product,
        vendor: vendorInfo
      }
      productsNew.push(combinedProduct);
    }
    const combinedObject = {
      ...order,
      products: [...productsNew]
    };
    newArray.push(combinedObject);
    productsNew = [];
  }
  return newArray;
}

export function allVendorOrdersById(vendorId: string) {
  let orders: any[] = getAllOrdersWithVendorProducts(vendorId);
  let newArray = [];
  let productsNew = [];

  for (const order of orders) {
    console.log(order.id)
    let orderProductsVendor: any[] = getProductsOfOrderVendor(order.id, vendorId)
    console.log(orderProductsVendor)
    for (const orderProductVendor of orderProductsVendor) {
      let vendorInfo: any = getUserById(orderProductVendor.vendorId)
      const combinedProduct = {
        ...orderProductVendor,
        vendor: vendorInfo
      }
      productsNew.push(combinedProduct);
    }
    const combinedObject = {
      ...order,
      products: [...productsNew]
    };
    newArray.push(combinedObject);
    productsNew = [];
  }
  return newArray;
}

export function allOrders() {
  return getAllOrders();
}

export function addOrder(
  order: Omit<IOrder, "id" | "createdAt" | "updatedAt" | "price">,
  products: any[]
) {
  const currentTimestamp = new Date().toISOString();

  let newOrder: IOrder = {
    id: uuidv4(),
    createdAt: currentTimestamp,
    updatedAt: currentTimestamp,
    userId: order.userId,
    price: 45.5,
    delivered: order.delivered
  };

  let testOrder = createOrder(newOrder);
  products.forEach((item) => {
    createOrderProductEntity(newOrder.id, item.id, item.amount);
  });

  return testOrder;
}

export function updateOrder(orderChanges: Map<string, string>, id: string) {
  return updateOrderById(orderChanges, id);
}

export function deleteOrder(id: string) {
  return deleteOrderById(id);
}
