import { useAuthStore } from "@/features/auth";
import { FullScreenLoader, useAppTheme } from "@/shared";
import { Redirect, Stack } from "expo-router";
import { useEffect } from "react";

export default function AppLayout() {
  const { status, checkStatus } = useAuthStore();
  const { colors } = useAppTheme();

  useEffect(() => {
    void checkStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount once like products-app
  }, []);

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
      <Stack.Screen name="details/[id]" options={{ title: "Detalle" }} />
      <Stack.Screen
        name="camera/index"
        options={{ headerShown: false, presentation: "fullScreenModal" }}
      />
    </Stack>
  );
}
