import { setUnauthorizedHandler } from "@/core";
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
import "@/core/network/connectivity";
import { AppQueryProvider } from "@/core/query/AppQueryProvider";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context";
import "@/core/validations/zod-locale";
import "../global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { status, bootstrap } = useAuthStore();
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
    void bootstrap();
  }, [bootstrap]);

  useEffect(() => {
    if ((loaded || error) && status !== "checking") {
      void SplashScreen.hideAsync();
    }
  }, [loaded, error, status]);

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
        <KeyboardProvider>
          <AppQueryProvider>
            <AppThemeProvider>
              <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
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
            </AppThemeProvider>
          </AppQueryProvider>
        </KeyboardProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
