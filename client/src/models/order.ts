import { CartProduct } from "./product";

interface Order {
  createdAt: string;
  updatedAt: string;
  userId: string;
  price: number;
  id: string;
  products: CartProduct[];
}

type CartOrder = Omit<Order, "id" | "createdAt" | "updatedAt">;

export type { CartOrder };
export { Order };
