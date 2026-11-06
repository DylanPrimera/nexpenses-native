import { queryClient, setUnauthorizedHandler } from "@/core";
import { useAuthStore } from "@/features/auth";
import { AppColors, AppThemeProvider } from "@/shared";
import { messages } from "@/shared/i18n";
import { OverlayBlurProvider, OverlayBlurTarget } from "@/shared/overlays";
import { AppToaster, showToast } from "@/shared/toast";
import {
  Figtree_300Light,
  Figtree_400Regular,
  Figtree_500Medium,
  Figtree_600SemiBold,
  Figtree_700Bold,
  useFonts,
} from "@expo-google-fonts/figtree";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { PortalHost } from "@rn-primitives/portal";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from "react-native-safe-area-context";
import "../global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const background =
    colorScheme === "dark" ? AppColors.dark.background : AppColors.light.background;

  const [loaded, error] = useFonts({
    Figtree_300Light,
    Figtree_400Regular,
    Figtree_500Medium,
    Figtree_600SemiBold,
    Figtree_700Bold,
  });

  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(background);
  }, [background]);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      const { status, logout } = useAuthStore.getState();
      if (status !== "authenticated") return;
      showToast("error", messages.Auth.session_expired);
      void logout();
    });
    return () => setUnauthorizedHandler(null);
  }, []);

  if (!loaded && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: background }}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <QueryClientProvider client={queryClient}>
          <AppThemeProvider>
            <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
            <OverlayBlurProvider>
              <BottomSheetModalProvider>
                <OverlayBlurTarget>
                  <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: background } }} />
                </OverlayBlurTarget>
              </BottomSheetModalProvider>
            </OverlayBlurProvider>
            <AppToaster />
            <PortalHost />
          </AppThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
