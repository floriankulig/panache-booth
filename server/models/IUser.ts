export interface IUser {
  userId: string;
  userName: string | undefined;
  email: string | undefined;
  password: string | undefined;
  street: string | undefined;
  houseNumber: string | undefined;
  postcode: string | undefined;
  isVendor: boolean | undefined;
  city: string | undefined;
  iban?: string;
  bic?: string;
  shippingCost?: number;
  shippingFreeFrom?: number;
  createdAt: string;
  updatedAt: string;
}
