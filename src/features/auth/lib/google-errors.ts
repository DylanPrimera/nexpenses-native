import { isNetworkError } from "@/core/api/is-network-error";
import { AuthActionError } from "./auth-errors";
import { authCopy } from "./auth-messages";

export type GoogleFailureReason =
  "cancelled" | "play_services" | "config" | "offline" | "no_token" | "unknown";

export class GoogleSignInFailure extends Error {
  readonly reason: GoogleFailureReason;

  constructor(reason: GoogleFailureReason) {
    super(reason);
    this.name = "GoogleSignInFailure";
    this.reason = reason;
  }
}

export type GoogleFeedback = { level: "warning" | "error"; message: string };

const OFFLINE_PATTERN = /network|internet|offline|unreachable|timed? ?out/i;

function codeOf(error: unknown) {
  if (typeof error !== "object" || error === null) return undefined;
  const { code } = error as { code?: unknown };
  return typeof code === "string" ? code : undefined;
}

function messageOf(error: unknown) {
  return error instanceof Error ? error.message : "";
}

export function classifyGoogleError(error: unknown): GoogleFailureReason {
  if (error instanceof GoogleSignInFailure) return error.reason;
  switch (codeOf(error)) {
    case "SIGN_IN_CANCELLED":
      return "cancelled";
    case "PLAY_SERVICES_NOT_AVAILABLE":
      return "play_services";
    case "DEVELOPER_ERROR":
      return "config";
    default:
      return OFFLINE_PATTERN.test(messageOf(error)) ? "offline" : "unknown";
  }
}

const REASON_FEEDBACK: Record<Exclude<GoogleFailureReason, "cancelled">, GoogleFeedback> = {
  play_services: { level: "error", message: authCopy.google_no_play_services },
  config: { level: "error", message: authCopy.google_config_error },
  offline: { level: "warning", message: authCopy.google_offline },
  no_token: { level: "error", message: authCopy.google_no_token },
  unknown: { level: "error", message: authCopy.google_failed },
};

export function googleFeedback(error: unknown): GoogleFeedback | null {
  if (isNetworkError(error)) return REASON_FEEDBACK.offline;
  if (error instanceof AuthActionError) {
    return { level: error.status === 409 ? "warning" : "error", message: error.message };
  }
  const reason = classifyGoogleError(error);
  return reason === "cancelled" ? null : REASON_FEEDBACK[reason];
}
