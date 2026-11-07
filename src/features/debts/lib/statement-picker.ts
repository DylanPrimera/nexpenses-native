import { getDocumentAsync } from "expo-document-picker";
import { File, Paths } from "expo-file-system";
import { statementFileError, toStatementFile, type StatementFile } from "./statement-file";

export type StatementPick = { file: StatementFile; error: null } | { file: null; error: string };

export function discardStatementCopy(uri: string): void {
  try {
    if (!uri.startsWith(Paths.cache.uri)) return;
    const copy = new File(uri);
    if (copy.exists) copy.delete();
  } catch {
    return;
  }
}

export async function pickStatement(): Promise<StatementPick | null> {
  const result = await getDocumentAsync({
    type: "application/pdf",
    copyToCacheDirectory: true,
    multiple: false,
  });
  const asset = result.canceled ? null : result.assets[0];
  if (!asset) return null;
  const error = statementFileError(asset);
  if (error) {
    discardStatementCopy(asset.uri);
    return { file: null, error };
  }
  return { file: toStatementFile(asset), error: null };
}
