import { database } from "./databases";
import { v4 as uuidv4 } from "uuid";
import { IOrder } from "./IOrder";

export function getOrderById(id: string) {
  try {
    let order = database.prepare("select * from orders where id = ?").get(id);
    return order;
  } catch (e: unknown) {
    return e
  }
}

export function getAllOrders() {
  let orders = database.prepare("select * from orders;").all();
  return orders
}

export function createOrder(order: IOrder) {
  order.id = uuidv4();
  const currentTimestamp = new Date().toISOString();
  order.createdAt = currentTimestamp;
  order.updatedAt = currentTimestamp;

  const stmt = database.prepare(
    "insert into orders " +
    "(id, userId, vendorId, productId, price, numberOfPurchases, " +
    "delivered, createdAt, updatedAt) " +
    "values " +
    "(?, ?, ?, ?, ?, ?, ?, ?, ?)"
  )

  const info = stmt.run(
    order.id, order.userId, order.vendorId, order.productId,
    order.price, order.numberOfPurchases, order.delivered,
    order.createdAt, order.updatedAt
  )
  return getOrderById(order.id);
}

export function updateOrderById(orderChanges: Map<string, string>, id: string) {
  let sqlString = "update orders set"
  orderChanges.forEach((value: string, key: string) => {
    sqlString += ` ${key} = \'${value}\',`;
  });

  const currentTimestamp = new Date().toISOString();
  sqlString += `updatedAt = '${currentTimestamp}' where id = '${id}';`;
  database.prepare(sqlString).run();
  return getOrderById(id)
}

export function deleteOrderById(id: string) {
  return database.prepare("delete from orders where id = ?;").run(id);
}

export function getAllOrdersByUserId(id: string) {
  let orders = database.prepare("select * from orders where userId = ?").all(id);
  return orders;
}

export function getAllOrdersByVendorId(id: string) {
  let orders = database.prepare("select * from orders where id = ?").get(id);
}