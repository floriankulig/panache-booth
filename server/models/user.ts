import {userDb} from "./databases";
import { IUser } from "./IUser";

export function getUserById(id: string){
  const user = userDb.prepare('select * from user where userid = ?').get(id);
  console.log('ttt');
  console.log(user);
  return user;
}

export function addNewUser(user: IUser){
  const stmt = userDb.prepare('insert into user (userid, username) values (?, ?)');
  const info = stmt.run(user.id, user.username);
  console.log("Passt");
  return info;
}