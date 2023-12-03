import Database from "better-sqlite3";

export const database = new Database("./database/webEngineering.db");

const createUserTable =
  "create table if not exists user (" +
  "userId integer not null primary key autoincrement, " +
  "userName varchar(32) not null, " +
  "email varchar(255) not null, " +
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
  "createdAt timestamp not null, " +
  "updatedAt timestamp not null " +
  ");";

const createArticleTable =
  "create table if not exists article (" +
  "articleId integer not null primary key autoincrement, " +
  "articleName varchar(255), " +
  "articleDescription varchar(255), " +
  "articleCategory varchar(255), " +
  "coupon varchar(255), " +
  "articlePrice decimal(10,2), " +
  "vendorId integer, " +
  "purchases integer, " +
  "inventory integer, " +
  "isVisible integer " +
  ");";

/*const createPostalCodeTable = "create table if not exists postcode (" +
  "plz integer not null primary key, " +
  "city varchar(255) not null" +
  ");";
*/

//database.exec(createPostalCodeTable);
database.exec(createUserTable);
database.exec(createArticleTable);
