export class ProductNotExisting extends Error {
  constructor() {
    super("Product is not existing!");
    this.name = "ProductNotExisting"
  }
}