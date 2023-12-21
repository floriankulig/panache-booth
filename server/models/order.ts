import { database } from "./databases";
import { IOrder } from "./IOrder";
import { IOrderProduct } from "./IOrderProduct";

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
    "(id, createdAt, updatedAt, userId, price) " +
    "values " +
    "(?, ?, ?, ?, ?)",
  );

  const info = stmt.run(
    order.id,
    order.createdAt,
    order.updatedAt,
    order.userId,
    order.price,
  );
  return getOrderById(order.id);
}

export function updateOrderById(order: Pick<IOrder, "updatedAt">, orderId: string) {

  return database.prepare(
    "update orders set updatedAt = ? where id = ?",
  ).run(order.updatedAt, orderId);
}

export function updateOrderProductEntity(orderProduct: Omit<IOrderProduct, "quantity" | "createdAt">) {
  let isDeliveredNumeric = orderProduct.delivered ? 1 : 0;
  return database.prepare(
    "update orderProduct set delivered = ?, updatedAt = ? where orderId = ? and productId = ?;",
  ).run(isDeliveredNumeric, orderProduct.updatedAt, orderProduct.orderId, orderProduct.productId);
}

export function getAllOrdersByUserId(id: string) {
  return database.prepare("select * from orders where userId = ?").all(id);
}

export function getAllOrdersWithVendorProducts(vendorId: string) {
  let orders = database
    .prepare(
      "select orders.id, orders.price, orders.createdAt, orders.updatedAt " +
      "from orders join orderProduct on orders.id = orderProduct.orderId join product on orderProduct.productId = product.id " +
      "where product.vendorId = ?;",
    )
    .all(vendorId);
  return orders;
}

export function getQuantityAndDeliveredStatusOfOrder(orderId: string, productId: string) {
  return database.prepare("select quantity, delivered from orderProduct where orderId = ? and productId = ?").get(orderId, productId);
}

export function createOrderProductEntity(orderProduct: IOrderProduct) {
  let isDeliveredNumeric = orderProduct.delivered ? 1 : 0;
  database
    .prepare(
      "insert into orderProduct " +
      "(orderId, productId, quantity, delivered, createdAt, updatedAt) " +
      "values " +
      "(?, ?, ?, ?, ?, ?);",
    )
    .run(orderProduct.orderId, orderProduct.productId, orderProduct.quantity, isDeliveredNumeric, orderProduct.createdAt, orderProduct.updatedAt);
}

export function getProductsOfOrder(orderId: string) {
  return database
    .prepare(
      "select product.*, orderProduct.quantity, orderProduct.delivered " +
      "from orders " +
      "join orderProduct on orders.id = orderProduct.OrderId " +
      "join product on orderProduct.productId = product.id " +
      "where orders.id = ?;",
    )
    .all(orderId);
}

export function checkIfProductIsInOrder(productId: string, orderId: string) {
  return database
    .prepare(
      "select product.* " +
      "from orders " +
      "join orderProduct on orders.id = orderProduct.OrderId " +
      "join product on orderProduct.productId = product.id " +
      "where orders.id = ? and product.id = ?;",
    )
    .all(orderId, productId);
}


export function getProductsOfOrderVendor(orderId: string, vendorId: string) {
  return database
    .prepare(
      "select product.*, orderProduct.quantity, orderProduct.delivered " +
      "from orders " +
      "join orderProduct on orders.id = orderProduct.OrderId " +
      "join product on orderProduct.productId = product.id " +
      "where orders.id = ? and product.vendorId = ?;",
    )
    .all(orderId, vendorId);
}
