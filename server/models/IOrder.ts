import { IProduct } from "./IProduct";
import { IUser } from "./IUser";

export interface IOrder {
  id: string | undefined;
  createdAt: string | undefined;
  updatedAt: string;
  userId: string | undefined;
  price: number | undefined;
  user?: IUser;
  products?: IProduct[];
}
