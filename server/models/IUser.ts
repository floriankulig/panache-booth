import { IPostalCode } from "./IPostalCode";

export interface IUser {
  userId?: number;
  userName: string;
  email: string;
  password: string;
  street: string;
  houseNumber: string;
  postalCode: string;
  isVendor: boolean;
  //address: IPostalCode;
  city: string;
  iban?: string;
  bic?: string;
  shippingCost?: number;
  shippingFreeForm?: number;
  createdAt?: string;
  updatedAt?: string;
}