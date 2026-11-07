import { localDayKey } from "@/core/utils/budget-cycle";
import { formatCOPCurrency } from "@/core/utils/currency";
import {
  BudgetEditSheet,
  budgetPace,
  progressWidth,
  type CycleSummary,
  type UserProfile,
} from "@/features/budget";
import { Button } from "@/shared/components/ui/button";
import { formatPickedDate } from "@/shared/components/ui/calendar-grid";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { Icon } from "@/shared/components/ui/Icon";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { FIELD_LABEL_CLASS, SURFACE_CLASS } from "@/shared/components/ui/surface-classes";
import { Text } from "@/shared/components/ui/text";
import { messages, tx } from "@/shared/i18n";
import { IconCloudOff, IconPencil } from "@tabler/icons-react-native";
import { useState } from "react";
import { View, useWindowDimensions } from "react-native";

type BudgetSettingsCardProps = {
  profile: UserProfile | undefined;
  summary: CycleSummary | undefined;
  hasError: boolean;
  onRetry: () => void;
};

function StatRow({
  label,
  value,
  danger = false,
}: {
  label: string;
  value: string;
  danger?: boolean;
}) {
  const { fontScale } = useWindowDimensions();
  const valueClass = danger ? "text-destructive" : "text-foreground";

  return (
    <View
      className={`${fontScale >= 1.3 ? "flex-col items-start" : "flex-row items-center"} justify-between gap-3`}
    >
      <Text className="text-sm text-muted-foreground">{label}</Text>
      <Text className={`shrink font-figtree-semibold text-sm tabular-nums ${valueClass}`}>
        {value}
      </Text>
    </View>
  );
}

function BudgetSkeleton() {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      className={`${SURFACE_CLASS} gap-3 p-4`}
    >
      <Skeleton className="h-4 w-1/2 rounded-md" />
      <Skeleton className="h-8 w-2/3 rounded-md" />
      <Skeleton className="h-2 w-full rounded-md" />
      <Skeleton className="h-4 w-full rounded-md" />
      <Skeleton className="h-4 w-full rounded-md" />
    </View>
  );
}

export function BudgetSettingsCard({
  profile,
  summary,
  hasError,
  onRetry,
}: BudgetSettingsCardProps) {
  const { fontScale } = useWindowDimensions();
  const [editOpen, setEditOpen] = useState(false);

  if (!profile || !summary) {
    if (!hasError) return <BudgetSkeleton />;
    return (
      <View className="gap-3">
        <EmptyState
          icon={IconCloudOff}
          title={messages.Settings.budget_load_error}
          description={messages.Common.load_error_description}
        />
        <Button variant="secondary" onPress={onRetry}>
          <Text>{messages.Common.retry}</Text>
        </Button>
      </View>
    );
  }

  const configured = profile.budget > 0;
  const overBudget = summary.isOverBudget;
  const barClass = overBudget ? "bg-destructive" : "bg-primary";

  return (
    <>
      <View className={`${SURFACE_CLASS} gap-3 p-4`}>
        <View className="flex-row items-start justify-between gap-3">
          <View className="min-w-0 flex-1">
            <Text className={FIELD_LABEL_CLASS}>{messages.Settings.current_budget}</Text>
            <Text className="font-figtree-bold text-2xl tabular-nums tracking-tight">
              {configured
                ? formatCOPCurrency(profile.budget)
                : messages.Settings.budget_not_configured}
            </Text>
          </View>
          <Button
            variant="secondary"
            size="sm"
            className={fontScale > 1 ? undefined : "h-9"}
            style={fontScale > 1 ? undefined : { paddingVertical: 0 }}
            onPress={() => setEditOpen(true)}
          >
            <Icon as={IconPencil} size={16} className="text-primary" />
            <Text className="font-figtree-semibold text-primary">
              {messages.Settings.edit_budget_button}
            </Text>
          </Button>
        </View>
        {configured ? (
          <View className="gap-2">
            <View className="h-2 w-full overflow-hidden rounded-md bg-accent">
              <View
                style={{ width: `${progressWidth(summary.percentage)}%` }}
                className={`h-full rounded-md ${barClass}`}
              />
            </View>
            <Text
              className={`font-figtree-medium text-xs ${
                budgetPace(summary.percentage, overBudget) === "over"
                  ? "text-destructive"
                  : "text-muted-foreground"
              }`}
            >
              {tx(messages.Budget.consumed, { percent: summary.percentage })}
            </Text>
          </View>
        ) : null}
        <View className="gap-2 border-t border-border pt-3">
          <StatRow
            label={messages.Budget.cycle_start_label}
            value={formatPickedDate(localDayKey(profile.cycleStartedAt))}
          />
          <StatRow label={messages.Budget.spent} value={formatCOPCurrency(summary.spent)} />
          <StatRow
            label={messages.Budget.remaining}
            value={formatCOPCurrency(summary.remaining)}
            danger={overBudget}
          />
        </View>
      </View>
      <BudgetEditSheet isOpen={editOpen} onClose={() => setEditOpen(false)} profile={profile} />
    </>
  );
}
