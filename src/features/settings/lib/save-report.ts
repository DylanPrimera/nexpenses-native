import { REPORT_MIME_TYPE } from "../interfaces";

export const ANDROID_DOWNLOADS_URI =
  "content://com.android.externalstorage.documents/document/primary%3ADownload";

export const REPORT_UTI = "com.microsoft.excel.xls";

export type ReportContent = () => string | Promise<string>;

export type SaveResult = "saved" | "shared" | "cancelled";

export type ReportFileHandle = {
  write: (content: string) => void;
  delete: () => void;
};

export type ReportDirectoryHandle = {
  createFile: (name: string, mimeType: string) => ReportFileHandle;
};

export type ReportTempFile = ReportFileHandle & { uri: string };

export type SaveReportDeps = {
  platform: string;
  pickDirectory: (initialUri: string) => Promise<ReportDirectoryHandle>;
  createTempFile: (name: string) => ReportTempFile;
  share: (uri: string, options: { mimeType: string; UTI: string }) => Promise<void>;
};

export class UnsupportedPlatformError extends Error {
  constructor() {
    super("Report saving is not supported on this platform");
    this.name = "UnsupportedPlatformError";
  }
}

export function isPickerCancelled(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  const { code, message } = error as { code?: unknown; message?: unknown };
  if (typeof code === "string" && /(PICKER|PICKING)_CANCEL+ED/i.test(code)) return true;
  return typeof message === "string" && /cancel+ed by the user/i.test(message);
}

function discard(file: ReportFileHandle) {
  try {
    file.delete();
  } catch {
    return;
  }
}

async function saveOnAndroid(
  fileName: string,
  getContent: ReportContent,
  deps: SaveReportDeps,
): Promise<SaveResult> {
  let directory: ReportDirectoryHandle;
  try {
    directory = await deps.pickDirectory(ANDROID_DOWNLOADS_URI);
  } catch (error) {
    if (isPickerCancelled(error)) return "cancelled";
    throw error;
  }

  const content = await getContent();
  const file = directory.createFile(fileName, REPORT_MIME_TYPE);
  try {
    file.write(content);
  } catch (error) {
    discard(file);
    throw error;
  }
  return "saved";
}

async function saveOnIos(
  fileName: string,
  getContent: ReportContent,
  deps: SaveReportDeps,
): Promise<SaveResult> {
  const content = await getContent();
  const file = deps.createTempFile(fileName);
  try {
    file.write(content);
    await deps.share(file.uri, { mimeType: REPORT_MIME_TYPE, UTI: REPORT_UTI });
    return "shared";
  } finally {
    discard(file);
  }
}

export async function saveReport(
  fileName: string,
  getContent: ReportContent,
  deps: SaveReportDeps,
): Promise<SaveResult> {
  if (deps.platform === "android") return saveOnAndroid(fileName, getContent, deps);
  if (deps.platform === "ios") return saveOnIos(fileName, getContent, deps);
  throw new UnsupportedPlatformError();
}
