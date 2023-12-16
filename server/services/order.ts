import { IOrder } from "../models/IOrder";
import { v4 as uuidv4 } from "uuid";
import {
  createOrder,
  createOrderProductEntity,
  deleteOrderById,
  getAllOrders,
  getAllOrdersByUserId,
  getAllOrdersByVendorId,
  getOrderById,
  getProductsOfOrder,
  updateOrderById
} from "../models/order";
import { getUserById } from "../models/user";

export function orderById(id: string) {
  return getOrderById(id);
}

export function allUserOrdersById(id: string) {
  let orders: any[] = getAllOrdersByUserId(id);
  let newArray = [];
  let productsNew = [];
  console.log("Test")
  for (const order of orders) {
    let products: any[] = getProductsOfOrder(order.id);

    for (const product of products) {
      console.log(product.vendorId + "  Vendor id")
      let vendorInfo: any = getUserById(product.vendorId)
      console.log(vendorInfo)
      const combinedProduct = {
        ...product,
        vendor: vendorInfo
      }
      productsNew.push(combinedProduct);
    }
    console.log(productsNew)
    const combinedObject = {
      ...order,
      products: [...productsNew]
    };
    newArray.push(combinedObject);
  }
  return newArray;
}

export function allVendorOrdersById(id: string) {
  return getAllOrdersByVendorId(id);
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
