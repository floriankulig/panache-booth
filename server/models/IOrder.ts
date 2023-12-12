export interface IOrder {
  id?: string;
  userId: string;
  vendorId: string;
  productId: string;
  price: number;
  numberOfPurchases: number;
  delivered: boolean;
  createdAt?: string;
  updatedAt?: string;
}
