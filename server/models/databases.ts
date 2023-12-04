import Database from "better-sqlite3";

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
  "updatedAt varchar(255) not null " +
  ");";

const createArticleTable =
  "create table if not exists article (" +
  "id varchar(36) not null primary key, " +
  "name varchar(255) not null, " +
  "description varchar(200), " +
  "category varchar(36), " +
  "coupon varchar(12), " +
  "price decimal(10,2), " +
  "vendorId varchar(36) not null, " +
  "purchases integer, " +
  "inventory integer not null, " +
  "isVisible integer not null, " +
  "createdAt varchar(255) not null, " +
  "updatedAt varchar(255) not null" +
  ");";


database.exec(createUserTable);
database.exec(createArticleTable);
