import type { CreditStatus } from "@/core/types/domain";
import { Text } from "@/shared/components/ui/text";
import { messages } from "@/shared/i18n";
import { View } from "react-native";

const STATUS_STYLE: Record<CreditStatus, { label: string; surface: string; text: string }> = {
  al_dia: { label: messages.Debts.status_ok, surface: "bg-primary/15", text: "text-primary" },
  proximo: {
    label: messages.Debts.status_soon,
    surface: "bg-amber-500/15",
    text: "text-amber-700 dark:text-amber-300",
  },
  atrasado: {
    label: messages.Debts.status_late,
    surface: "bg-destructive/15",
    text: "text-destructive",
  },
};

export function StatusBadge({ status }: { status: CreditStatus }) {
  const style = STATUS_STYLE[status];

  return (
    <View className={`rounded-md px-2 py-0.5 ${style.surface}`}>
      <Text className={`font-figtree-semibold text-[11px] ${style.text}`}>{style.label}</Text>
    </View>
  );
}
