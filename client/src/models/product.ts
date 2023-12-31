import { CATEGORIES } from "./constants";
import { User } from "./user";

type Category = (typeof CATEGORIES)[number];
type CategoryID = (typeof CATEGORIES)[number]["id"];

interface Product {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  price: number;
  description: string;
  category: CategoryID;
  purchases: number;
  inventory: number;
  isVisible: boolean;
  archived: boolean;
  vendor: User;
  vendorId: string;
  discount: number; // 0.0 - 1.0
}

interface APIProduct extends Omit<Product, "category"> {
  category: CategoryID;
}

type FormProduct = Omit<
  APIProduct,
  | "id"
  | "createdAt"
  | "updatedAt"
  | "purchases"
  | "vendor"
  | "vendorId"
  | "archived"
>;

interface CartProduct extends Product {
  quantity: number;
}

interface OrderProduct extends CartProduct {
  delivered: boolean;
  paid: boolean;
}

export type { Category, CategoryID, FormProduct };
export { Product, APIProduct, CartProduct, OrderProduct };
