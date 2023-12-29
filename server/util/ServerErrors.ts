export class ServerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class NumberBooleanFormatError extends ServerError {
  constructor() {
    super("Number or boolean format error!");
    this.name = "NumberBooleanFormatError";
  }
}