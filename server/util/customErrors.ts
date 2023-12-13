export class InvalidLogin extends Error {
  constructor() {
    super("Email or password incorrect!");
    this.name = "InvalidLogin";
  }
}
