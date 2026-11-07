import { formatCOP, formatCOPCurrency } from "@/core/utils/currency";
import { Icon } from "@/shared/components/ui/Icon";
import { FIELD_LABEL_CLASS, SURFACE_CLASS } from "@/shared/components/ui/surface-classes";
import { Text } from "@/shared/components/ui/text";
import { messages, transactionCount, tx } from "@/shared/i18n";
import {
  IconAlertTriangle,
  IconBolt,
  IconChartBar,
  IconCircleCheck,
  IconTrendingDown,
  IconWallet,
  type Icon as TablerIconType,
} from "@tabler/icons-react-native";
import { View, useWindowDimensions } from "react-native";
import type { CycleSummary } from "../interfaces";
import { budgetPace, dailyAllowance, progressWidth, type BudgetPace } from "../lib/budget-pace";

const PACE_STYLES: Record<
  BudgetPace,
  { label: string; icon: TablerIconType; chip: string; text: string }
> = {
  over: {
    label: messages.Budget.over_budget,
    icon: IconAlertTriangle,
    chip: "bg-destructive/15",
    text: "text-destructive",
  },
  warning: {
    label: messages.Budget.pace_warning,
    icon: IconAlertTriangle,
    chip: "bg-muted",
    text: "text-foreground",
  },
  healthy: {
    label: messages.Budget.pace_healthy,
    icon: IconCircleCheck,
    chip: "bg-primary/15",
    text: "text-foreground",
  },
};

export function BudgetProgressCard({ summary }: { summary: CycleSummary }) {
  const { fontScale } = useWindowDimensions();
  const largeText = fontScale >= 1.3;
  const { budget, spent, remaining, percentage, daysLeft, isOverBudget, expenseCount } = summary;
  const pace = PACE_STYLES[budgetPace(percentage, isOverBudget)];
  const daily = dailyAllowance(remaining, daysLeft);

  return (
    <View className="gap-3">
      <View className={`${SURFACE_CLASS} p-4`}>
        <View className="flex-row flex-wrap items-center justify-between gap-2">
          <Text className={FIELD_LABEL_CLASS}>{messages.Budget.available_to_spend}</Text>
          <View className={`flex-row items-center gap-1 rounded-md px-2 py-0.5 ${pace.chip}`}>
            <Icon as={pace.icon} size={13} strokeWidth={2} className={pace.text} />
            <Text className={`font-figtree-medium text-xs ${pace.text}`}>{pace.label}</Text>
          </View>
        </View>

        <View className="mt-2 flex-row flex-wrap items-baseline gap-1.5">
          <Text className="font-figtree-bold text-lg text-primary-action">$</Text>
          <Text
            className={`shrink font-figtree-bold text-4xl tabular-nums tracking-tight ${isOverBudget ? "text-destructive" : "text-foreground"}`}
          >
            {formatCOP(Math.abs(remaining))}
          </Text>
          <Text className={FIELD_LABEL_CLASS}>{messages.Common.currency}</Text>
        </View>

        <View className="mt-4 gap-2">
          <View className="flex-row flex-wrap items-center justify-between gap-2">
            <Text className="font-figtree-semibold text-sm text-muted-foreground">
              {tx(messages.Budget.consumed, { percent: percentage })}
            </Text>
            <Text className="shrink font-figtree-medium text-xs tabular-nums text-muted-foreground">
              {formatCOPCurrency(spent)}
              <Text className="font-figtree-medium text-xs text-muted-foreground">
                {` / ${formatCOPCurrency(budget)}`}
              </Text>
            </Text>
          </View>
          <View className="h-2 w-full overflow-hidden rounded-md bg-accent">
            <View
              style={{ width: `${progressWidth(percentage)}%` }}
              className={`h-full rounded-md ${isOverBudget ? "bg-destructive" : "bg-primary"}`}
            />
          </View>
        </View>

        {isOverBudget ? (
          <View className="mt-3 flex-row items-center gap-2 rounded-md bg-destructive/10 px-3 py-2">
            <Icon as={IconAlertTriangle} size={16} className="text-destructive" />
            <Text className="flex-1 font-figtree-medium text-xs text-destructive">
              {`${messages.Budget.over_budget}: ${formatCOPCurrency(Math.abs(remaining))}`}
            </Text>
          </View>
        ) : null}
      </View>

      <View className={`${largeText ? "flex-col" : "flex-row"} gap-2`}>
        <View className={`${SURFACE_CLASS} flex-[1.2] justify-between p-4`}>
          <View className="flex-row items-center gap-2">
            <Icon as={IconWallet} size={16} className="text-muted-foreground" />
            <Text className={FIELD_LABEL_CLASS}>{messages.Settings.budget_section}</Text>
          </View>
          <View className="mt-2">
            <Text className="font-figtree-semibold text-lg tabular-nums tracking-tight">
              {formatCOPCurrency(budget)}
            </Text>
            <Text className="text-xs text-muted-foreground">{messages.Budget.monthly_cap}</Text>
          </View>
        </View>

        <View className={`${SURFACE_CLASS} flex-1 justify-between p-4`}>
          <View className="flex-row items-center gap-2">
            <Icon as={IconTrendingDown} size={16} className="text-primary-action" />
            <Text className={`shrink ${FIELD_LABEL_CLASS}`}>{messages.Budget.spent_total}</Text>
          </View>
          <View className="mt-2">
            <Text className="font-figtree-semibold text-lg tabular-nums tracking-tight text-primary-action">
              {formatCOPCurrency(spent)}
            </Text>
            <Text className="text-xs text-muted-foreground">{transactionCount(expenseCount)}</Text>
          </View>
        </View>
      </View>

      {daily > 0 ? (
        <View className={`${SURFACE_CLASS} flex-row items-center justify-between p-4`}>
          <View className="min-w-0 flex-1 flex-row items-center gap-3">
            <View className="size-10 items-center justify-center rounded-md bg-primary/15">
              <Icon as={IconChartBar} size={20} className="text-primary-action" />
            </View>
            <View className="min-w-0 flex-1">
              <Text className={FIELD_LABEL_CLASS}>{messages.Budget.daily_allowance}</Text>
              <Text className="font-figtree-semibold text-lg tabular-nums tracking-tight">
                {`${formatCOPCurrency(daily)} `}
                <Text className="text-xs text-muted-foreground">{messages.Budget.per_day}</Text>
              </Text>
            </View>
          </View>
          <View className="size-7 items-center justify-center rounded-md bg-muted">
            <Icon as={IconBolt} size={16} className="text-primary-action" />
          </View>
        </View>
      ) : null}
    </View>
  );
}
