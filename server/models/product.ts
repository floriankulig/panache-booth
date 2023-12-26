import { database } from "./databases";
import { IProduct } from "./IProduct";

export function getProductById(id: string) {
  let product: any = database
    .prepare("select * from product where id = ? and archived = 0")
    .get(id);
  if (product != undefined) {
    product["isVisible"] = product["isVisible"] !== 0;
    return product;
  }
}

export function getAllProducts() {
  let products = database.prepare("select * from product where archived = 0;").all();
  products.forEach((key: any) => {
    key["isVisible"] = key["isVisible"] !== 0;
  });
  return products;
}

export function getAllVendorProducts(id: string) {
  let products = database.prepare("select * from product where vendorId = ? and archived = 0").all(id);
  products.forEach((key: any) => {
    key["isVisible"] = key["isVisible"] !== 0;
  });
  return products;
}

export function createProduct(product: IProduct) {
  let isVisibleNumeric = product.isVisible ? 1 : 0;

  const sql = database.prepare(
    "insert into product " +
    "(id, name, description, category, discount, price, vendorId, purchases, " +
    "inventory, isVisible, createdAt, updatedAt) " +
    "values " +
    "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
  );

  const info = sql.run(
    product.id,
    product.name,
    product.description,
    product.category,
    product.discount,
    product.price,
    product.vendorId,
    product.purchases,
    product.inventory,
    isVisibleNumeric,
    product.createdAt,
    product.updatedAt,
  );
  return getProductById(product.id);
}

export function updateProductById(
  product: Omit<IProduct, "id" | "createdAt" | "purchases">,
  id: string,
) {
  let isVisibleNumeric = product.isVisible ? 1 : 0;
  let sqlString = "update product set";

  type test<T> = [keyof T, T[keyof T]];
  for (const [key, value] of Object.entries(product) as test<IProduct>[]) {
    if (value !== undefined) {
      if (key === "isVisible") {
        sqlString += ` isVisible = ${isVisibleNumeric},`;
      } else {
        sqlString += ` ${key} = \'${value}\',`;
      }
    }
  }
  sqlString = sqlString.slice(0, -1);
  sqlString += ` where id = '${id}';`;
  database.prepare(sqlString).run();
  return getProductById(id);
}

export function updateInventoryAndPurchases(productId: string, purchases: number) {
  let productData: any = getInventoryAndPurchases(productId);
  let inventoryNew = productData.inventory - purchases;
  let purchasesNew = productData.purchases + purchases;
  database.prepare(`update product
                    set inventory = ${inventoryNew},
                        purchases = ${purchasesNew}
                    where id = '${productId}';`).run();
}

export function deleteProductById(id: string) {
  database.prepare("update product set archived = 1 where id = ?").run(id);
}

export function getPriceOfProduct(productId: string) {
  return database.prepare("select price from product where id = ? and archived = 0;").get(productId);
}

export function getDiscountOfProduct(productId: string) {
  return database.prepare("select discount from product where id = ? and archived = 0;").get(productId);
}

function getInventoryAndPurchases(productId: string) {
  return database.prepare("select inventory, purchases from product where id = ? and archived = 0;").get(productId);
}

