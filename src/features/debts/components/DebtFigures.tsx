import type { Credit } from "@/core/types/domain";
import { Icon } from "@/shared/components/ui/Icon";
import { SURFACE_CLASS } from "@/shared/components/ui/surface-classes";
import { Text } from "@/shared/components/ui/text";
import { messages, tx } from "@/shared/i18n";
import { IconBuildingBank, IconCreditCard } from "@tabler/icons-react-native";
import { View } from "react-native";
import { creditMoney, formatDueDate } from "../lib/credit-display";
import { creditStatus } from "../lib/credit-status";
import { DebtFigure } from "./DebtFigure";
import { StatusBadge } from "./StatusBadge";

export function DebtFigures({ credit }: { credit: Credit }) {
  const status = creditStatus(credit.dueDate, credit.balance);
  const isCard = credit.kind === "TC";
  const { installmentNumber, installmentCount } = credit;

  return (
    <View className={`${SURFACE_CLASS} p-4`}>
      <View className="flex-row items-start gap-3">
        <View className="size-11 items-center justify-center rounded-md bg-primary/15">
          <Icon
            as={isCard ? IconCreditCard : IconBuildingBank}
            size={22}
            strokeWidth={1.75}
            className="text-primary-action"
          />
        </View>
        <View className="min-w-0 flex-1">
          <View className="flex-row items-start justify-between gap-2">
            <Text role="heading" className="shrink font-figtree-semibold text-lg leading-tight">
              {credit.displayName}
            </Text>
            <StatusBadge status={status} />
          </View>
          <Text className="mt-0.5 text-xs text-muted-foreground">
            {isCard ? messages.Debts.kind_tc : messages.Debts.kind_consumo}
          </Text>
        </View>
      </View>
      <View className="mt-4 gap-1.5">
        {isCard ? (
          <>
            <DebtFigure
              size="md"
              label={messages.Debts.min_payment}
              value={creditMoney(credit.minPayment)}
            />
            <DebtFigure
              size="md"
              label={messages.Debts.total_debt}
              value={creditMoney(credit.totalDebt)}
            />
            <DebtFigure
              size="md"
              label={messages.Debts.available_limit}
              value={creditMoney(credit.availableLimit)}
            />
            <DebtFigure
              size="md"
              label={messages.Debts.credit_limit}
              value={creditMoney(credit.creditLimit)}
            />
          </>
        ) : (
          <>
            <DebtFigure
              size="md"
              label={messages.Debts.installment}
              value={creditMoney(credit.installment)}
            />
            <DebtFigure
              size="md"
              label={messages.Debts.balance}
              value={creditMoney(credit.balance)}
            />
            {installmentNumber != null && installmentCount != null ? (
              <DebtFigure
                size="md"
                label={messages.Debts.installment_position}
                value={tx(messages.Debts.installment_fraction, {
                  current: installmentNumber,
                  total: installmentCount,
                })}
              />
            ) : null}
          </>
        )}
        {credit.bank ? (
          <DebtFigure size="md" label={messages.Debts.bank} value={credit.bank} />
        ) : null}
        <DebtFigure
          size="md"
          label={messages.Debts.due_date}
          value={formatDueDate(credit.dueDate)}
        />
      </View>
    </View>
  );
}
