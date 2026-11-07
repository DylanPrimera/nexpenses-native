import { usePendingExpenses } from "../hooks/usePendingExpenses";
import { formatCOPCurrency } from "@/core/utils/currency";
import { formatExpenseDate } from "@/core/utils/dates";
import { CategoryBadge, withAlpha } from "@/features/categories";
import { Icon } from "@/shared/components/ui/Icon";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { SURFACE_CLASS } from "@/shared/components/ui/surface-classes";
import { Text } from "@/shared/components/ui/text";
import { messages } from "@/shared/i18n";
import { IconPencil, IconReceipt2, IconTrash } from "@tabler/icons-react-native";
import { Pressable, View } from "react-native";
import type { Expense } from "../interfaces";
import { expenseDisplay, PAYMENT_LABELS } from "../lib/expense-display";

type ExpenseCardProps = {
  expense: Expense;
  onOpen: (expense: Expense) => void;
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
};

export function ExpenseCard({ expense, onOpen, onEdit, onDelete }: ExpenseCardProps) {
  const { title, detail, categoryName, categoryColor } = expenseDisplay(expense);
  const pending = usePendingExpenses().some((item) => item.expense.id === expense.id);

  return (
    <View className={`${SURFACE_CLASS} px-4 pb-1 pt-4`}>
      <Pressable
        role="button"
        accessibilityLabel={`${title}, -${formatCOPCurrency(expense.amount)} ${messages.Common.currency}${pending ? `, ${messages.Offline.pending}` : ""}`}
        onPress={() => onOpen(expense)}
        className="gap-2 rounded-md active:opacity-80"
      >
        <View className="flex-row items-center justify-between gap-2">
          <Text className="font-figtree-medium text-xs text-muted-foreground">
            {formatExpenseDate(expense.date)}
          </Text>
          <View className="shrink flex-row items-center gap-1">
            {pending ? (
              <Text className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {messages.Offline.pending}
              </Text>
            ) : null}
            <CategoryBadge name={categoryName} color={categoryColor} size="sm" />
            <View className="rounded-md bg-primary/15 px-2 py-0.5">
              <Text numberOfLines={1} className="font-figtree-medium text-xs text-primary">
                {PAYMENT_LABELS[expense.paymentType]}
              </Text>
            </View>
          </View>
        </View>
        <View className="flex-row items-center gap-2">
          <View
            style={{ backgroundColor: withAlpha(categoryColor, 0.2) }}
            className="size-11 items-center justify-center rounded-md"
          >
            <IconReceipt2 size={22} strokeWidth={1.75} color={categoryColor} />
          </View>
          <View className="min-w-0 flex-1 gap-1">
            <View className="flex-row items-center justify-between gap-2">
              <Text numberOfLines={1} className="shrink font-figtree-semibold text-base">
                {title}
              </Text>
              <Text className="font-figtree-bold text-lg tabular-nums tracking-tight">
                {`-${formatCOPCurrency(expense.amount)} `}
                <Text className="text-xs text-muted-foreground">{messages.Common.currency}</Text>
              </Text>
            </View>
            {detail ? (
              <Text numberOfLines={1} className="text-xs text-muted-foreground">
                {detail}
              </Text>
            ) : null}
          </View>
        </View>
      </Pressable>
      <View className="flex-row items-center justify-end">
        <Pressable
          role="button"
          accessibilityLabel={messages.Common.edit}
          onPress={() => onEdit(expense)}
          className="size-11 items-center justify-center rounded-[0.5rem] active:bg-primary/15"
        >
          <Icon as={IconPencil} size={20} className="text-muted-foreground" />
        </Pressable>
        <Pressable
          role="button"
          accessibilityLabel={messages.Expense.delete_confirm_button}
          onPress={() => onDelete(expense)}
          className="size-11 items-center justify-center rounded-[0.5rem] active:bg-destructive/15"
        >
          <Icon as={IconTrash} size={20} className="text-muted-foreground" />
        </Pressable>
      </View>
    </View>
  );
}

export function ExpenseCardSkeleton() {
  return (
    <View className={`${SURFACE_CLASS} gap-3 p-4`}>
      <View className="flex-row items-center justify-between">
        <Skeleton className="h-3 w-20 rounded-md" />
        <Skeleton className="h-4 w-28 rounded-md" />
      </View>
      <View className="flex-row items-center gap-2">
        <Skeleton className="size-11 rounded-md" />
        <View className="flex-1 gap-2">
          <Skeleton className="h-4 w-3/5 rounded-md" />
          <Skeleton className="h-3 w-2/5 rounded-md" />
        </View>
      </View>
    </View>
  );
}
