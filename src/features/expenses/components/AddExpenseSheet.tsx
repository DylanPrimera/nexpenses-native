import { AppSheet, EmptyState, Text } from "@/shared";
import { messages } from "@/shared/i18n";
import { IconReceipt2 } from "@tabler/icons-react-native";

type AddExpenseSheetProps = {
  isOpen: boolean;
  onChange: (open: boolean) => void;
};

export function AddExpenseSheet({ isOpen, onChange }: AddExpenseSheetProps) {
  return (
    <AppSheet
      isOpen={isOpen}
      onChange={onChange}
      header={
        <Text role="heading" className="font-figtree-semibold text-lg tracking-tight">
          {messages.Expense.add_title}
        </Text>
      }
    >
      <EmptyState icon={IconReceipt2} title={messages.Common.coming_soon} description={messages.Common.add_expense_soon} />
    </AppSheet>
  );
}
