import { formatCOPCurrency } from "@/core/utils/currency";
import { SURFACE_CLASS } from "@/shared/components/ui/surface-classes";
import { Text } from "@/shared/components/ui/text";
import { messages } from "@/shared/i18n";
import { View } from "react-native";
import type { PayoffProjection } from "../lib/credit-calculations";
import { monthsLabel } from "../lib/credit-display";

export function SectionTitle({ children }: { children: string }) {
  return (
    <Text
      role="heading"
      className="font-figtree-semibold text-xs uppercase tracking-wide text-muted-foreground"
    >
      {children}
    </Text>
  );
}

export function ProgressBar({ label, percent }: { label: string; percent: number }) {
  const width = Math.min(100, Math.max(0, percent));

  return (
    <View className="gap-2">
      <View className="flex-row items-center justify-between">
        <Text className="font-figtree-semibold text-sm text-muted-foreground">{label}</Text>
        <Text className="font-figtree-semibold text-sm tabular-nums">{`${Math.round(width)}%`}</Text>
      </View>
      <View className="h-2 w-full overflow-hidden rounded-md bg-accent">
        <View style={{ width: `${width}%` }} className="h-full rounded-md bg-primary" />
      </View>
    </View>
  );
}

function ScenarioRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between gap-2">
      <Text className="text-xs text-muted-foreground">{label}</Text>
      <Text className="font-figtree-semibold text-xs tabular-nums">{value}</Text>
    </View>
  );
}

export function Scenario({ title, projection }: { title: string; projection: PayoffProjection }) {
  return (
    <View className={`${SURFACE_CLASS} gap-2 p-3`}>
      <Text className="font-figtree-semibold text-sm">{title}</Text>
      {projection.stalled ? (
        <Text className="text-xs leading-relaxed text-destructive">{messages.Debts.stalled}</Text>
      ) : (
        <View className="gap-1">
          <ScenarioRow
            label={messages.Debts.term_label}
            value={
              projection.months === 0 ? messages.Debts.payoff_today : monthsLabel(projection.months)
            }
          />
          <ScenarioRow
            label={messages.Debts.total_paid}
            value={formatCOPCurrency(projection.totalPaid)}
          />
          <ScenarioRow
            label={messages.Debts.interest_total}
            value={formatCOPCurrency(projection.totalInterest)}
          />
        </View>
      )}
    </View>
  );
}

export function PendingResult({ label }: { label?: string }) {
  return (
    <View role="status" className="flex-row items-center gap-2">
      {label ? <Text className="text-sm text-muted-foreground">{`${label}:`}</Text> : null}
      <Text className="text-sm text-muted-foreground">{messages.Debts.calculating}</Text>
    </View>
  );
}
