export class InvalidLogin extends Error {
  constructor() {
    super("Email or password incorrect!");
    this.name = "InvalidLogin";
  }
}

export class UserNotExisting extends Error {
  constructor() {
    super("User is not exisiting!");
    this.name = "UserNotExisting"
  }
}

export class EmailAlreadyExisiting extends Error {
  constructor() {
    super("Email is already exisiting!");
    this.name = "EmailAlreadyExisting"
  }
}
