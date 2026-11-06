import { useAuthStore } from "@/features/auth";
import { Switch, ThemedButton, ThemedText, ThemedView, useAppTheme } from "@/shared";
import { Link, type Href } from "expo-router";
import { View } from "react-native";

export default function ProfileScreen() {
  const { firstName, lastName, logout } = useAuthStore();
  const { preference, resolvedScheme, colors, setDarkMode, setSystemTheme } =
    useAppTheme();
  const displayName = [firstName, lastName].filter(Boolean).join(" ") || "Usuario";

  return (
    <ThemedView className="flex-1 gap-6 px-6 py-8">
      <View className="gap-1">
        <ThemedText variant="title">Perfil</ThemedText>
        <ThemedText muted>{displayName}</ThemedText>
      </View>

      <View
        className="gap-4 rounded-xl p-4"
        style={{ backgroundColor: colors.card }}
      >
        <ThemedText variant="subtitle">Apariencia</ThemedText>

        <View className="flex-row items-center justify-between">
          <ThemedText>Usar tema del sistema</ThemedText>
          <Switch checked={preference === "system"} onCheckedChange={setSystemTheme} />
        </View>

        <View className="flex-row items-center justify-between">
          <ThemedText>Modo oscuro</ThemedText>
          <Switch
            checked={resolvedScheme === "dark"}
            disabled={preference === "system"}
            onCheckedChange={setDarkMode}
          />
        </View>
      </View>

      <ThemedButton onPress={() => void logout()}>Cerrar sesión</ThemedButton>

      {__DEV__ ? (
        <Link href={"/ui-kit" as Href} className="text-center font-figtree-medium text-sm text-primary">
          UI kit (solo dev)
        </Link>
      ) : null}
    </ThemedView>
  );
}
