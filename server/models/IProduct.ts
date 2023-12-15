export interface IProduct {
  id?: string;
  name: string;
  description: string;
  category: string;
  discount: number;
  price: number;
  vendorId: string;
  purchases: number;
  inventory: number;
  isVisible: number;
  createdAt?: string;
  updatedAt?: string;
}
