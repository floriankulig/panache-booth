import { database } from "./databases";
import { IProduct } from "./IProduct";
import { v4 as uuidv4 } from "uuid";

export function getArticleById(id: string) {
  try {
    let product = database
      .prepare("select * from product where id = ?")
      .get(id);
    if (product != undefined) {
      // @ts-ignore
      product["isVisible"] = product["isVisible"] !== 0;
      return product;
    } else {
      return undefined;
    }
  } catch (e: unknown) {
    return e;
  }
}

export function getAllArticles() {
  let products = database.prepare("select * from product;").all();

  products.forEach((key) => {
    // @ts-ignore
    key["isVisible"] = key["isVisible"] !== 0;
  });
  return products;
}

export function createArticle(product: IProduct) {
  product.id = uuidv4();
  const currentTimestamp = new Date().toISOString();
  product.createdAt = currentTimestamp;
  product.updatedAt = currentTimestamp;

  let isArticleVisble = null;
  if (product.isVisible) {
    isArticleVisble = 1;
  } else {
    isArticleVisble = 0;
  }

  const stmt = database.prepare(
    "insert into product " +
      "(id, name, description, category, coupon, price, vendorId, purchases, " +
      "inventory, isVisible, createdAt, updatedAt) " +
      "values " +
      "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  );

  const info = stmt.run(
    product.id,
    product.name,
    product.description,
    product.category,
    product.sale,
    product.price,
    product.vendorId,
    product.purchases,
    product.inventory,
    isArticleVisble,
    product.createdAt,
    product.updatedAt
  );
  return getArticleById(product.id);
}

export function updateArticleById(
  articleChanges: Map<string, string>,
  id: string
) {
  let sqlString = "update product set";

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
  return getArticleById(id);
}

export function deleteArticleById(id: string) {
  return database.prepare("delete from product where id = ?;").run(id);
}
