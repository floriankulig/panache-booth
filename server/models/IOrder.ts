import { IProduct } from "./IProduct";

export interface IOrder {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  price: number;
}
