export interface IProduct {
  id: string;
  name: string | undefined;
  description: string | undefined;
  category: string | undefined;
  discount: number | undefined;
  price: number | undefined;
  vendorId: string | undefined;
  purchases: number | undefined;
  inventory: number | undefined;
  isVisible: boolean | undefined;
  createdAt?: string;
  updatedAt?: string;
}
