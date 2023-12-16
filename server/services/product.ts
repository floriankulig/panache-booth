import { IProduct } from "../models/IProduct";
import {
  createArticle,
  deleteArticleById,
  getAllArticles, getAllVendorProducts,
  getArticleById,
  updateArticleById,
} from "../models/product";
import { getUserById } from "../models/user";

export function articleById(id: string) {
  let product: any = getArticleById(id);

  let vendorInfo: any = getUserById(product.vendorId)
  console.log(vendorInfo)
  const combinedProduct = {
    ...product,
    vendor: vendorInfo
  }

  return combinedProduct;
}

export function allArticles() {
  let products: any[] = getAllArticles();
  let productsNew = [];

  for (const product of products) {
    let vendorInfo: any = getUserById(product.vendorId)
    console.log(vendorInfo)
    const combinedProduct = {
      ...product,
      vendor: vendorInfo
    }
    productsNew.push(combinedProduct);
  }


  return productsNew;
}

export function allVendorProducts(id: string) {
  let products: any[] = getAllVendorProducts(id)
  let productsNew = [];

  for (const product of products) {
    let vendorInfo: any = getUserById(id)
    console.log(vendorInfo)
    const combinedProduct = {
      ...product,
      vendor: vendorInfo
    }
    productsNew.push(combinedProduct);
  }


  return productsNew;
}

export function addArticle(product: IProduct) {

  return createArticle(product);
}

export function updateArticle(userChanges: Map<string, string>, id: string) {
  return updateArticleById(userChanges, id);
}

export function deleteArticle(id: string) {
  return deleteArticleById(id);
}
