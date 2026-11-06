import { useAuthStore } from "@/features/auth";
import { ThemedButton, ThemedText, ThemedView, useAppTheme } from "@/shared";
import { Switch, View } from "react-native";

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const { preference, resolvedScheme, colors, setDarkMode, setSystemTheme } = useAppTheme();

  return (
    <ThemedView className="flex-1 gap-6 px-6 py-8">
      <View className="gap-1">
        <ThemedText variant="title">Perfil</ThemedText>
        <ThemedText muted>{user?.fullName ?? "Usuario"}</ThemedText>
        <ThemedText muted>{user?.email ?? ""}</ThemedText>
      </View>

      <View className="gap-4 rounded-xl p-4" style={{ backgroundColor: colors.card }}>
        <ThemedText variant="subtitle">Apariencia</ThemedText>

        <View className="flex-row items-center justify-between">
          <ThemedText>Usar tema del sistema</ThemedText>
          <Switch
            value={preference === "system"}
            onValueChange={setSystemTheme}
            trackColor={{ true: colors.primary }}
          />
        </View>

        <View className="flex-row items-center justify-between">
          <ThemedText>Modo oscuro</ThemedText>
          <Switch
            value={resolvedScheme === "dark"}
            disabled={preference === "system"}
            onValueChange={setDarkMode}
            trackColor={{ true: colors.primary }}
          />
        </View>
      </View>

      <ThemedButton onPress={() => void logout()}>Cerrar sesión</ThemedButton>
    </ThemedView>
  );
}
