import { Directory, File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";
import {
  saveReport,
  type ReportContent,
  type SaveReportDeps,
  type SaveResult,
} from "./save-report";

const nativeDeps: SaveReportDeps = {
  platform: Platform.OS,
  pickDirectory: (initialUri) => Directory.pickDirectoryAsync(initialUri),
  createTempFile: (name) => {
    const file = new File(Paths.cache, name);
    file.create({ overwrite: true });
    return {
      uri: file.uri,
      write: (content) => file.write(content),
      delete: () => {
        if (file.exists) file.delete();
      },
    };
  },
  share: (uri, options) => Sharing.shareAsync(uri, options),
};

export function saveReportToDevice(
  fileName: string,
  getContent: ReportContent,
): Promise<SaveResult> {
  return saveReport(fileName, getContent, nativeDeps);
}
