import { useAppTheme } from "@/shared/theme";
import { Toaster } from "sonner-native";

export function AppToaster() {
  const { resolvedScheme } = useAppTheme();
  return (
    <Toaster
      theme={resolvedScheme}
      position="top-center"
      offset={56}
      swipeToDismissDirection="up"
      visibleToasts={3}
    />
  );
}
