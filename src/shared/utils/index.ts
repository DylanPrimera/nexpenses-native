export const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

export { uniqueErrorMessages, type FieldErrorInput } from "./field-errors";
