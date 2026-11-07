import type { AccessibilityFocusRef } from "@/shared/overlays/accessibility-focus";
import { formatCOPCurrency } from "@/core/utils/currency";
import { messages } from "@/shared/i18n";
import { ConfirmDialog } from "@/shared/overlays/ConfirmDialog";
import { notifyActionError, notifySuccess } from "@/shared/toast/notify";
import { useState } from "react";
import { FlatList, View, type FlatListProps } from "react-native";
import { listRows, type DataRow } from "@/shared/layout/list-rows";
import { useDeleteRecurring } from "../hooks";
import type { RecurringExpense } from "../interfaces";
import { RecurringCardSkeleton, RecurringCard } from "./RecurringCard";
import { RecurringDetailSheet } from "./RecurringDetailSheet";

export function RecurringList({
  templates,
  loading,
  ...props
}: { templates: RecurringExpense[]; loading?: boolean } & Omit<
  FlatListProps<DataRow<RecurringExpense>>,
  "data" | "renderItem"
>) {
  const [returnFocusRef, setReturnFocusRef] = useState<AccessibilityFocusRef | undefined>(
    undefined,
  );
  const [selected, setSelected] = useState<RecurringExpense | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { mutateAsync: deleteRecurring } = useDeleteRecurring();

  const confirmDelete = async () => {
    if (!selected) return;
    setDetailOpen(false);
    try {
      await deleteRecurring(selected.id);
      notifySuccess(messages.Recurring.delete_success);
    } catch (error) {
      notifyActionError(error, messages.Recurring.delete_error);
    }
  };

  return (
    <>
      <FlatList
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        data={listRows(templates, loading)}
        keyExtractor={(row) => row.id}
        renderItem={({ item }) => (
          <View className="pb-2.5">
            {item.kind === "skeleton" ? (
              <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
                <RecurringCardSkeleton />
              </View>
            ) : (
              <RecurringCard
                template={item.record}
                onOpen={(record, target) => {
                  setReturnFocusRef(target);
                  setSelected(record);
                  setDetailOpen(true);
                }}
                onDelete={(record, target) => {
                  setReturnFocusRef(target);
                  setSelected(record);
                  setDeleteOpen(true);
                }}
              />
            )}
          </View>
        )}
        initialNumToRender={10}
        windowSize={7}
        removeClippedSubviews={false}
        {...props}
      />
      <RecurringDetailSheet
        returnFocusRef={returnFocusRef}
        template={selected}
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        onDelete={() => setDeleteOpen(true)}
      />
      <ConfirmDialog
        returnFocusRef={returnFocusRef}
        isOpen={deleteOpen}
        title={messages.Recurring.delete_confirm_title}
        description={messages.Recurring.delete_confirm_description}
        confirmLabel={messages.Common.delete}
        isDestructive
        preview={
          selected
            ? {
                title: selected.title,
                amount: `${formatCOPCurrency(selected.amount)} ${messages.Common.currency}`,
              }
            : undefined
        }
        onConfirm={() => void confirmDelete()}
        onClose={() => setDeleteOpen(false)}
      />
    </>
  );
}
