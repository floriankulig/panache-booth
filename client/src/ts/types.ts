import { CATEGORIES } from "./constants";

type Category = (typeof CATEGORIES)[number];

interface Product {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  price: number;
  description: string;
  categories: Category;
  vendorId: string;
  purchases: number;
  stock: number;
  isVisible: boolean;
  discount: number; // 0.0 - 1.0
}

interface User {
  id: string;
  userName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  isVendor: boolean;
  iban?: string;
  bic?: string;
  street: string;
  houseNumber: string;
  postcode: string;
  city: string;
  shippingCost?: string;
  shippingFreeFrom?: string;
}

interface Order {
  createdAt: string;
  updatedAt: string;
  amount: number;
  id: string;
  products: Product[];
}

export { Product, User, Order };
