export interface IProduct {
  id?: string;
  name: string;
  description: string;
  category: string;
  coupon: string;
  price: number;
  vendorId: string;
  purchases: number;
  inventory: number;
  isVisible: number;
  createdAt?: string;
  updatedAt?: string;
}
