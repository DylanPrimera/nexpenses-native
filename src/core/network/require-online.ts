import { onlineManager } from "@tanstack/react-query";
import { messages } from "@/shared/i18n";
export class OfflineActionError extends Error {
  constructor() {
    super(messages.Offline.action_requires_connection);
  }
}
export function requireOnline() {
  if (!onlineManager.isOnline()) throw new OfflineActionError();
}
