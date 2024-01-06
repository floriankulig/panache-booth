import { database } from "./databases";
import { IOrder } from "./IOrder";
import { IOrderProduct } from "./IOrderProduct";
import { IProduct } from "./IProduct";

export function getOrderByIdModel(orderId: string): IOrder {
  return <IOrder>database.prepare("select * from orders where id = ?").get(orderId);
}

export function getAllOrdersModel(): IOrder[] {
  return <IOrder[]>database.prepare("select * from orders;").all();
}

export function createOrderModel(order: IOrder) {
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
  return getOrderByIdModel(order.id!);
}

export function updateOrderModel(order: IOrder, orderId: string): void {
  database.prepare(
    "update orders set updatedAt = ? where id = ?",
  ).run(order.updatedAt, orderId);
}

export function updateOrderProductModel(orderProduct: Omit<IOrderProduct, "quantity" | "createdAt" | "priceProduct" | "discountProduct" | "vendorShippingCost" | "vendorShippingFreeFrom">): void {
  let sqlString = "update orderProduct set";
  Object.entries(orderProduct).forEach(([key, value]) => {
    if (value !== undefined) {
      sqlString += ` ${key} = \'${value}\',`;
    }
  });
  sqlString = sqlString.slice(0, -1);
  sqlString += ` where orderId = '${orderProduct.orderId}' and productId ='${orderProduct.productId}';`;
  database.prepare(sqlString).run();
}

export function getAllOrdersByUserIdModel(id: string): IOrder[] {
  return <IOrder[]>database.prepare("select * from orders where userId = ?").all(id);
}

export function getAllOrdersWithVendorProductsModel(vendorId: string): IOrder[] {
  return <IOrder[]>database
    .prepare(
      "select distinct orders.id, orders.userId, orders.price, orders.createdAt, orders.updatedAt " +
      "from orders join orderProduct on orders.id = orderProduct.orderId join product on orderProduct.productId = product.id " +
      "where product.vendorId = ?;",
    )
    .all(vendorId);
}

export function getStatusOfOrderModel(orderId: string, productId: string): IOrderProduct {
  return <IOrderProduct>database.prepare("select quantity, delivered, paid, priceProduct, discountProduct, vendorShippingCost, vendorShippingFreeFrom" +
    " from orderProduct where orderId = ? and productId = ?").get(orderId, productId);
}

export function createOrderProductEntityModel(orderProduct: IOrderProduct) {
  let isDeliveredNumeric = orderProduct.delivered ? 1 : 0;
  let isPaidNumeric = orderProduct.paid ? 1 : 0;
  console.log(orderProduct);
  database
    .prepare(
      "insert into orderProduct " +
      "(orderId, productId, quantity, delivered, paid, createdAt, updatedAt, priceProduct, discountProduct, vendorShippingCost, vendorShippingFreeFrom) " +
      "values " +
      "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    ).run(orderProduct.orderId, orderProduct.productId, orderProduct.quantity, isDeliveredNumeric, isPaidNumeric,
    orderProduct.createdAt, orderProduct.updatedAt, orderProduct.priceProduct, orderProduct.discountProduct,
    orderProduct.vendorShippingCost, orderProduct.vendorShippingFreeFrom);
}

export function getProductsOfOrderModel(orderId: string): IProduct[] {
  return <IProduct[]>database
    .prepare(
      /*"select product.*, orderProduct.quantity, orderProduct.delivered, orderProduct.paid " +
      "from orders " +
      "join orderProduct on orders.id = orderProduct.OrderId " +
      "join product on orderProduct.productId = product.id " +
      "where orders.id = ?;",*/
      "select product.* " +
      "from orders " +
      "join orderProduct on orders.id = orderProduct.OrderId " +
      "join product on orderProduct.productId = product.id " +
      "where orders.id = ?;",
    )
    .all(orderId);
}

export function checkIfProductIsInOrderModel(productId: string, orderId: string): IProduct {
  return <IProduct>database
    .prepare(
      "select product.* " +
      "from orders " +
      "join orderProduct on orders.id = orderProduct.OrderId " +
      "join product on orderProduct.productId = product.id " +
      "where orders.id = ? and product.id = ?;",
    )
    .get(orderId, productId);
}


export function getProductsOfOrderVendorModel(orderId: string, vendorId: string): IProduct[] {
  return <IProduct[]>database
    .prepare(
      "select product.* " +
      "from orders " +
      "join orderProduct on orders.id = orderProduct.OrderId " +
      "join product on orderProduct.productId = product.id " +
      "where orders.id = ? and product.vendorId = ?;",
    )
    .all(orderId, vendorId);
}
