
export class OrderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class OrderNotExistingError extends OrderError {
  constructor() {
    super("Order not existing!");
    this.name = "OrderNotExistingError";
  }
}

export class NoProductsInOrderError extends OrderError {
  constructor() {
    super("No products in order!");
    this.name = "NoProductsInOrderError";
  }
}

export class ProductNotInOrderError extends OrderError {
  constructor() {
    super("Product not in order!");
    this.name = "ProductNotInOrderError";
  }
}

export class InvalidUserError extends OrderError {
  constructor() {
    super("User is invalid!");
    this.name = "InvalidUserError";
  }
}

export class OrderPriceFormatError extends OrderError {
  constructor() {
    super("Price format is wrong!");
    this.name = "OrderPriceFormatError";
  }
}

export class OrderQuantityFormatError extends OrderError {
  constructor() {
    super("Quantity format is wrong!");
    this.name = "OrderQuantityFormatError";
  }
}
