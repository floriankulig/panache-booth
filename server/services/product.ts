import { IProduct } from "../models/IProduct";
import {
  createProductModel,
  deleteProductByIdModel,
  getAllProductsModel,
  getAllVendorProductsModel,
  getProductByIdModel, getProductByProductIdAndUserId,
  updateProductByIdModel,
} from "../models/product";
import { getUserByIdModel } from "../models/user";
import { v4 as uuidv4 } from "uuid";
import {
  IsVendorFormatError,
  ShippingCostFormatError, UserIdFormatError,
  UserNameFormatError,
  UserNotExistingError,
} from "../util/customUserErrors";
import {
  ProductArchivedFormatError,
  ProductCategoryFormatError,
  ProductDescriptionFormatError,
  ProductDiscountFormatError,
  ProductInventoryFormatError,
  ProductIsVisibleFormatError,
  ProductNameFormatError,
  ProductNotExistingError,
  ProductPriceFormatError,
} from "../util/customProductErrors";
import { booleanToNumber, numberToBoolean, validateDecimalNumber } from "../util/util";
import { getUserByIdService, getVendorByIdService } from "./user";
import { IUser } from "../models/IUser";

export function getProductByIdService(productId: string): IProduct {
  if (!checkIfProductExistsById(productId)) {
    throw new ProductNotExistingError();
  }
  let product: IProduct = getProductByIdModel(productId);
  return individualProduct(product);
}

export function getAllProductsService(): IProduct[] {
  let products: IProduct[] = getAllProductsModel();
  return multipleProducts(products);
}

export function getAllVendorProductsService(reqQuery: any): IProduct[] {
  let vendorId = reqQuery["vendorId"];
  let products: IProduct[] = getAllVendorProductsModel(vendorId);
  return multipleProducts(products);
}

export function createProductService(reqBody: any): IProduct {
  const createFlag: boolean = true;
  let product: IProduct = buildAndValidateProductModel(reqBody, createFlag);
  createProductModel(product);
  return getProductByIdService(product.id!);
}

export function updateProductService(reqParams: any, reqBody: any): IProduct {
  let productId = reqParams.productId;
  if (!checkIfProductExistsById(productId)) {
    throw new ProductNotExistingError();
  }
  let existingProduct: IProduct = getProductByIdService(productId);
  let createFlag: boolean = false;
  let updatedProduct: IProduct = buildAndValidateProductModel(reqBody, createFlag, existingProduct);
  updateProductByIdModel(productId, updatedProduct);
  return getProductByIdService(productId);
}

export function deleteProductService(reqParams: any): void {
  let productId = reqParams.productId;
  if (checkIfProductExistsById(productId)) {
    deleteProductByIdModel(productId);
  } else {
    throw new ProductNotExistingError();
  }
}

export function checkIfProductExistsById(productId: string): boolean {
  let product: IProduct = getProductByIdModel(productId);
  return product !== undefined;
}

export function checkIsVendorsProduct(userId: string, productId: string): boolean {
  let product: IProduct = getProductByProductIdAndUserId(userId, productId);
  return product !== undefined;
}

function individualProduct(product: IProduct): IProduct {
  if (product === undefined) {
    throw new UserNotExistingError();
  }
  product.isVisible = numberToBoolean(product.isVisible);
  product.archived = numberToBoolean(product.archived);
  return combineVendorWithProduct(product);
}

function combineVendorWithProduct(product: IProduct): IProduct {
  let vendorInfo: IUser = getUserByIdService(product.vendorId!);
  return {
    ...product,
    vendor: vendorInfo,
  };
}

function multipleProducts(products: IProduct[]): IProduct[] {
  let productsWithVendorInfo: IProduct[] = [];
  for (let product of products) {
    product.isVisible = numberToBoolean(product.isVisible);
    product.archived = numberToBoolean(product.archived);
    productsWithVendorInfo.push(combineVendorWithProduct(product));
  }
  return productsWithVendorInfo;
}

