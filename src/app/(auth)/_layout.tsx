import { useAuthStore } from "@/features/auth";
import { FullScreenLoader } from "@/shared";
import { Redirect, Stack } from "expo-router";

export default function AuthLayout() {
  const { status } = useAuthStore();

  if (status === "checking") {
    return <FullScreenLoader />;
  }

  if (status === "authenticated") {
    return <Redirect href="/(app)/(tabs)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
