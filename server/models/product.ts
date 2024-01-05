import { database } from "./databases";
import { IProduct } from "./IProduct";

export function getProductByIdModel(productId: string, fromOrders: boolean = false): IProduct {
  if (fromOrders) {
    return <IProduct>database.prepare("select * from product where id = ?").get(productId);
  } else {
    return <IProduct>database.prepare("select * from product where id = ? and archived = 0").get(productId);
  }

}

export function getAllProductsModel(fromOrders: boolean = false): IProduct[] {
  if (fromOrders) {
    return <IProduct[]>database.prepare("select * from product;").all();
  } else {
    return <IProduct[]>database.prepare("select * from product where archived = 0;").all();
  }

}

export function getAllVendorProductsModel(productId: string, fromOrders: boolean = false): IProduct[] {
  if (fromOrders) {
    return <IProduct[]>database.prepare("select * from product where vendorId = ?").all(productId);
  } else {
    return <IProduct[]>database.prepare("select * from product where vendorId = ? and archived = 0").all(productId);
  }

}

export function getProductByProductIdAndUserId(userId: string, prodcutId: string): IProduct {
  return <IProduct>database.prepare("select * from product where vendorId = ? and id = ? and archived = 0;").get(userId, prodcutId);
}

export function createProductModel(product: IProduct): void {
  database.prepare(
    "insert into product " +
    "(id, name, description, category, discount, price, vendorId, purchases, " +
    "inventory, isVisible, archived, createdAt, updatedAt) " +
    "values " +
    "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
  ).run(
    product.id, product.name, product.description, product.category, product.discount,
    product.price, product.vendorId, product.purchases, product.inventory, product.isVisible,
    product.archived, product.createdAt, product.updatedAt,
  );
}

export function updateProductByIdModel(productId: string, product: IProduct): void {
  let sqlString = "update product set";
  Object.entries(product).forEach(([key, value]) => {
    if (value !== undefined && key !== "productId" && key !== "purchases" && key !== "createdAt") {
      sqlString += ` ${key} = \'${value}\',`;
    }
  });
  sqlString = sqlString.slice(0, -1);
  sqlString += ` where id = '${productId}';`;
  console.log(sqlString);
  database.prepare(sqlString).run();
}

export function updateInventoryAndPurchasesModel(productId: string, purchases: number) {
  let productData: any = getInventoryAndPurchasesModel(productId);
  let inventoryNew = productData.inventory - purchases;
  let purchasesNew = productData.purchases + purchases;
  database.prepare(`update product
                    set inventory = ${inventoryNew},
                        purchases = ${purchasesNew}
                    where id = '${productId}';`).run();
}

export function deleteProductByIdModel(id: string) {
  database.prepare("update product set archived = 1 where id = ?").run(id);
}

export function getPriceOfProductModel(productId: string) {
  return database.prepare("select price from product where id = ? and archived = 0;").get(productId);
}

export function getDiscountOfProductModel(productId: string) {
  return database.prepare("select discount from product where id = ? and archived = 0;").get(productId);
}

function getInventoryAndPurchasesModel(productId: string) {
  return database.prepare("select inventory, purchases from product where id = ? and archived = 0;").get(productId);
}

