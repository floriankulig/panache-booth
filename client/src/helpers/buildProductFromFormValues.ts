import { FormGroup } from "@angular/forms";
import { FormProduct, CategoryID, Product } from "../models";

export const buildProductFromFormValues = (
  formValues: FormGroup,
  isVisible: boolean = true,
): FormProduct => {
  const product: FormProduct = {
    ...(formValues.value as Pick<
      Product,
      "name" | "price" | "description" | "discount" | "inventory"
    >),
    discount: formValues.value.discount / 100,
    category: "electronics" as CategoryID,
    isVisible,
  };
  return product;
};
