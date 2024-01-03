export class CustomAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class AuthenticationRequired extends CustomAuthError {
  constructor() {
    super("Authentication required!");
    this.name = "AuthenticationRequired";
  }
}

export class UsernamePasswordMismatch extends CustomAuthError {
  constructor() {
    super("Username password mismatch!");
    this.name = "UsernamePasswordMismatch";
  }
}
/*
export class NotAVendor extends CustomAuthError {
  constructor() {
    super("Vendors only!");
    this.name = "NotAVendor";
  }
}

export class NotVendorsProduct extends CustomAuthError {
  constructor() {
    super("Not your product!");
    this.name = "NotVendorsProduct";
  }
}*/

export class NoPermission extends CustomAuthError {
  constructor() {
    super("You don't have permissions to perform this action!");
    this.name = "NoPermission";
  }
}
