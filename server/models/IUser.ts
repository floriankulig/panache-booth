export interface IUser {
  userId?: string;
  userName: string;
  email: string;
  password: string;
  street: string;
  houseNumber: string;
  postcode: string;
  isVendor: boolean;
  city: string;
  iban?: string;
  bic?: string;
  shippingCost?: number;
  shippingFreeFrom?: number;
  createdAt?: string;
  updatedAt?: string;
}
