export function validateDecimalNumber(num: number): boolean {
  const decimalRegex: RegExp = /^\d{1,8}(\.\d{1,2})?$/;
  return decimalRegex.test(num.toString());
}