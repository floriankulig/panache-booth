import { IOrder } from "../models/IOrder";
import {
  createOrder,
  deleteOrderById,
  getAllOrders,
  getAllOrdersByUserId,
  getOrderById,
  updateOrderById,
} from "../models/order";

export function orderById(id: string) {
  return getOrderById(id);
}

export function allOrdersById(id: string) {
  return getAllOrdersByUserId(id);
}

export function allOrders() {
  return getAllOrders();
}

export function addOrder(order: IOrder) {
  return createOrder(order);
}

export function updateOrder(orderChanges: Map<string, string>, id: string) {
  return updateOrderById(orderChanges, id);
}

export function deleteOrder(id: string) {
  return deleteOrderById(id);
}

