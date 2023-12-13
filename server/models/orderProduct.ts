import { database } from "./databases";
import { IOrder } from "./IOrder";
import { IProduct } from "./IProduct";

export function getOrderProductById(orderId: string, productId: string) {
  let orderProduct = database.prepare("select ");
}
