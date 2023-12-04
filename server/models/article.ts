import { database } from "./databases";
import { IArticle } from "./IArticle";
import {v4 as uuidv4 } from "uuid";

export function getArticleById(id: string) {
  try {
    let article = database.prepare("select * from article where id = ?").get(id);
    if (article != undefined) {
      // @ts-ignore
      article["isVisible"] = article["isVisible"] !== 0;
      return article;
    }
    else {
      return undefined;
    }
  } catch (e: unknown) {
    return e;
  }
}

export function getAllArticles()  {
  let articles = database.prepare("select * from article;").all();

  articles.forEach((key) => {
    // @ts-ignore
    key["isVisible"] = key["isVisible"] !== 0;
  });
  return articles;
}

export function createArticle(article: IArticle) {
  article.id = uuidv4();
  const currentTimestamp = new Date().toISOString();
  article.createdAt = currentTimestamp;
  article.updatedAt = currentTimestamp;

  let isArticleVisble = null;
  if (article.isVisible) {
    isArticleVisble = 1;
  } else {
    isArticleVisble = 0;
  }

  const stmt = database.prepare(
    "insert into article " +
    "(id, name, description, category, coupon, price, vendorId, purchases, " +
    "inventory, isVisible, createdAt, updatedAt) " +
    "values " +
    "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  )

  const info = stmt.run(
    article.id, article.name, article.description, article.category, article.coupon,
    article.price, article.vendorId, article.purchases, article.inventory,
    isArticleVisble, article.createdAt, article.updatedAt
  )
  return getArticleById(article.id);
}

export function updateArticleById(articleChanges: Map<string, string>, id: string) {
  let sqlString = "update article set";

  articleChanges.forEach((value: string, key: string) => {
    if (key === "isVisible") {
      if (value === "true") {
        sqlString += ` ${key} = '1',`;
      } else {
        sqlString += ` ${key} = '0',`;
      }
    } else {
      sqlString += ` ${key} = \'${value}\',`;
    }
  });

  const currentTimestamp = new Date().toISOString();
  sqlString += `updatedAt = '${currentTimestamp}' where id = '${id}';`;
  database.prepare(sqlString).run();
  return getArticleById(id)
}

export function deleteArticleById(id: string) {
  return database.prepare("delete from article where id = ?").run(id);
}