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
  category: Category;
  purchases: number;
  inventory: number;
  isVisible: boolean;
  vendor: User;
  discount: number; // 0.0 - 1.0
}

interface APIProduct extends Omit<Product, "category" | "vendor"> {
  category: CategoryID;
  vendorId: string;
}

type FormProduct = Omit<APIProduct, "id" | "createdAt" | "updatedAt">;

export type { Category, CategoryID, FormProduct };
export { Product, APIProduct };