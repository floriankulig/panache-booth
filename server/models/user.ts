import { database } from "./databases";
import { IUser } from "./IUser";
import { v4 as uuidv4 } from "uuid";
import { userById } from "../services/user";

export function getUserById(id: string) {
  try {
    let user = database.prepare("select id, userName, email, street, houseNumber, postcode, isVendor, city, " +
      "iban, bic, shippingCost, shippingFreeFrom, createdAt, updatedAt from user where id = ?").get(id);
    if (user != undefined) {
      // @ts-ignore
      user["isVendor"] = user["isVendor"] !== 0;
      return user;
    }
    else {
      return undefined
    }
  } catch (e: unknown) {
    console.log(e)
    return e;
  }
}

export function getAllUsers() {
  let user = database.prepare("select id, userName, email, street, houseNumber, postcode, isVendor, city, " +
    "iban, bic, shippingCost, shippingFreeFrom, createdAt, updatedAt from user").all();

  user.forEach((key) => {
    // @ts-ignore
    key["isVendor"] = key["isVendor"] !== 0;
  });
  return user;
}

export function createUser(user: IUser) {
  user.userId = uuidv4();
  const currentTimestamp = new Date().toISOString();
  user.createdAt = currentTimestamp;
  user.updatedAt = currentTimestamp;

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
      "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
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
    user.updatedAt,
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
  return getUserById(id)
}

export function deleteUserById(id: string) {
  return database.prepare("delete from user where id = ?").run(id);
}

export function loggedInUser(email: string, password: string){
  try {
    let sql = "select id, userName, email, password, " +
      "isVendor" +
      ", postcode, city, street, houseNumber, " +
      "iban, bic, shippingCost, shippingFreeFrom, " +
      "createdAt, updatedAt from user "
    sql += `where (email = '${email}') and (password = '${password}');`
    console.log(sql)
    let user = database.prepare(sql).get()
    if (user != undefined) {
      // @ts-ignore
      user["isVendor"] = user["isVendor"] !== 0;
      return user;
    }
    else {
      return undefined
    }
  }
  catch (e: unknown) {
    console.log(e)
    return e;
  }
}


