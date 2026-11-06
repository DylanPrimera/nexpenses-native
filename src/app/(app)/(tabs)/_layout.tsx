import { AddExpenseSheet } from "@/features/expenses";
import { DURATION_FAST_MS, EASE_OUT_BEZIER } from "@/shared/motion";
import { BottomNav } from "@/shared/navigation";
import { useAppTheme } from "@/shared/theme";
import { Tabs } from "expo-router/js-tabs";
import { useState } from "react";
import { Easing } from "react-native";
import { useReducedMotion } from "react-native-reanimated";

const FADE_SPEC = {
  animation: "timing",
  config: { duration: DURATION_FAST_MS, easing: Easing.bezier(...EASE_OUT_BEZIER) },
} as const;

export default function TabsLayout() {
  const reduced = useReducedMotion();
  const { colors } = useAppTheme();
  const [addOpen, setAddOpen] = useState(false);

  return (
    <>
      <Tabs
        backBehavior="firstRoute"
        tabBar={(props) => <BottomNav {...props} onAddPress={() => setAddOpen(true)} />}
        screenOptions={{
          headerShown: false,
          animation: reduced ? "none" : "fade",
          transitionSpec: FADE_SPEC,
          sceneStyle: { backgroundColor: colors.background },
        }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="history" />
        <Tabs.Screen name="recurring" />
        <Tabs.Screen name="categories" />
        <Tabs.Screen name="debts" />
        <Tabs.Screen name="settings" />
      </Tabs>
      <AddExpenseSheet isOpen={addOpen} onChange={setAddOpen} />
    </>
  );
}
