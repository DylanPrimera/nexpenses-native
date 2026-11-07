import { setUnauthorizedHandler } from "@/core";
import { useAuthStore } from "@/features/auth";
import { useAppTheme, AppThemeProvider } from "@/shared/theme";
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
import "@/core/network/connectivity";
import { AppQueryProvider } from "@/core/query/AppQueryProvider";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context";
import "@/core/validations/zod-locale";
import "../global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { status, bootstrap } = useAuthStore();

  const [loaded, error] = useFonts({
    Figtree_300Light,
    Figtree_400Regular,
    Figtree_500Medium,
    Figtree_600SemiBold,
    Figtree_700Bold,
  });

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

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
    <AppThemeProvider>
      <ThemedRoot sessionReady={status !== "checking"} />
    </AppThemeProvider>
  );
}

function ThemedRoot({ sessionReady }: { sessionReady: boolean }) {
  const { colors, resolvedScheme, isReady } = useAppTheme();
  const background = colors.background;
  useEffect(() => {
    if (isReady) void SystemUI.setBackgroundColorAsync(background).catch(() => undefined);
  }, [background, isReady]);
  useEffect(() => {
    if (isReady && sessionReady) void SplashScreen.hideAsync();
  }, [isReady, sessionReady]);
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: background }}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <KeyboardProvider>
          <AppQueryProvider>
            <StatusBar style={resolvedScheme === "dark" ? "light" : "dark"} />
            <OverlayBlurProvider>
              <BottomSheetModalProvider>
                <OverlayBlurTarget>
                  <Stack
                    screenOptions={{
                      headerShown: false,
                      contentStyle: { backgroundColor: background },
                    }}
                  />
                </OverlayBlurTarget>
              </BottomSheetModalProvider>
            </OverlayBlurProvider>
            <AppToaster />
            <PortalHost />
          </AppQueryProvider>
        </KeyboardProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
