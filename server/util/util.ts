import { NumberBooleanFormatError } from "./ServerErrors";

export function validateDecimalNumber(num: number): boolean {
  const decimalRegex: RegExp = /^\d{1,8}(\.\d{1,2})?$/;
  return decimalRegex.test(num.toString());
}

export function booleanToNumber(booleanInput: number | boolean | undefined): number {
  if (typeof booleanInput === "boolean") {
    return booleanInput ? 1 : 0;
  }
  throw new NumberBooleanFormatError();
}

export function numberToBoolean(numberInput: number | boolean | undefined): boolean {
  if (typeof numberInput === "number") {
    return numberInput === 1;
  }
  throw new NumberBooleanFormatError();
}