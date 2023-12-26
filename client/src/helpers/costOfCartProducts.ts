import { CartProduct, OrderProduct } from "../models";
import { getDiscountedPrice } from "./getDiscountedPrice";

export const costOfCartProducts = (
  products: Array<CartProduct | OrderProduct>,
  discounted = true,
): number => {
  return products.reduce((total, product) => {
    const productPrice = discounted
      ? getDiscountedPrice(product)
      : product.price;
    return total + productPrice * product.quantity;
  }, 0);
};
