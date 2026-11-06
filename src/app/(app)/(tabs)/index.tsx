import { formatCOPCurrency } from "@/core/utils/currency";
import { Icon, ThemedText, ThemedView } from "@/shared";
import { IconPigMoney } from "@tabler/icons-react-native";
import { useAppTheme } from "@/shared/theme";

export default function HomeScreen() {
  const { colors, resolvedScheme } = useAppTheme();

  return (
    <ThemedView className="flex-1 items-center justify-center gap-4 px-6">
      <Icon as={IconPigMoney} size={48} color={colors.primary} />
      <ThemedText className="font-figtree-semibold text-2xl">Nexpenses</ThemedText>
      <ThemedText className="text-center text-light-muted dark:text-dark-muted">
        Fase 0 — fundaciones. Tema {resolvedScheme}. Ejemplo COP:{" "}
        {formatCOPCurrency(20000)}
      </ThemedText>
    </ThemedView>
  );
}
