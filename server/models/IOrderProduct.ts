export interface IOrderProduct {
  orderId: string;
  productId: string;
  quantity: number;
  delivered: boolean;
  updatedAt: string;
  createdAt: string;
  priceProduct: number;
  discountProduct: number;
  vendorShippingCost: number;
  vendorShippingFreeFrom: number;
}
