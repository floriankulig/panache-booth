import Database from 'better-sqlite3';

export const userDb = new Database('./databases/user.db');
const createUserTable = "create table if not exists user (userid int not null, username varchar(20));";
userDb.exec(createUserTable);


