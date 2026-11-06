import { formatExpenseDate } from "@/core/utils/dates";
import { CategoryBadge } from "@/features/categories";
import { Icon } from "@/shared/components/ui/Icon";
import { FIELD_LABEL_CLASS } from "@/shared/components/ui/surface-classes";
import { Text } from "@/shared/components/ui/text";
import { messages } from "@/shared/i18n";
import { AppSheet } from "@/shared/overlays/AppSheet";
import { IconReceipt2 } from "@tabler/icons-react-native";
import { View } from "react-native";
import type { Expense } from "../interfaces";
import { expenseAmountLabel, expenseDisplay, PAYMENT_LABELS } from "../lib/expense-display";

type ExpenseDetailSheetProps = {
  expense: Expense | null;
  isOpen: boolean;
  onClose: () => void;
};

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View className="flex-row items-center justify-between gap-3">
      <Text className={FIELD_LABEL_CLASS}>{label}</Text>
      {children}
    </View>
  );
}

export function ExpenseDetailSheet({ expense, isOpen, onClose }: ExpenseDetailSheetProps) {
  const display = expense ? expenseDisplay(expense) : null;
  const description = expense?.description?.trim();

  return (
    <AppSheet
      isOpen={isOpen && !!expense}
      onChange={(open) => {
        if (!open) onClose();
      }}
      header={
        <View className="flex-row items-center gap-3">
          <View className="size-11 items-center justify-center rounded-[0.875rem] bg-primary/15">
            <Icon as={IconReceipt2} size={22} strokeWidth={1.75} className="text-primary" />
          </View>
          <View className="min-w-0 flex-1">
            <Text role="heading" className="font-figtree-semibold text-lg leading-tight tracking-tight">
              {messages.Expense.detail_title}
            </Text>
            <Text className="mt-0.5 text-sm text-muted-foreground">{messages.Expense.detail_subtitle}</Text>
          </View>
        </View>
      }
    >
      {expense && display ? (
        <View className="gap-3">
          <DetailRow label={messages.Expense.amount_label}>
            <Text className="font-figtree-medium text-sm tabular-nums">{expenseAmountLabel(expense.amount)}</Text>
          </DetailRow>
          <View className="flex-row items-start justify-between gap-3">
            <Text className={FIELD_LABEL_CLASS}>{messages.Expense.title_label}</Text>
            <Text className="flex-1 text-right font-figtree-medium text-sm">{display.title}</Text>
          </View>
          <DetailRow label={messages.Expense.category_label}>
            <CategoryBadge name={display.categoryName} color={display.categoryColor} />
          </DetailRow>
          <DetailRow label={messages.Expense.payment_label}>
            <Text className="font-figtree-medium text-sm">{PAYMENT_LABELS[expense.paymentType]}</Text>
          </DetailRow>
          {expense.creditId ? (
            <DetailRow label={messages.Expense.credit_linked}>
              <Text className="font-figtree-medium text-sm">{messages.Expense.credit_switch}</Text>
            </DetailRow>
          ) : null}
          <DetailRow label={messages.Expense.date_label}>
            <Text className="font-figtree-medium text-sm">{formatExpenseDate(expense.date)}</Text>
          </DetailRow>
          {description && description !== display.title ? (
            <View className="gap-1">
              <Text className={FIELD_LABEL_CLASS}>{messages.Expense.description_label}</Text>
              <Text className="font-figtree-medium text-sm">{description}</Text>
            </View>
          ) : null}
        </View>
      ) : null}
    </AppSheet>
  );
}
