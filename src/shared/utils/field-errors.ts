export type FieldErrorInput =
  | string
  | null
  | undefined
  | (string | { message?: string } | null | undefined)[];

export function uniqueErrorMessages(errors: FieldErrorInput): string[] {
  if (!errors) return [];
  const list = Array.isArray(errors) ? errors : [errors];
  const messages = list
    .map((e) => (typeof e === "string" ? e : e?.message))
    .filter((m): m is string => typeof m === "string" && m.trim().length > 0);
  return [...new Set(messages)];
}
