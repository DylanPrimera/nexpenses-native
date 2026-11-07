import { formatCOPCurrency } from "@/core/utils/currency";
import { Field, FieldLabel } from "@/shared/components/ui/Field";
import { Input } from "@/shared/components/ui/input";
import { SURFACE_CLASS } from "@/shared/components/ui/surface-classes";
import { Text } from "@/shared/components/ui/text";
import { CurrencyInput } from "@/shared/forms/CurrencyInput";
import { useDebouncedValue } from "@/shared/hooks";
import { messages, tx } from "@/shared/i18n";
import { useState } from "react";
import { View } from "react-native";
import {
  paymentToCloseInMonths,
  projectFixedPayment,
  type PayoffProjection,
} from "../lib/credit-calculations";
import type { ProjectionModel } from "../lib/credit-projection";
import { PendingResult } from "./DebtCalculationParts";

const MAX_TARGET_MONTHS = 360;
const WHAT_IF_DEBOUNCE_MS = 400;

export function savingsCopy(
  baseline: PayoffProjection | null,
  extra: PayoffProjection | null,
): string | null {
  if (!baseline || !extra || baseline.stalled || extra.stalled) return null;
  const interestSaved = baseline.totalInterest - extra.totalInterest;
  const monthsSaved = baseline.months - extra.months;
  if (interestSaved > 0 && monthsSaved > 0) {
    return tx(messages.Debts.savings, {
      amount: formatCOPCurrency(interestSaved),
      months: monthsSaved,
    });
  }
  if (interestSaved > 0)
    return tx(messages.Debts.savings_interest_only, { amount: formatCOPCurrency(interestSaved) });
  return messages.Debts.no_extra_savings;
}

export function clampMonths(text: string): number {
  return Math.min(MAX_TARGET_MONTHS, Math.max(0, Math.trunc(Number(text)) || 0));
}

export function DebtCloseIn({ model }: { model: ProjectionModel }) {
  const [monthsText, setMonthsText] = useState("12");
  const months = clampMonths(monthsText);
  const debounced = useDebouncedValue(months, WHAT_IF_DEBOUNCE_MS);
  const pending = debounced !== months;
  const payment = paymentToCloseInMonths(model.balance, model.monthlyRate, debounced);

  return (
    <View className={`${SURFACE_CLASS} gap-3 p-3`}>
      <Field className="gap-2">
        <FieldLabel>{messages.Debts.close_in}</FieldLabel>
        <View className="flex-row items-center gap-2">
          <View className="w-20">
            <Input
              value={monthsText}
              onChangeText={(text) => {
                const digits = text.replace(/\D/g, "").slice(0, 3);
                setMonthsText(
                  digits === "" || Number(digits) <= MAX_TARGET_MONTHS
                    ? digits
                    : String(MAX_TARGET_MONTHS),
                );
              }}
              onBlur={() => setMonthsText(String(months))}
              keyboardType="number-pad"
              accessibilityLabel={messages.Debts.close_in}
            />
          </View>
          <Text className="shrink-0 text-sm text-muted-foreground">
            {messages.Debts.months_label}
          </Text>
        </View>
      </Field>
      {pending ? (
        <PendingResult label={messages.Debts.monthly_payment} />
      ) : (
        <Text className="text-sm">
          <Text className="text-sm text-muted-foreground">{`${messages.Debts.monthly_payment}: `}</Text>
          <Text className="font-figtree-semibold text-sm tabular-nums">
            {`${formatCOPCurrency(payment)} ${messages.Debts.per_month}`}
          </Text>
        </Text>
      )}
    </View>
  );
}

export function DebtExtra({ model }: { model: ProjectionModel }) {
  const [extra, setExtra] = useState(0);
  const debounced = useDebouncedValue(extra, WHAT_IF_DEBOUNCE_MS);
  const pending = debounced !== extra;
  const projection =
    debounced <= 0 || model.baselinePayment <= 0
      ? null
      : projectFixedPayment(model.balance, model.baselinePayment + debounced, model.monthlyRate);
  const copy = debounced > 0 ? savingsCopy(model.baseline, projection) : null;

  return (
    <View className={`${SURFACE_CLASS} gap-3 p-3`}>
      <Field className="gap-2">
        <FieldLabel>{messages.Debts.extra_payment}</FieldLabel>
        <CurrencyInput
          value={extra}
          onChange={setExtra}
          placeholder={messages.Debts.extra_placeholder}
          accessibilityLabel={messages.Debts.extra_payment}
        />
      </Field>
      {pending ? <PendingResult /> : copy ? <Text className="text-sm">{copy}</Text> : null}
    </View>
  );
}
