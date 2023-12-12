import { database } from "./databases";
import { v4 as uuidv4 } from "uuid";
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
  order.id = uuidv4();
  const currentTimestamp = new Date().toISOString();
  order.createdAt = currentTimestamp;
  order.updatedAt = currentTimestamp;

  const stmt = database.prepare(
    "insert into orders " +
      "(id, userId, vendorId, productId, price, numberOfPurchases, " +
      "delivered, createdAt, updatedAt) " +
      "values " +
      "(?, ?, ?, ?, ?, ?, ?, ?, ?)",
  );

  const info = stmt.run(
    order.id,
    order.userId,
    order.vendorId,
    order.productId,
    order.price,
    order.numberOfPurchases,
    order.delivered,
    order.createdAt,
    order.updatedAt,
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
  console.log("dsd")

  let orders: unknown[] = database
    .prepare(
      "select orders.*, product.id as P_id, product.name as P_name, " +
      "product.description as P_description, product.category as P_category, " +
      "product.coupon as P_coupon, product.price as P_price, product.vendorId as P_vendorId, " +
      "product.purchases as P_purchases, product.inventory as P_inventory, product.isVisible as P_isVisible  " +
      "from orders left join product on orders.productId = product.id where userId = ?"
      //"select *, (select description, inventory from product where id = '234e3191-eb25-4216-bafe-5b889e6056f1') as pro from orders where userId = ?"
      //"select * from orders where userId = ? union select description from product where id = '234e3191-eb25-4216-bafe-5b889e6056f1' "
    )
    .all(id);
  //console.log(orders)
  /*let product = database.prepare(
    "select json_object(id, 'id') from product where id = '234e3191-eb25-4216-bafe-5b889e6056f1';"
  ).get();*/

  return orders;
}

export function getAllOrdersByVendorId(id: string) {
  let orders = database
    .prepare(
      "select o.price, p.price from orders as o inner join product as p on orders.productId = product.id where vendorId = ?",
    )
    .get(id);
}
