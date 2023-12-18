interface User {
  id: string;
  userName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  isVendor: boolean;
  street: string;
  houseNumber: string;
  postcode: string;
  city: string;
  iban?: string;
  bic?: string;
  shippingCost?: number;
  shippingFreeFrom?: number;
}
interface RegisterUser
  extends Omit<User, "id" | "createdAt" | "updatedAt" | "address"> {
  password: string;
  houseNumber: string;
  street: string;
  postcode: string;
  city: string;
}

export { User, RegisterUser };
