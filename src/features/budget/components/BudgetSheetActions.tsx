import { Button } from "@/shared/components/ui/button";
import { Icon } from "@/shared/components/ui/Icon";
import { Text } from "@/shared/components/ui/text";
import type { Icon as TablerIconType } from "@tabler/icons-react-native";
import { useFormikContext } from "formik";
import { View } from "react-native";
import { budgetSchema, type BudgetFormValues } from "../schemas";

type BudgetSheetActionsProps = {
  submitLabel: string;
  submitIcon: TablerIconType;
  cancelLabel?: string;
  onCancel?: () => void;
};

export function BudgetSheetActions({ submitLabel, submitIcon, cancelLabel, onCancel }: BudgetSheetActionsProps) {
  const { values, isSubmitting, submitForm } = useFormikContext<BudgetFormValues>();
  const disabled = isSubmitting || !budgetSchema.safeParse(values).success;

  return (
    <View className="flex-row gap-2">
      {onCancel && cancelLabel ? (
        <Button variant="secondary" size="lg" className="flex-1" onPress={onCancel}>
          <Text>{cancelLabel}</Text>
        </Button>
      ) : null}
      <Button size="lg" className="flex-1" disabled={disabled} onPress={() => void submitForm()}>
        <Icon as={submitIcon} size={18} className="text-primary-foreground" />
        <Text className="font-figtree-semibold">{submitLabel}</Text>
      </Button>
    </View>
  );
}
