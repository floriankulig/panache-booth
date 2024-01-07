interface User {
  id: string;
  userName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  isVendor: boolean;
  archived: boolean;
  street: string;
  houseNumber: string;
  postcode: string;
  city: string;
  iban?: string;
  bic?: string;
  shippingCost: number;
  shippingFreeFrom: number;
}
interface RegisterUser
  extends Omit<User, "id" | "createdAt" | "updatedAt" | "archived"> {
  password: string;
}

export { User, RegisterUser };
