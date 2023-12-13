import { IProduct } from "../models/IProduct";
import {
  createArticle,
  deleteArticleById,
  getAllArticles,
  getArticleById,
  updateArticleById
} from "../models/product";

export function articleById(id: string) {
  return getArticleById(id);
}

export function allArticles() {
  return getAllArticles();
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
