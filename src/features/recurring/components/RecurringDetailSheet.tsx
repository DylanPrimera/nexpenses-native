import type { AccessibilityFocusRef } from "@/shared/overlays/accessibility-focus";
import { formatCOPCurrency } from "@/core/utils/currency";
import { CategoryBadge } from "@/features/categories";
import { Button } from "@/shared/components/ui/button";
import { Icon } from "@/shared/components/ui/Icon";
import { FIELD_LABEL_CLASS } from "@/shared/components/ui/surface-classes";
import { Text } from "@/shared/components/ui/text";
import { messages } from "@/shared/i18n";
import { AppSheet } from "@/shared/overlays/AppSheet";
import { IconRepeat, IconTrash } from "@tabler/icons-react-native";
import { View } from "react-native";
import type { RecurringExpense } from "../interfaces";
import { recurringDisplay } from "../lib/recurring-display";

type RecurringDetailSheetProps = {
  template: RecurringExpense | null;
  isOpen: boolean;
  returnFocusRef?: AccessibilityFocusRef;
  onClose: () => void;
  onDelete: () => void;
};

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View className="flex-row items-center justify-between gap-3">
      <Text className={FIELD_LABEL_CLASS}>{label}</Text>
      {children}
    </View>
  );
}

export function RecurringDetailSheet({
  returnFocusRef,
  template,
  isOpen,
  onClose,
  onDelete,
}: RecurringDetailSheetProps) {
  const display = template ? recurringDisplay(template) : null;

  return (
    <AppSheet
      returnFocusRef={returnFocusRef}
      isOpen={isOpen && !!template}
      onChange={(open) => {
        if (!open) onClose();
      }}
      header={
        <View className="flex-row items-center gap-3">
          <View className="size-11 items-center justify-center rounded-[0.875rem] bg-primary/15">
            <Icon as={IconRepeat} size={22} strokeWidth={1.75} className="text-primary-action" />
          </View>
          <View className="min-w-0 flex-1">
            <Text
              role="heading"
              className="font-figtree-semibold text-lg leading-tight tracking-tight"
            >
              {messages.Recurring.detail_title}
            </Text>
            <Text className="mt-0.5 text-sm text-muted-foreground">
              {messages.Recurring.detail_subtitle}
            </Text>
          </View>
        </View>
      }
    >
      {template && display ? (
        <View className="gap-3">
          <DetailRow label={messages.Expense.amount_label}>
            <Text className="font-figtree-medium text-sm tabular-nums">
              {`${formatCOPCurrency(template.amount)} ${messages.Common.currency}`}
            </Text>
          </DetailRow>
          <View className="flex-row items-start justify-between gap-3">
            <Text className={FIELD_LABEL_CLASS}>{messages.Expense.title_label}</Text>
            <Text className="flex-1 text-right font-figtree-medium text-sm">{template.title}</Text>
          </View>
          <DetailRow label={messages.Expense.category_label}>
            <CategoryBadge name={display.categoryName} color={display.categoryColor} />
          </DetailRow>
          <DetailRow label={messages.Expense.payment_label}>
            <Text className="font-figtree-medium text-sm">{display.paymentLabel}</Text>
          </DetailRow>
          <View className="gap-1">
            <Text className={FIELD_LABEL_CLASS}>{messages.Expense.description_label}</Text>
            <Text className="font-figtree-medium text-sm">{template.description}</Text>
          </View>
          <Button variant="destructive" size="lg" className="mt-2" onPress={onDelete}>
            <Icon as={IconTrash} size={20} />
            <Text>{messages.Common.delete}</Text>
          </Button>
        </View>
      ) : null}
    </AppSheet>
  );
}
