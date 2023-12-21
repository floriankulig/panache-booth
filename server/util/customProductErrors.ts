export class ProductError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ProductNotExistingError extends ProductError {
  constructor() {
    super("Product is not existing!");
    this.name = "ProductNotExisting";
  }
}

export class ProductNameFormatError extends ProductError {
  constructor() {
    super("Name format is wrong!");
    this.name = "ProductNameFormatError";
  }
}

export class ProductOutOfStockError extends ProductError {
  constructor() {
    super("Product is out of stock!");
    this.name = "ProductOutOfStockError";
  }
}

export class ProductDescriptionFormatError extends ProductError {
  constructor() {
    super("Description format is wrong!");
    this.name = "ProductDescriptionFormatError";
  }
}

export class ProductCategoryFormatError extends ProductError {
  constructor() {
    super("Category format is wrong!");
    this.name = "ProductCategoryFormatError";
  }
}

export class ProductDiscountFormatError extends ProductError {
  constructor() {
    super("Discount format is wrong!");
    this.name = "ProductDiscountFormatError";
  }
}

export class ProductPriceFormatError extends ProductError {
  constructor() {
    super("Price format is wrong!");
    this.name = "InvalidLoginError";
  }
}

export class ProductVendorIdFormatError extends ProductError {
  constructor() {
    super("VendorId format is wrong!");
    this.name = "ProductVendorIdFormatError";
  }
}

export class ProductInventoryFormatError extends ProductError {
  constructor() {
    super("Inventory format is wrong!");
    this.name = "ProductInventoryFormatError";
  }
}

export class ProductIsVisibleFormatError extends ProductError {
  constructor() {
    super("IsVisible format is wrong!");
    this.name = "ProductIsVisibleFormatError";
  }
}