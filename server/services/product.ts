import { IProduct } from "../models/IProduct";
import {
  createArticle,
  deleteArticleById,
  getAllArticles, getAllVendorProducts,
  getArticleById,
  updateArticleById,
} from "../models/product";
import { getUserById } from "../models/user";
import { v4 as uuidv4 } from "uuid";
import {
  BicFormatError,
  IsVendorFormatError,
  UserNameFormatError,
} from "../util/customUserErrors";
import {
  ProductCategoryFormatError,
  ProductDescriptionFormatError,
  ProductDiscountFormatError,
  ProductInventoryFormatError,
  ProductIsVisibleFormatError, ProductNameFormatError, ProductNotExistingError,
  ProductPriceFormatError,
} from "../util/customProductErrors";

export function articleById(reqParams: any) {
  let productId = reqParams.productId;
  if (getArticleById(productId) !== undefined) {
    let product: any = getArticleById(productId);
    let vendorInfo: any = getUserById(product.vendorId);
    const combinedProduct = {
      ...product,
      vendor: vendorInfo,
    };
    return combinedProduct;
  } else {
    throw new ProductNotExistingError();
  }
}

export function allArticles() {
  let products: any[] = getAllArticles();
  let productsNew = [];

  for (const product of products) {
    let vendorInfo: any = getUserById(product.vendorId);
    const combinedProduct = {
      ...product,
      vendor: vendorInfo,
    };
    productsNew.push(combinedProduct);
  }
  return productsNew;
}

export function allVendorProducts(reqQuery: any) {
  let vendorId = reqQuery["vendorId"];
  let products: any[] = getAllVendorProducts(vendorId);
  let productsNew = [];

  for (const product of products) {
    let vendorInfo: any = getUserById(vendorId);
    const combinedProduct = {
      ...product,
      vendor: vendorInfo,
    };
    productsNew.push(combinedProduct);
  }
  return productsNew;
}

export function addArticle(reqBody: any) {
  const currentTimestamp = new Date().toISOString();
  console.log(reqBody)
  let product: IProduct = {
    id: uuidv4(),
    name: reqBody.name ? validateName(reqBody.name) : (() => {
      throw new ProductNameFormatError();
    })(),
    description: reqBody.description ? validateDescription(reqBody.description) : (() => {
      throw new ProductDescriptionFormatError();
    })(),
    category: reqBody.category ? validateCategory(reqBody.category) : (() => {
      throw new ProductCategoryFormatError();
    })(),
    discount: reqBody.discount !== undefined ? validateDiscount(reqBody.discount) : (() => {
      throw new ProductDiscountFormatError();
    })(),
    price: reqBody.price ? validatePrice(reqBody.price) : (() => {
      throw new ProductPriceFormatError();
    })(),
    vendorId: reqBody.vendorId ? validateVendorId(reqBody.vendorId) : (() => {
      throw new IsVendorFormatError();
    })(),
    purchases: 0,
    inventory: reqBody.inventory ? validateInventory(reqBody.inventory) : (() => {
      throw new ProductInventoryFormatError();
    })(),
    isVisible: reqBody.isVisible.toString() ? validateIsVisible(reqBody.isVisible) : (() => {
      throw new ProductIsVisibleFormatError();
    })(),
    createdAt: currentTimestamp,
    updatedAt: currentTimestamp,
  };
  return createArticle(product);
}

export function updateArticle(reqParams: any, reqBody: any) {

  let productId = reqParams.productId;
  if (!getArticleById(productId)) {
    throw new ProductNotExistingError();
  }
  const currentTimestamp = new Date().toISOString();
  let product: Omit<IProduct, "id" | "createdAt" | "purchases"> = {
    name: reqBody.name !== undefined ? validateName(reqBody.name) : undefined,
    description: reqBody.description !== undefined ? validateDescription(reqBody.description) : undefined,
    category: reqBody.category !== undefined ? validateCategory(reqBody.category) : undefined,
    discount: reqBody.discount !== undefined ? validateDiscount(reqBody.discount) : undefined,
    price: reqBody.price !== undefined ? validatePrice(reqBody.price) : undefined,
    vendorId: reqBody.vendorId !== undefined ? validateVendorId(reqBody.vendorId) : undefined,
    inventory: reqBody.inventory !== undefined ? validateInventory(reqBody.inventory) : undefined,
    isVisible: reqBody.isVisible !== undefined ? validateIsVisible(reqBody.isVisible) : undefined,
    updatedAt: currentTimestamp,
  };
  return updateArticleById(product, productId);
}

export function deleteArticle(reqParams: any) {
  let productId = reqParams.productId;
  if (getArticleById(productId) !== undefined) {
    deleteArticleById(productId);
  } else {
    throw new ProductNotExistingError();
  }
}

function validateName(name: any): string {
  if (name.length > 255 || name.length < 1) {
    throw new ProductNameFormatError();
  }
  return name;
}

function validateDescription(description: any): string {
  if (description.length > 300 || description.length < 1) {
    throw new ProductDescriptionFormatError();
  }
  return description;
}

function validateCategory(category: any): string {
  if (category.length > 36 || category.length < 1) {
    throw new ProductCategoryFormatError();
  }
  return category;
}

function validateDiscount(discount: any): number {
  console.log("ddfd")
  console.log(discount)
  if (typeof discount !== "number" && !checkForTwoDecimalPlaces(discount)) {
    throw new ProductDiscountFormatError() ;
  }
  return discount;
}

function validatePrice(price: any): number {
  if (typeof price !== "number" && !checkForTwoDecimalPlaces(price)) {
    throw new ProductPriceFormatError() ;
  }
  return price;
}

function validateVendorId(vendorId: any): string {
  if (getUserById(vendorId) === undefined) {
    throw new IsVendorFormatError();
  }
  return vendorId;
}

function checkForTwoDecimalPlaces(value: number): boolean {
  const decimalRegex = /^\d+(\.\d+)?$/;
  return decimalRegex.test(value.toString());
}

function validateInventory(inventory: any): number {
  if (typeof inventory !== "number") {
    throw new ProductInventoryFormatError() ;
  }
  return inventory;
}

function validateIsVisible(isVisible: any): boolean {
  if (typeof isVisible !== "boolean") {
    throw new ProductIsVisibleFormatError();
  }
  return isVisible;
}

