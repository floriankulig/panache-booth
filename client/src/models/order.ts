import { CartProduct, OrderProduct } from "./product";
import { User } from "./user";

interface Order {
  createdAt: string;
  updatedAt: string;
  userId: string;
  user?: User;
  price: number;
  id: string;
  products: OrderProduct[];
}

interface CartOrder
  extends Omit<Order, "id" | "createdAt" | "updatedAt" | "products" | "user"> {
  products: CartProduct[];
}

export { Order, CartOrder };
