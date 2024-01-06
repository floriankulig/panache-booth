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

export class NoPermission extends CustomAuthError {
  constructor() {
    super("You don't have permissions to perform this action!");
    this.name = "NoPermission";
  }
}
