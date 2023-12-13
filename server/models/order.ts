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
      "(id, createdAt, updatedAt, userId, price, amount, " +
      "delivered) " +
      "values " +
      "(?, ?, ?, ?, ?, ?)"
  );

  const info = stmt.run(
    order.id,
    order.createdAt,
    order.updatedAt,
    order.userId,
    order.price,
    order.delivered
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
  let orders = database
    .prepare("select * from orders where userId = ?")
    .all(id);
  return orders;
}

export function getAllOrdersByVendorId(id: string) {
  let orders = database
    .prepare(
      "select o.price, p.price from orders as o inner join product as p on orders.productId = product.id where vendorId = ?"
    )
    .get(id);
}

export function createOrderProductEntity(
  orderId: string,
  productId: string,
  amount: number
) {
  database
    .prepare(
      "insert into orderProduct " +
        "(orderId, productId, amount) " +
        "values " +
        "(?, ?, ?);"
    )
    .run(orderId, productId, amount);
}

export function getProductsOfOrder(orderId: string) {
  let products = database
    .prepare(
      "select product.* " +
        "from orders " +
        "join orderProduct on orders.id = orderProduct.OrderId " +
        "join product on orderProduct.productId = product.id " +
        "where orders.id = ?;"
    )
    .all(orderId);

  return products;
}
