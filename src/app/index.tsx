import { useAuthStore } from "@/features/auth";
import { Redirect } from "expo-router";

export default function Index() {
  const { status } = useAuthStore();

  if (status === "checking") return null;

  if (status === "authenticated") {
    return <Redirect href="/(app)/(tabs)" />;
  }

  return <Redirect href="/(auth)/login" />;
}
