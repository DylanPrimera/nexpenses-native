import { useWindowDimensions, Pressable, StyleSheet, View } from "react-native";
import { useRef } from "react";
import type { AccessibilityFocusRef } from "@/shared/overlays/accessibility-focus";
import { formatCOPCurrency } from "@/core/utils/currency";
import { formatExpenseDate } from "@/core/utils/dates";
import { CategoryBadge, withAlpha } from "@/features/categories";
import { Icon } from "@/shared/components/ui/Icon";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { SURFACE_CLASS } from "@/shared/components/ui/surface-classes";
import { Text } from "@/shared/components/ui/text";
import { messages } from "@/shared/i18n";
import { IconPencil, IconReceipt2, IconTrash } from "@tabler/icons-react-native";
import type { Expense } from "../interfaces";
import { expenseDisplay, PAYMENT_LABELS } from "../lib/expense-display";

type ExpenseCardProps = {
  expense: Expense;
  pending: boolean;
  onOpen: (expense: Expense, target?: AccessibilityFocusRef) => void;
  onEdit: (expense: Expense, target?: AccessibilityFocusRef) => void;
  onDelete: (expense: Expense, target?: AccessibilityFocusRef) => void;
};

export function ExpenseCard({ expense, pending, onOpen, onEdit, onDelete }: ExpenseCardProps) {
  const { fontScale } = useWindowDimensions();
  const openRef = useRef<React.ComponentRef<typeof Pressable>>(null);
  const editRef = useRef<React.ComponentRef<typeof Pressable>>(null);
  const deleteRef = useRef<React.ComponentRef<typeof Pressable>>(null);
  const { title, detail, categoryName, categoryColor } = expenseDisplay(expense);

  return (
    <View className={`${SURFACE_CLASS} px-4 pb-1 pt-4`}>
      <Pressable
        role="button"
        accessibilityLabel={`${title}, -${formatCOPCurrency(expense.amount)} ${messages.Common.currency}${pending ? `, ${messages.Offline.pending}` : ""}`}
        ref={openRef}
        onPress={() => onOpen(expense, openRef)}
        style={StyleSheet.absoluteFill}
        className="rounded-[0.875rem] active:bg-accent"
      />
      <View
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        className="gap-2"
      >
        <View
          className={`${fontScale >= 1.3 ? "flex-col items-start" : "flex-row items-center"} justify-between gap-2`}
        >
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
            <View
              className={`${fontScale >= 1.3 ? "flex-col items-start" : "flex-row items-center"} justify-between gap-2`}
            >
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
      </View>
      <View pointerEvents="box-none" className="flex-row items-center justify-end">
        <Pressable
          role="button"
          accessibilityLabel={messages.Common.edit}
          ref={editRef}
          onPress={() => onEdit(expense, editRef)}
          className="size-12 items-center justify-center rounded-[0.5rem] active:bg-primary/15"
        >
          <Icon as={IconPencil} size={20} className="text-muted-foreground" />
        </Pressable>
        <Pressable
          role="button"
          accessibilityLabel={messages.Expense.delete_confirm_button}
          ref={deleteRef}
          onPress={() => onDelete(expense, deleteRef)}
          className="size-12 items-center justify-center rounded-[0.5rem] active:bg-destructive/15"
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
