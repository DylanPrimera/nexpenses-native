export type DataRow<T> =
  { kind: "record"; id: string; record: T } | { kind: "skeleton"; id: string };

export function listRows<T extends { id: string }>(
  items: T[],
  loading = false,
  count = 3,
): DataRow<T>[] {
  if (!items.length && loading)
    return Array.from({ length: count }, (_, index) => ({
      kind: "skeleton",
      id: `loading-${index}`,
    }));
  return items.map((record) => ({ kind: "record", id: record.id, record }));
}
