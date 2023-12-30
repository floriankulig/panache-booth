export interface IOrderProduct {
  orderId: string | undefined;
  productId: string | undefined;
  quantity: number | undefined;
  delivered: boolean | number | undefined;
  paid: boolean | number | undefined;
  updatedAt: string;
  createdAt: string | undefined;
  priceProduct: number | undefined;
  discountProduct: number | undefined;
  vendorShippingCost: number | undefined;
  vendorShippingFreeFrom: number | undefined;
}
