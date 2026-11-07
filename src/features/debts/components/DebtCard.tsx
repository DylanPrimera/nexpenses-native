import { useWindowDimensions, Pressable, View } from "react-native";
import type { Credit } from "@/core/types/domain";
import { Icon } from "@/shared/components/ui/Icon";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { SURFACE_CLASS } from "@/shared/components/ui/surface-classes";
import { Text } from "@/shared/components/ui/text";
import { messages } from "@/shared/i18n";
import { IconBuildingBank, IconCreditCard } from "@tabler/icons-react-native";
import { router } from "expo-router";
import { creditMoney, formatDueDate, installmentLabel, showsBank } from "../lib/credit-display";
import { creditStatus } from "../lib/credit-status";
import { DebtFigure } from "./DebtFigure";
import { StatusBadge } from "./StatusBadge";

export function DebtCard({ credit }: { credit: Credit }) {
  const { fontScale } = useWindowDimensions();
  const status = creditStatus(credit.dueDate, credit.balance);
  const position = installmentLabel(credit);

  return (
    <Pressable
      role="button"
      accessibilityLabel={credit.displayName}
      onPress={() => router.push({ pathname: "/debts/[id]", params: { id: credit.id } })}
      className={`${SURFACE_CLASS} gap-3 p-4 active:bg-accent`}
    >
      <View className="flex-row items-start gap-3">
        <View className="size-11 items-center justify-center rounded-md bg-primary/15">
          <Icon
            as={credit.kind === "TC" ? IconCreditCard : IconBuildingBank}
            size={22}
            strokeWidth={1.75}
            className="text-primary-action"
          />
        </View>
        <View className="min-w-0 flex-1">
          <View
            className={`${fontScale >= 1.3 ? "flex-col" : "flex-row"} items-start justify-between gap-2`}
          >
            <Text numberOfLines={1} className="shrink font-figtree-semibold text-base">
              {credit.displayName}
            </Text>
            <StatusBadge status={status} />
          </View>
          {showsBank(credit) ? (
            <Text numberOfLines={1} className="text-xs text-muted-foreground">
              {credit.bank}
            </Text>
          ) : null}
          {position ? <Text className="text-xs text-muted-foreground">{position}</Text> : null}
        </View>
      </View>
      <View className="gap-1">
        {credit.kind === "TC" ? (
          <>
            <DebtFigure label={messages.Debts.min_payment} value={creditMoney(credit.minPayment)} />
            <DebtFigure label={messages.Debts.total_debt} value={creditMoney(credit.totalDebt)} />
            <DebtFigure
              label={messages.Debts.available_limit}
              value={creditMoney(credit.availableLimit)}
            />
          </>
        ) : (
          <>
            <DebtFigure
              label={messages.Debts.installment}
              value={creditMoney(credit.installment)}
            />
            <DebtFigure label={messages.Debts.balance} value={creditMoney(credit.balance)} />
          </>
        )}
        <DebtFigure label={messages.Debts.due_date} value={formatDueDate(credit.dueDate)} />
      </View>
    </Pressable>
  );
}

export function DebtCardSkeleton() {
  return (
    <View className={`${SURFACE_CLASS} gap-3 p-4`}>
      <View className="flex-row items-center gap-3">
        <Skeleton className="size-11 rounded-md" />
        <View className="flex-1 gap-2">
          <Skeleton className="h-4 w-3/5 rounded-md" />
          <Skeleton className="h-3 w-2/5 rounded-md" />
        </View>
      </View>
      <Skeleton className="h-3 w-full rounded-md" />
      <Skeleton className="h-3 w-full rounded-md" />
    </View>
  );
}
