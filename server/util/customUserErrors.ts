export class UserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class InvalidLoginError extends UserError {
  constructor() {
    super("Email or password incorrect!");
    this.name = "InvalidLoginError";
  }
}

export class UserNotExistingError extends UserError {
  constructor() {
    super("User is not existing!");
    this.name = "UserNotExistingError"
  }
}

export class UserIsNoVendorError extends UserError {
  constructor() {
    super("User is not a vendor!");
    this.name = "UserIsNoVendorError"
  }
}

export class ShippingCostFormatError extends UserError {
  constructor() {
    super("Shippingcost format is wrong!");
    this.name = "ShippingCostFormatError"
  }
}

export class ShippingFreeFromFormatError extends UserError {
  constructor() {
    super("ShippingFreeFrom format is wrong!");
    this.name = "ShippingFreeFromFormatError"
  }
}

export class IbanFormatError extends UserError {
  constructor() {
    super("IBAN format is wrong!");
    this.name = "IbanFormatError"
  }
}

export class BicFormatError extends UserError {
  constructor() {
    super("BIC format is wrong!");
    this.name = "BicFormatError"
  }
}

export class UserNameFormatError extends UserError {
  constructor() {
    super("Username format is wrong!");
    this.name = "UserNameFormatError"
  }
}

export class EmailFormatError extends UserError {
  constructor() {
    super("Email format is wrong!");
    this.name = "EmailFormatError"
  }
}

export class StreetFormatError extends UserError {
  constructor() {
    super("Street format is wrong!");
    this.name = "StreetFormatError"
  }
}

export class HouseNumberFormatError extends UserError {
  constructor() {
    super("Housenumber format is wrong!");
    this.name = "HouseNumberFormatError"
  }
}

export class PostcodeFormatError extends UserError {
  constructor() {
    super("Postcode format is wrong!");
    this.name = "PostcodeFormatError"
  }
}

export class IsVendorFormatError extends UserError {
  constructor() {
    super("IsVendor format is wrong!");
    this.name = "IsVendorFormatError"
  }
}

export class CityFormatError extends UserError {
  constructor() {
    super("City format is wrong!");
    this.name = "CityFormatError"
  }
}

export class PasswordFormatError extends UserError {
  constructor() {
    super("Password format is wrong!");
    this.name = "PasswordFormatError"
  }
}





