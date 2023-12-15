import { FormGroup } from "@angular/forms";
import { FormProduct } from "../app/services";
import { CategoryID, Product } from "../ts";

export const buildProductFromFormValues = (
  formValues: FormGroup,
  isVisible: boolean = true,
): Omit<FormProduct, "vendorId"> => {
  const product = {
    ...(formValues.value as Pick<
      Product,
      "name" | "price" | "description" | "discount" | "inventory"
    >),
    discount: formValues.value.discount / 100,
    category: "electronics" as CategoryID,
    purchases: 0,
    isVisible,
  };

  return product;
};
