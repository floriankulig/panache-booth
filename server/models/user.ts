import { database } from "./databases";
import { IUser } from "./IUser";
import { userById } from "../services/user";

export function getUserById(id: string){
  try {
    let user = database.prepare("select * from user where userid = ?").get(id);
    // @ts-ignore
    user["isVendor"] = user["isVendor"] !== 0;
    return user
  }
  catch (e: unknown){
    return e;
  }
}

export function getAllUsers(){
  let user = database.prepare("select * from user").all();

  user.forEach((key) => {
    // @ts-ignore
    key["isVendor"] = key["isVendor"] !== 0;
  })
  console.log(user)
  return user
}

export function createUser(user: IUser){
  const currentTimestamp = new Date().toISOString();
  user.createdAt = currentTimestamp;
  user.updatedAt = currentTimestamp;
  let isVendorNumeric = null;
  if (user.isVendor){
    isVendorNumeric = 1;
  }
  else {
    isVendorNumeric = 0;
  }

  const stmt = database.prepare("insert into user " +
    "(userName, email, password, isVendor, postalCode, city, street, houseNumber, " +
    "iban, bic, shippingCost, shippingFreeForm, " +
    "createdAt, updatedAt) " +
    "values " +
    "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
  const info =  stmt.run(user.userName, user.email, user.password,
    isVendorNumeric, user.postalCode, user.city, user.street, user.houseNumber, user.iban,
    user.bic, user.shippingCost, user.shippingFreeForm,
    user.createdAt, user.updatedAt);
  return info;
}

export function updateUserById(userChanges: Map<string, string>, id: string){
  let sqlString = "update user set";
  userChanges.forEach((value: string, key: string) => {
    if (key === "isVendor"){
      if (value === "true"){
        sqlString += ` ${key} = '1',`;
      }
      else {
        sqlString += ` ${key} = '0',`;
      }
    } else {
      sqlString += ` ${key} = \'${value}\',`;
    }
  });
  //sqlString = sqlString.substring(0, sqlString.length - 1);
  const currentTimestamp = new Date().toISOString()
  sqlString += `updatedAt = '${currentTimestamp}' where userId = ${id};`;
  //sqlString += ` where userId = ${id};`;
  return database.prepare(sqlString).run();
}

export function deleteUserById(id: string){
  return database.prepare("delete from user where userid = ?").run(id);
}
