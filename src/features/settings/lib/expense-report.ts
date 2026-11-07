import { localDayKey, localTimeKey } from "@/core/utils/budget-cycle";
import type { PaymentType } from "@/core/types/domain";
import type { Expense } from "@/features/expenses/interfaces";

export type ExpenseReportLabels = {
  sheetExpenses: string;
  sheetByCategory: string;
  sheetSummary: string;
  colDate: string;
  colTime: string;
  colDescription: string;
  colCategory: string;
  colPayment: string;
  colAmount: string;
  colCount: string;
  colTotal: string;
  colPercent: string;
  unknownCategory: string;
  labelExportedAt: string;
  labelPeriod: string;
  labelBudget: string;
  labelSpent: string;
  labelRemaining: string;
  labelPercentUsed: string;
  labelExpenseCount: string;
  labelByPayment: string;
};

export type BuildExpenseReportInput = {
  expenses: readonly Expense[];
  periodLabel: string;
  budget: number | null;
  labels: ExpenseReportLabels;
  paymentLabels: Record<PaymentType, string>;
  now: number | Date;
};

const PAYMENT_ORDER: readonly PaymentType[] = ["cash", "debit_card", "credit_card"];

const INVALID_XML_CHARS = /[^\u0009\u000A\u000D\u0020-\uD7FF\uE000-\uFFFD\u{10000}-\u{10FFFF}]/gu;

const XML_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
};

function escapeXml(value: string) {
  return value.replace(INVALID_XML_CHARS, "").replace(/[&<>"']/g, (char) => XML_ENTITIES[char]);
}

export function sanitizeSheetName(value: string) {
  const cleaned = value
    .replace(INVALID_XML_CHARS, "")
    .replace(/[\\/?*[\]:]/g, " ")
    .replace(/^'+|'+$/g, "")
    .trim()
    .slice(0, 31)
    .trim();
  return cleaned || "Hoja";
}

function uniqueSheetNames(names: readonly string[]) {
  const used = new Set<string>();
  return names.map((name) => {
    const base = sanitizeSheetName(name);
    let candidate = base;
    let suffix = 2;
    while (used.has(candidate.toLowerCase())) {
      const tail = ` (${suffix})`;
      candidate = `${base.slice(0, 31 - tail.length)}${tail}`;
      suffix += 1;
    }
    used.add(candidate.toLowerCase());
    return candidate;
  });
}

type Cell = { type: "String"; value: string; style?: string } | { type: "Number"; value: number };

const text = (value: string, style?: string): Cell => ({ type: "String", value, style });
const num = (value: number): Cell => ({
  type: "Number",
  value: Number.isFinite(value) ? value : 0,
});

function renderCell(cell: Cell) {
  if (cell.type === "Number") {
    return `<Cell ss:StyleID="num"><Data ss:Type="Number">${cell.value}</Data></Cell>`;
  }
  const style = cell.style ? ` ss:StyleID="${cell.style}"` : "";
  return `<Cell${style}><Data ss:Type="String">${escapeXml(cell.value)}</Data></Cell>`;
}

function renderRow(cells: readonly Cell[]) {
  return `<Row>${cells.map(renderCell).join("")}</Row>`;
}

function renderSheet(name: string, rows: readonly (readonly Cell[])[], widths: readonly number[]) {
  const columns = widths.map((width) => `<Column ss:Width="${width}"/>`).join("");
  return `<Worksheet ss:Name="${escapeXml(name)}"><Table>${columns}${rows.map(renderRow).join("")}</Table></Worksheet>`;
}

function timeOf(expense: Expense) {
  const ms = new Date(expense.date).getTime();
  return Number.isNaN(ms) ? 0 : ms;
}

function describe(expense: Expense) {
  return [expense.title, expense.description]
    .map((part) => (part ?? "").trim())
    .filter(Boolean)
    .join(" — ");
}

export function buildExpenseReport({
  expenses,
  periodLabel,
  budget,
  labels,
  paymentLabels,
  now,
}: BuildExpenseReportInput): string {
  const sorted = [...expenses].sort((a, b) => timeOf(b) - timeOf(a));
  const total = sorted.reduce((sum, expense) => sum + expense.amount, 0);

  const expenseRows: Cell[][] = [
    [
      text(labels.colDate, "head"),
      text(labels.colTime, "head"),
      text(labels.colDescription, "head"),
      text(labels.colCategory, "head"),
      text(labels.colPayment, "head"),
      text(labels.colAmount, "head"),
    ],
    ...sorted.map((expense) => [
      text(localDayKey(expense.date)),
      text(localTimeKey(expense.date)),
      text(describe(expense)),
      text(expense.category?.name ?? labels.unknownCategory),
      text(paymentLabels[expense.paymentType] ?? expense.paymentType),
      num(expense.amount),
    ]),
  ];

  const groups = new Map<string, { name: string; count: number; total: number }>();
  for (const expense of sorted) {
    const key = expense.categoryId ?? "";
    const group = groups.get(key) ?? {
      name: expense.category?.name ?? labels.unknownCategory,
      count: 0,
      total: 0,
    };
    group.count += 1;
    group.total += expense.amount;
    groups.set(key, group);
  }

  const categoryRows: Cell[][] = [
    [
      text(labels.colCategory, "head"),
      text(labels.colCount, "head"),
      text(labels.colTotal, "head"),
      text(labels.colPercent, "head"),
    ],
    ...[...groups.values()]
      .sort((a, b) => b.total - a.total)
      .map((group) => [
        text(group.name),
        num(group.count),
        num(group.total),
        num(total > 0 ? Math.round((group.total / total) * 100) : 0),
      ]),
  ];

  const summaryRows: Cell[][] = [
    [text(labels.labelExportedAt, "head"), text(`${localDayKey(now)} ${localTimeKey(now)}`)],
    [text(labels.labelPeriod, "head"), text(periodLabel)],
  ];
  if (budget !== null) {
    summaryRows.push([text(labels.labelBudget, "head"), num(budget)]);
  }
  summaryRows.push([text(labels.labelSpent, "head"), num(total)]);
  if (budget !== null) {
    summaryRows.push([text(labels.labelRemaining, "head"), num(budget - total)]);
    summaryRows.push([
      text(labels.labelPercentUsed, "head"),
      num(budget > 0 ? Math.round((total / budget) * 100) : 0),
    ]);
  }
  summaryRows.push([text(labels.labelExpenseCount, "head"), num(sorted.length)]);
  summaryRows.push([text(labels.labelByPayment, "head")]);
  for (const type of PAYMENT_ORDER) {
    const paymentTotal = sorted
      .filter((expense) => expense.paymentType === type)
      .reduce((sum, expense) => sum + expense.amount, 0);
    summaryRows.push([text(paymentLabels[type]), num(paymentTotal)]);
  }

  const [expensesName, categoryName, summaryName] = uniqueSheetNames([
    labels.sheetExpenses,
    labels.sheetByCategory,
    labels.sheetSummary,
  ]);

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<?mso-application progid="Excel.Sheet"?>',
    '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">',
    '<Styles><Style ss:ID="head"><Font ss:Bold="1"/></Style><Style ss:ID="num"><NumberFormat ss:Format="#,##0"/></Style></Styles>',
    renderSheet(expensesName, expenseRows, [75, 45, 260, 120, 110, 95]),
    renderSheet(categoryName, categoryRows, [160, 70, 110, 90]),
    renderSheet(summaryName, summaryRows, [200, 180]),
    "</Workbook>",
  ].join("");
}
