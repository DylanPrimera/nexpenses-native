export type ExportScope =
  | { kind: "cycle"; cycleStartedAt: string }
  | { kind: "month"; year: number; month: number }
  | { kind: "all" };

export type ExportScopeKind = ExportScope["kind"];

export const EXPORT_PATHS = {
  expenses: "/expenses",
} as const;

export const EXPORT_PAGE_LIMIT = 500;

export const REPORT_MIME_TYPE = "application/vnd.ms-excel";
