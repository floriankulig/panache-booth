export class InvalidLogin extends Error {
  constructor() {
    super("Email or password incorrect!");
    this.name = "InvalidLogin";
  }
}

export class UserNotExisting extends Error {
  constructor() {
    super("User is not existing!");
    this.name = "UserNotExisting"
  }
}


