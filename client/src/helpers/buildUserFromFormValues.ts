import { FormGroup } from "@angular/forms";
import { RegisterUser } from "../models";

export const buildUserFromFormValues = (
  steps: FormGroup[],
  formType = "customer",
) => {
  const { username, email, password } = steps[0].value as {
    [key: string]: string;
  };
  const { postcode, houseNumber, ...address } = steps[1].value;
  const { shippingCost, shippingFreeFrom, ...paymentInformation } =
    steps[2].value;

  const user: RegisterUser = {
    userName: username,
    email,
    password,
    houseNumber: houseNumber.toString(),
    postcode: postcode.toString(),
    ...address,
    isVendor: formType === "vendor",
    ...paymentInformation,
    shippingCost: shippingCost ? shippingCost.toString() : "0",
    shippingFreeFrom: shippingFreeFrom ? shippingFreeFrom.toString() : "-1",
  };

  return user;
};
