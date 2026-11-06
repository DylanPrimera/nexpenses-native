import { useAuthStore } from "@/features/auth";
import { Redirect } from "expo-router";
import { useEffect } from "react";

export default function Index() {
  const { status, bootstrap } = useAuthStore();

  useEffect(() => {
    void bootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- boot once
  }, []);

  // if (status === "checking") {
  //   return <FullScreenLoader />;
  // }

  if (status === "authenticated") {
    return <Redirect href="/(app)/(tabs)" />;
  }

  return <Redirect href="/(auth)/login" />;
}
