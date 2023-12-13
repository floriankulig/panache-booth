import { database } from "./databases";
import { IUser } from "./IUser";

export function getUserById(id: string) {
  try {
    let user = database
      .prepare(
        "select id, userName, email, street, houseNumber, postcode, isVendor, city, " +
          "iban, bic, shippingCost, shippingFreeFrom, createdAt, updatedAt from user where id = ?"
      )
      .get(id);
    if (user != undefined) {
      // @ts-ignore
      user["isVendor"] = user["isVendor"] !== 0;
      return user;
    } else {
      return undefined;
    }
  } catch (e: unknown) {
    return e;
  }
}

export function getAllUsers() {
  return database
    .prepare(
      "select id, userName, email, street, houseNumber, postcode, isVendor, city, " +
      "iban, bic, shippingCost, shippingFreeFrom, createdAt, updatedAt from user"
    )
    .all();
}

export function createUser(user: IUser) {
  let isVendorNumeric = null;
  if (user.isVendor) {
    isVendorNumeric = 1;
  } else {
    isVendorNumeric = 0;
  }

  const stmt = database.prepare(
    "insert into user " +
      "(id, userName, email, password, isVendor, postcode, city, street, houseNumber, " +
      "iban, bic, shippingCost, shippingFreeFrom, " +
      "createdAt, updatedAt) " +
      "values " +
      "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  );
  const info = stmt.run(
    user.userId,
    user.userName,
    user.email,
    user.password,
    isVendorNumeric,
    user.postcode,
    user.city,
    user.street,
    user.houseNumber,
    user.iban,
    user.bic,
    user.shippingCost,
    user.shippingFreeFrom,
    user.createdAt,
    user.updatedAt
  );
  return getUserById(user.userId);
}

export function updateUserById(userChanges: Map<string, string>, id: string) {
  let sqlString = "update user set";

  userChanges.forEach((value: string, key: string) => {
    if (key === "isVendor") {
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
  return getUserById(id);
}

export function deleteUserById(id: string) {
  return database.prepare("delete from user where id = ?").run(id);
}

export function loggedInUser(email: string, password: string) {
  let sql =
    "select id, userName, email, " +
    "isVendor, postcode, city, street, houseNumber, " +
    "iban, bic, shippingCost, shippingFreeFrom, " +
    "createdAt, updatedAt from user ";
  sql += `where (email = '${email}') and (password = '${password}');`;
  return database.prepare(sql).get();
}