function buildAndValidateProductModel(productModelData: any, createFlag: boolean = false, existingProduct?: IProduct): IProduct {
  const currentTimestamp: string = new Date().toISOString();
  return {
    id: createFlag ? uuidv4() : existingProduct?.id,
    name: validateName(productModelData.name, createFlag),
    description: validateDescription(productModelData.description, createFlag),
    category: validateCategory(productModelData.category, createFlag),
    discount: validateDiscount(productModelData.discount, createFlag),
    price: validatePrice(productModelData.price, createFlag),
    vendorId: validateVendorId(productModelData.vendorId, createFlag),
    purchases: createFlag ? 0 : undefined,
    inventory: validateInventory(productModelData.inventory, createFlag),
    isVisible: validateIsVisible(productModelData.isVisible, createFlag),
    archived: createFlag ? 0 : validateArchived(productModelData.archived, createFlag),
    createdAt: createFlag ? currentTimestamp : undefined,
    updatedAt: currentTimestamp,
  };
}

function validateName(name: any, createFlag: boolean): string | undefined {
  if (typeof name !== "string") {
    if (createFlag || name !== undefined) {
      throw new ProductNameFormatError();
    }
    return undefined;
  }
  if (name.length > 32 || name.length < 1) {
    throw new ProductNameFormatError();
  }
  return name;
}

function validateDescription(description: any, createFlag: boolean): string | undefined {
  if (typeof description !== "string") {
    if (createFlag || description !== undefined) {
      throw new ProductDescriptionFormatError();
    }
    return undefined;
  }
  if (description.length > 300 || description.length < 1) {
    throw new ProductDescriptionFormatError();
  }
  return description;
}

function validateCategory(category: any, createFlag: boolean): string | undefined {
  if (typeof category !== "string") {
    if (createFlag || category !== undefined) {
      throw new ProductCategoryFormatError();
    }
    return undefined;
  }
  if (category.length > 36 || category.length < 1) {
    throw new ProductCategoryFormatError();
  }
  return category;
}

function validateDiscount(discount: any, createFlag: boolean): number | undefined {
  if (typeof discount !== "number") {
    if (createFlag || discount !== undefined) {
      throw new ProductDiscountFormatError();
    }
    return undefined;
  }
  const discountRegExp: RegExp = /^(0(\.\d{1,2})?|1(\.0{1,2})?)$/;
  if (!discountRegExp.test(discount.toString())) {
    throw new ProductDiscountFormatError();
  }
  return discount;
}


function validatePrice(price: any, createFlag: boolean): number | undefined {
  if (typeof price !== "number") {
    if (createFlag || price !== undefined) {
      throw new ProductPriceFormatError();
    }
    return undefined;
  }
  if (!validateDecimalNumber(price)) {
    throw new ProductPriceFormatError();
  }
  return price;
}

function validateVendorId(vendorId: any, createFlag: boolean): string | undefined {
  if (!createFlag) {
    return undefined;
  }
  if (typeof vendorId !== "string") {
    throw new UserIdFormatError();
  }
  if (getVendorByIdService(vendorId) === undefined) {
    throw new IsVendorFormatError();
  }
  return vendorId;
}

function validateInventory(inventory: any, createFlag: boolean): number | undefined {
  if (typeof inventory !== "number") {
    if (createFlag || inventory !== undefined) {
      throw new ProductInventoryFormatError();
    }
    return undefined;
  }
  if (inventory < 0) {
    throw new ProductInventoryFormatError() ;
  }
  return inventory;
}

function validateIsVisible(isVisible: any, createFlag: boolean): number | undefined {
  if (typeof isVisible !== "boolean") {
    if (createFlag || isVisible !== undefined) {
      throw new ProductIsVisibleFormatError();
    }
    return undefined;
  }
  return booleanToNumber(isVisible);
}

function validateArchived(archived: any, createFlag: boolean): number | undefined {
  if (typeof archived !== "boolean") {
    if (createFlag || archived !== undefined) {
      throw new ProductArchivedFormatError();
    }
    return undefined;
  }
  return booleanToNumber(archived);
}

