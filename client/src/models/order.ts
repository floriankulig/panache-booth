import { Product } from "./product";

interface Order {
  createdAt: string;
  updatedAt: string;
  amount: number;
  id: string;
  products: Product[];
}

export { Order };
