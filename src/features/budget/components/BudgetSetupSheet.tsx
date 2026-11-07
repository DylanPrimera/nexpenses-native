import { cycleStartFromDayKey, localDayKey } from "@/core/utils/budget-cycle";
import { Icon } from "@/shared/components/ui/Icon";
import { Text } from "@/shared/components/ui/text";
import { FormCurrencyField } from "@/shared/forms/FormCurrencyField";
import { zodFormikValidate } from "@/shared/forms/zod-formik";
import { messages } from "@/shared/i18n";
import { AppSheet } from "@/shared/overlays/AppSheet";
import { notifyActionError, notifySuccess } from "@/shared/toast/notify";
import { IconSparkles, IconWallet } from "@tabler/icons-react-native";
import { FormikProvider, useFormik } from "formik";
import { View } from "react-native";
import { useUpdateBudget } from "../hooks";
import { budgetSchema, type BudgetFormValues } from "../schemas";
import { BudgetSetupPresets } from "./BudgetPresets";
import { BudgetSheetActions } from "./BudgetSheetActions";
import { CycleStartField } from "./CycleStartField";

const SETUP_ICON = IconWallet;

export function BudgetSetupSheet({ isOpen }: { isOpen: boolean }) {
  const { mutateAsync } = useUpdateBudget();
  const formik = useFormik<BudgetFormValues>({
    initialValues: { amount: 0, cycleDay: localDayKey(), isNewCycle: true },
    validate: zodFormikValidate(budgetSchema),
    onSubmit: async ({ amount, cycleDay }) => {
      try {
        await mutateAsync({ budget: amount, cycleStartedAt: cycleStartFromDayKey(cycleDay) });
        notifySuccess(messages.Budget.created_toast);
      } catch (error) {
        notifyActionError(error);
      }
    },
  });

  return (
    <AppSheet
      isOpen={isOpen}
      onChange={() => undefined}
      dismissible={false}
      footer={
        <FormikProvider value={formik}>
          <BudgetSheetActions submitLabel={messages.Budget.save_button} submitIcon={SETUP_ICON} />
        </FormikProvider>
      }
    >
      <FormikProvider value={formik}>
        <View className="gap-4">
          <View className="items-center">
            <View className="mb-4 size-14 items-center justify-center rounded-[0.875rem] bg-primary/15">
              <Icon as={SETUP_ICON} size={32} strokeWidth={2} className="text-primary" />
            </View>
            <View className="mb-2 flex-row items-center gap-1.5 rounded-md bg-primary/10 px-3 py-1">
              <Icon as={IconSparkles} size={14} className="text-primary" />
              <Text className="font-figtree-medium text-xs text-primary">
                {messages.Meta.app_name}
              </Text>
            </View>
            <Text role="heading" className="text-center font-figtree-bold text-xl tracking-tight">
              {messages.Budget.setup_title}
            </Text>
            <Text className="mt-1 text-center text-sm text-muted-foreground">
              {messages.Budget.setup_description}
            </Text>
          </View>
          <FormCurrencyField
            name="amount"
            label={messages.Budget.amount_label}
            placeholder={messages.Budget.amount_placeholder}
          />
          <BudgetSetupPresets />
          <CycleStartField />
        </View>
      </FormikProvider>
    </AppSheet>
  );
}
