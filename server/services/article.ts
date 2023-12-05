import { IArticle } from "../models/IArticle";
import { createArticle, deleteArticleById, getAllArticles, getArticleById, updateArticleById } from "../models/article";

export function articleById(id: string){
  return getArticleById(id);
}

export function allArticles(){
  return getAllArticles();
}

export function addArticle(article: IArticle){
  return createArticle(article);
}

export function updateArticle(userChanges: Map<string, string>, id: string){
  return updateArticleById(userChanges, id);
}

export function deleteArticle(id: string){
  return deleteArticleById(id);
}