import { CATEGORIES } from "./constants";

type Category = (typeof CATEGORIES)[number];

interface Product {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  price: number;
  description: string;
  categories: Category[];
  vendorId: string;
  salesVolume: number;
  stock: number;
  isVisible: boolean;
  discount: number; // 0.0 - 1.0
}

interface User {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  isVendor: boolean;
  iban?: string;
  bic?: string;
  address: Address;
  shippingCost?: number;
  shippingFreeFrom?: number;
}

interface Address {
  street: string;
  houseNumber: string;
  postcode: string;
  city: string;
}

export { Product, User, Address };
