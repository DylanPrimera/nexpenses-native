import { playErrorSound, playSuccessSound } from "@/shared/audio/ui-sound";
import { messages } from "@/shared/i18n";
import { showToast } from "./show-toast";

export function notifySuccess(message: string) {
  playSuccessSound();
  showToast("success", message);
}

export function notifyWarning(message: string) {
  playErrorSound();
  showToast("warning", message);
}

export function notifyError(message: string = messages.Common.error_generic) {
  playErrorSound();
  showToast("error", message);
}
