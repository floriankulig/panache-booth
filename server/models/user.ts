import { database } from "./databases";
import { IUser } from "./IUser";

export function getUserByIdModel(userId: string): IUser {
  return <IUser>database
    .prepare(
      "select id, userName, email, street, houseNumber, postcode, isVendor, city, " +
      "iban, bic, shippingCost, shippingFreeFrom, createdAt, updatedAt from user where id = ?",
    ).get(userId);
}

export function getVendorByIdModel(userId: string): IUser {
  return <IUser>database
    .prepare(
      "select id, userName, email, street, houseNumber, postcode, isVendor, city, " +
      "iban, bic, shippingCost, shippingFreeFrom, createdAt, updatedAt from user where id = ? and isVendor = 1;",
    ).get(userId);
}

export function getUserByEmailModel(email: string): IUser {
  return <IUser>database
    .prepare(
      "select * from user where email = ?",
    ).get(email);
}

export function getAllUsersModel(): IUser[] {
  return <IUser[]>database
    .prepare(
      "select id, userName, email, street, houseNumber, postcode, isVendor, city, iban, bic, shippingCost, " +
      "shippingFreeFrom, createdAt, updatedAt from user",
    ).all();
}

export function createUserModel(user: IUser): void {
  database.prepare(
    "insert into user " +
    "(id, userName, email, password, isVendor, postcode, city, street, houseNumber, " +
    "iban, bic, shippingCost, shippingFreeFrom, " +
    "createdAt, updatedAt) " +
    "values " +
    "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
  ).run(
    user.userId, user.userName, user.email, user.password, user.isVendor,
    user.postcode, user.city, user.street, user.houseNumber, user.iban,
    user.bic, user.shippingCost, user.shippingFreeFrom, user.createdAt,
    user.updatedAt);
}

export function updateUserByIdModel(userId: string, user: IUser): void {
  let sqlString: string = "update user set";
  Object.entries(user).forEach(([key, value]) => {
    if (value !== undefined && key !== "userId" && key !== "isVendor") {
      sqlString += ` ${key} = \'${value}\',`;
    }
  });
  sqlString = sqlString.slice(0, -1);
  sqlString += ` where id = '${userId}';`;
  database.prepare(sqlString).run();
}

export function deleteUserByIdModel(id: string): void {
  database.prepare("delete from user where id = ?").run(id);
}

export function loggedInUserModel(email: string, password: string) {
  let sql =
    "select id, userName, email, " +
    "isVendor, postcode, city, street, houseNumber, " +
    "iban, bic, shippingCost, shippingFreeFrom, " +
    "createdAt, updatedAt from user ";
  sql += `where (email = '${email}') and (password = '${password}');`;
  return database.prepare(sql).get();
}

export function getVendorShippingCostModel(vendorId: string) {
  return database.prepare("select shippingCost from user where id = ?;").get(vendorId);
}

export function getVendorShippingFreeFromModel(vendorId: string) {
  return database.prepare("select shippingFreeFrom from user where id = ?;").get(vendorId);
}
