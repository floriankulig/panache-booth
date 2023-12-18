import { Product } from "../models";

export const getDiscountedPrice = (product: Product) => {
  const { price, discount } = product;
  const newPricePercentage = 1 - discount;
  return price * newPricePercentage;
};
