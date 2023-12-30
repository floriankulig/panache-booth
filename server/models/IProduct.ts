import { IUser } from "./IUser";

export interface IProduct {
  id: string | undefined;
  name: string | undefined;
  description: string | undefined;
  category: string | undefined;
  discount: number | undefined;
  price: number | undefined;
  vendorId: string | undefined;
  purchases: number | undefined;
  inventory: number | undefined;
  isVisible: boolean | number | undefined;
  archived: boolean | number | undefined;
  createdAt: string | undefined;
  updatedAt: string;
  vendor?: IUser;
  quantity?: number,
  delivered?: boolean | number | undefined;
  paid?: boolean | number | undefined;
}
