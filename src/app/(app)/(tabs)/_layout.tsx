import { useAppTheme } from "@/shared";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  const { colors } = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={String(color)} />
          ),
        }}
      />
      <Tabs.Screen
        name="media"
        options={{
          title: "Media",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="images-outline" size={size} color={String(color)} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={String(color)} />
          ),
        }}
      />
    </Tabs>
  );
}
