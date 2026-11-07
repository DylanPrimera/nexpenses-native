export function getQueryDisplayState(input: {
  data: unknown;
  isReady: boolean;
  isOnline: boolean;
  isError: boolean;
}): "ready" | "loading" | "offline" | "error" {
  if (input.data !== undefined) return "ready";
  if (!input.isReady) return "loading";
  if (!input.isOnline) return "offline";
  return input.isError ? "error" : "loading";
}
