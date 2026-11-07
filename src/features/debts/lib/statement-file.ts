import { messages } from "@/shared/i18n";

export const MAX_STATEMENT_BYTES = 8 * 1024 * 1024;

export type StatementFile = {
  uri: string;
  name: string;
  size: number | null;
};

type PickedAsset = { name: string; uri: string; size?: number | null; mimeType?: string | null };

export function isPdfAsset(asset: Pick<PickedAsset, "name" | "mimeType">): boolean {
  if (asset.mimeType === "application/pdf") return true;
  return asset.name.toLowerCase().endsWith(".pdf");
}

export function toStatementFile(asset: PickedAsset): StatementFile {
  return { uri: asset.uri, name: asset.name, size: asset.size ?? null };
}

export function statementFileError(
  asset: Pick<PickedAsset, "name" | "mimeType" | "size"> | null,
): string | null {
  if (!asset) return messages.Debts.pdf_required;
  if (!isPdfAsset(asset)) return messages.Debts.pdf_invalid;
  if ((asset.size ?? 0) > MAX_STATEMENT_BYTES) return messages.Debts.pdf_too_big;
  return null;
}

export function formatFileSize(bytes: number | null): string {
  if (bytes === null) return "";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1).replace(".", ",")} MB`;
}
