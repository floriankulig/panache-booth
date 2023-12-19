import { database } from "./databases";
import { IOrder } from "./IOrder";

export function getOrderById(id: string) {
  try {
    let order = database.prepare("select * from orders where id = ?").get(id);
    return order;
  } catch (e: unknown) {
    return e;
  }
}

export function getAllOrders() {
  let orders = database.prepare("select * from orders;").all();
  return orders;
}

export function createOrder(order: IOrder) {
  const stmt = database.prepare(
    "insert into orders " +
      "(id, createdAt, updatedAt, userId, price, " +
      "delivered) " +
      "values " +
      "(?, ?, ?, ?, ?, ?)"
  );

  const info = stmt.run(
    order.id,
    order.createdAt,
    order.updatedAt,
    order.userId,
    order.price
  );
  return getOrderById(order.id);
}

export function updateOrderById(orderChanges: Map<string, string>, id: string) {
  let sqlString = "update orders set";
  orderChanges.forEach((value: string, key: string) => {
    sqlString += ` ${key} = \'${value}\',`;
  });

  const currentTimestamp = new Date().toISOString();
  sqlString += `updatedAt = '${currentTimestamp}' where id = '${id}';`;
  database.prepare(sqlString).run();
  return getOrderById(id);
}

export function deleteOrderById(id: string) {
  return database.prepare("delete from orders where id = ?;").run(id);
}

export function getAllOrdersByUserId(id: string) {
  return database
    .prepare("select * from orders where userId = ?")
    .all(id);
}

export function getAllOrdersWithVendorProducts(vendorId: string) {
  let orders = database.prepare(
    "select orders.id, orders.price, orders.createdAt, orders.updatedAt " +
    "from orders join orderProduct on orders.id = orderProduct.orderId join product on orderProduct.productId = product.id " +
    "where product.vendorId = ?;"
  ).all(vendorId);
  return orders;
}

export function createOrderProductEntity(
  orderId: string,
  productId: string,
  quantity: number,
  delivered: number
) {
  database
    .prepare(
      "insert into orderProduct " +
        "(orderId, productId, quantity, delivered) " +
        "values " +
        "(?, ?, ?, ?);"
    )
    .run(orderId, productId, quantity, delivered);
}

export function getProductsOfOrder(orderId: string) {
  return database
    .prepare(
      "select product.*, orderProduct.quantity, orderProduct.delivered " +
      "from orders " +
      "join orderProduct on orders.id = orderProduct.OrderId " +
      "join product on orderProduct.productId = product.id " +
      "where orders.id = ?;"
    )
    .all(orderId);
}

export function getProductsOfOrderVendor(orderId: string, vendorId: string) {
  return database.prepare(
    "select product.*, orderProduct.quantity, orderProduct.delivered " +
    "from orders " +
    "join orderProduct on orders.id = orderProduct.OrderId " +
    "join product on orderProduct.productId = product.id " +
    "where orders.id = ? and product.vendorId = ?;"
  ).all(orderId, vendorId);
}
