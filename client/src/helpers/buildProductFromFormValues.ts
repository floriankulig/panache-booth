import { FormGroup } from "@angular/forms";
import { FormProduct, CategoryID, Product } from "../models";

export const buildProductFromFormValues = (
  formValues: FormGroup,
  isVisible: boolean = true,
): FormProduct => {
  const product: FormProduct = {
    ...(formValues.value as Pick<
      Product,
      "name" | "description" | "discount" | "inventory" | "category"
    >),
    discount: Number((formValues.value.discount / 100).toFixed(2)),
    price: Number(formValues.value.price.toFixed(2)),
    isVisible,
  };

  console.log(product);

  return product;
};
