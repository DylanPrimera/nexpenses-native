import es from "./es.json";

export function tx(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

export function transactionCount(count: number): string {
  return count === 1 ? es.Budget.one_transaction : tx(es.Budget.transactions, { count });
}
