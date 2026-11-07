import type { Credit } from "@/core/types/domain";
import { Text } from "@/shared/components/ui/text";
import { messages } from "@/shared/i18n";
import { View } from "react-native";
import { formatRate } from "../lib/credit-rates";
import { projectionModel } from "../lib/credit-projection";
import { creditMoney } from "../lib/credit-display";
import { ProgressBar, Scenario, SectionTitle } from "./DebtCalculationParts";
import { DebtCloseIn, DebtExtra } from "./DebtWhatIf";

function Mix({
  capital,
  interest,
  capitalPct,
}: {
  capital: number;
  interest: number;
  capitalPct: number;
}) {
  return (
    <View className="gap-2">
      <View className="h-2 flex-row overflow-hidden rounded-md bg-accent">
        <View style={{ width: `${capitalPct}%` }} className="h-full bg-primary" />
        <View style={{ width: `${100 - capitalPct}%` }} className="h-full bg-foreground/25" />
      </View>
      <View className="flex-row justify-between">
        <Text className="font-figtree-medium text-xs text-primary-action">
          {`${messages.Debts.capital} ${creditMoney(capital)}`}
        </Text>
        <Text className="font-figtree-medium text-xs text-muted-foreground">
          {`${messages.Debts.interest} ${creditMoney(interest)}`}
        </Text>
      </View>
    </View>
  );
}

export function DebtCalculations({
  credit,
  model,
}: {
  credit: Credit;
  model: ReturnType<typeof projectionModel>;
}) {
  const isCard = credit.kind === "TC";
  const showMix = !!model.baseline && model.mixTotal > 0 && !model.baseline.stalled;

  return (
    <View className="gap-4">
      {model.progress != null ? (
        <ProgressBar
          label={isCard ? messages.Debts.utilization : messages.Debts.progress}
          percent={model.progress}
        />
      ) : null}
      <View className="gap-1">
        <View className="flex-row flex-wrap gap-x-3">
          <Text className="text-xs text-muted-foreground">
            {`${messages.Debts.rate_ea_label}: ${formatRate(credit.rateEa)}`}
          </Text>
          <Text className="text-xs text-muted-foreground">
            {`${messages.Debts.rate_mv_label}: ${formatRate(credit.rateMv)}`}
          </Text>
        </View>
        {!model.hasRate ? (
          <Text className="text-xs text-muted-foreground">{messages.Debts.no_rate}</Text>
        ) : null}
      </View>
      {showMix ? (
        <Mix capital={model.capital} interest={model.interest} capitalPct={model.capitalPct} />
      ) : null}
      <View className="gap-2">
        <SectionTitle>{messages.Debts.projection_title}</SectionTitle>
        {model.baselinePayment <= 0 ? (
          <Text className="text-sm text-muted-foreground">{messages.Debts.missing_payment}</Text>
        ) : (
          <View className="gap-2">
            {model.baseline ? (
              <Scenario
                title={isCard ? messages.Debts.payoff_min : messages.Debts.payoff_cuota}
                projection={model.baseline}
              />
            ) : null}
            {isCard ? (
              <Scenario title={messages.Debts.payoff_total} projection={model.payoffNow} />
            ) : null}
          </View>
        )}
      </View>
    </View>
  );
}

export function DebtCalculationsFooter({ model }: { model: ReturnType<typeof projectionModel> }) {
  return (
    <View className="gap-4">
      <DebtCloseIn model={model} />
      <DebtExtra model={model} />
    </View>
  );
}
