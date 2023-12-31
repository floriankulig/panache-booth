import Database from "better-sqlite3";
import * as fs from "fs";

const dbDirPath = "./database";
if (!fs.existsSync(dbDirPath)) {
  fs.mkdirSync(dbDirPath);
}
export const database = new Database("./database/webEngineering.db");

const createUserTable =
  "create table if not exists user (" +
  "id varchar(36) not null primary key, " +
  "userName varchar(32) not null, " +
  "email varchar(255) not null unique, " +
  "password varchar(12) not null, " +
  "isVendor boolean not null, " +
  "postcode varchar(5) not null, " +
  "street varchar(255) not null, " +
  "houseNumber varchar(10) not null, " +
  "city varchar(50) not null, " +
  "iban varchar(22), " +
  "bic varchar(11), " +
  "shippingCost decimal(10,2), " +
  "shippingFreeFrom decimal(10,2), " +
  "createdAt varchar(255) not null, " +
  "updatedAt varchar(255) not null, " +
  "archived integer default 0 " +
  ");";

const createProductTable =
  "create table if not exists product (" +
  "id varchar(36) not null primary key, " +
  "name varchar(32) not null, " +
  "description varchar(300) not null, " +
  "category varchar(36), " +
  "discount decimal(3,2), " +
  "price decimal(10,2), " +
  "vendorId varchar(36) not null, " +
  "purchases integer, " +
  "inventory integer not null, " +
  "isVisible integer not null, " +
  "archived integer default 0," +
  "createdAt varchar(255) not null, " +
  "updatedAt varchar(255) not null" +
  ");";

const createOrderTable =
  "create table if not exists orders (" +
  "id varchar(36) not null primary key, " +
  "userId varchar(36), " +
  "price decimal(10,2), " +
  "createdAt varchar(255) not null, " +
  "updatedAt varchar(255) not null);";

const createOrderProductTable =
  "create table if not exists orderProduct (" +
  "orderId varchar(36) not null, " +
  "productId varchar(36) not null, " +
  "quantity integer not null, " +
  "delivered integer not null, " +
  "paid integer not null, " +
  "createdAt varchar(255) not null, " +
  "updatedAt varchar(255) not null, " +
  "priceProduct decimal(10,2) not null, " +
  "discountProduct decimal(3,2) not null, " +
  "vendorShippingCost decimal(10,2) not null, " +
  "vendorShippingFreeFrom decimal(10,2) not null, " +
  "primary key(orderId, productId), " +
  "foreign key(orderId) references orders(id), " +
  "foreign key(productId) references product(id));";

database.exec(createUserTable);
database.exec(createProductTable);
database.exec(createOrderTable);
database.exec(createOrderProductTable);
