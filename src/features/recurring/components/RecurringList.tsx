import { formatCOPCurrency } from "@/core/utils/currency";
import { messages } from "@/shared/i18n";
import { ConfirmDialog } from "@/shared/overlays/ConfirmDialog";
import { notifyActionError, notifySuccess } from "@/shared/toast/notify";
import { useState } from "react";
import { View } from "react-native";
import { useDeleteRecurring } from "../hooks";
import type { RecurringExpense } from "../interfaces";
import { RecurringCard } from "./RecurringCard";
import { RecurringDetailSheet } from "./RecurringDetailSheet";

export function RecurringList({ templates }: { templates: RecurringExpense[] }) {
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
    <View className="gap-2.5">
      {templates.map((template) => (
        <RecurringCard
          key={template.id}
          template={template}
          onOpen={(item) => {
            setSelected(item);
            setDetailOpen(true);
          }}
          onDelete={(item) => {
            setSelected(item);
            setDeleteOpen(true);
          }}
        />
      ))}
      <RecurringDetailSheet
        template={selected}
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        onDelete={() => setDeleteOpen(true)}
      />
      <ConfirmDialog
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
    </View>
  );
}
