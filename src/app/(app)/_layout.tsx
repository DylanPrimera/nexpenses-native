import { useAuthStore } from "@/features/auth";
import { FullScreenLoader, useAppTheme } from "@/shared";
import { Redirect, Stack } from "expo-router";

export default function AppLayout() {
  const { status } = useAuthStore();
  const { colors } = useAppTheme();

  if (status === "checking") {
    return <FullScreenLoader />;
  }

  if (status === "unauthenticated") {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
