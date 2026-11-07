import { formatCOPCurrency } from "@/core/utils/currency";
import { Text } from "@/shared/components/ui/text";
import { messages } from "@/shared/i18n";
import { useState } from "react";
import { Pressable, View } from "react-native";
import type { AmortizationResult } from "../lib/credit-calculations";
import { SectionTitle } from "./DebtCalculationParts";

const VISIBLE_ROWS = 8;

function Cell({
  children,
  bold = false,
  align = "left",
}: {
  children: string;
  bold?: boolean;
  align?: "left" | "right";
}) {
  return (
    <Text
      numberOfLines={1}
      className={`flex-1 px-2 py-1.5 text-xs tabular-nums ${bold ? "font-figtree-medium text-muted-foreground" : ""} ${align === "right" ? "text-right" : ""}`}
    >
      {children}
    </Text>
  );
}

export function DebtAmortization({ schedule }: { schedule: AmortizationResult | null }) {
  const [showAll, setShowAll] = useState(false);
  const rows = schedule?.rows ?? [];
  if (!schedule || rows.length === 0) return null;
  const visible = showAll ? rows : rows.slice(0, VISIBLE_ROWS);

  return (
    <View className="gap-2">
      <SectionTitle>{messages.Debts.amortization}</SectionTitle>
      <View className="overflow-hidden rounded-[0.875rem] border border-border">
        <View className="flex-row bg-muted">
          <Cell bold>{messages.Debts.col_installment}</Cell>
          <Cell bold>{messages.Debts.col_capital}</Cell>
          <Cell bold>{messages.Debts.col_interest}</Cell>
          <Cell bold align="right">
            {messages.Debts.col_balance}
          </Cell>
        </View>
        {visible.map((row) => (
          <View key={row.number} className="flex-row border-t border-border">
            <Cell>{String(row.number)}</Cell>
            <Cell>{formatCOPCurrency(row.capital)}</Cell>
            <Cell>{formatCOPCurrency(row.interest)}</Cell>
            <Cell align="right">{formatCOPCurrency(row.balance)}</Cell>
          </View>
        ))}
      </View>
      {rows.length > VISIBLE_ROWS ? (
        <Pressable
          role="button"
          hitSlop={8}
          onPress={() => setShowAll((open) => !open)}
          className="self-start"
        >
          <Text className="font-figtree-semibold text-xs text-primary">
            {showAll ? messages.Debts.show_less_rows : messages.Debts.show_all_rows}
          </Text>
        </Pressable>
      ) : null}
      {schedule.stalled ? (
        <Text className="text-xs text-destructive">{messages.Debts.stalled}</Text>
      ) : null}
    </View>
  );
}
