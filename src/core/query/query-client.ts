import { focusManager, QueryClient } from "@tanstack/react-query";
import { AppState } from "react-native";

focusManager.setEventListener((handleFocus) => {
  const subscription = AppState.addEventListener("change", (state) =>
    handleFocus(state === "active"),
  );
  return () => subscription.remove();
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, gcTime: 7 * 24 * 60 * 60 * 1000 },
  },
});
