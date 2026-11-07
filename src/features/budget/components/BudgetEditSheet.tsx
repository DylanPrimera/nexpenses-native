import { cycleStartFromDayKey, localDayKey } from "@/core/utils/budget-cycle";
import { formatPickedDate } from "@/shared/components/ui/calendar-grid";
import { Icon } from "@/shared/components/ui/Icon";
import { Switch } from "@/shared/components/ui/switch";
import { Text } from "@/shared/components/ui/text";
import { FormCurrencyField } from "@/shared/forms/FormCurrencyField";
import { zodFormikValidate } from "@/shared/forms/zod-formik";
import { messages, tx } from "@/shared/i18n";
import { AppSheet } from "@/shared/overlays/AppSheet";
import { notifyActionError, notifySuccess } from "@/shared/toast/notify";
import { IconPencil } from "@tabler/icons-react-native";
import { FormikProvider, useFormik, useFormikContext } from "formik";
import { Pressable, View } from "react-native";
import { useUpdateBudget } from "../hooks";
import type { UserProfile } from "../interfaces";
import { budgetSchema, type BudgetFormValues } from "../schemas";
import { BudgetIncrementPresets } from "./BudgetPresets";
import { BudgetSheetActions } from "./BudgetSheetActions";
import { CycleStartField } from "./CycleStartField";

type BudgetEditSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  profile: Pick<UserProfile, "budget" | "cycleStartedAt">;
  startNewCycle?: boolean;
};

const EDIT_ICON = IconPencil;

function NewCycleToggle({ cycleStartedAt }: { cycleStartedAt: string }) {
  const { values, setFieldValue } = useFormikContext<BudgetFormValues>();
  const toggle = (checked: boolean) => void setFieldValue("isNewCycle", checked);
  const hint = values.isNewCycle
    ? messages.Budget.new_cycle_hint
    : tx(messages.Budget.keep_cycle_hint, { date: formatPickedDate(localDayKey(cycleStartedAt)) });

  return (
    <View className="gap-3 rounded-[0.875rem] border border-border p-3">
      <Pressable
        role="switch"
        accessibilityState={{ checked: values.isNewCycle }}
        onPress={() => toggle(!values.isNewCycle)}
        className="flex-row items-start gap-3"
      >
        <View className="min-w-0 flex-1">
          <Text className="font-figtree-semibold text-sm">{messages.Budget.new_cycle_toggle}</Text>
          <Text className="text-xs text-muted-foreground">{hint}</Text>
        </View>
        <Switch checked={values.isNewCycle} onCheckedChange={toggle} />
      </Pressable>
      {values.isNewCycle ? <CycleStartField /> : null}
    </View>
  );
}

export function BudgetEditSheet({
  isOpen,
  onClose,
  profile,
  startNewCycle = false,
}: BudgetEditSheetProps) {
  const { mutateAsync } = useUpdateBudget();
  const formik = useFormik<BudgetFormValues>({
    initialValues: { amount: profile.budget, cycleDay: localDayKey(), isNewCycle: startNewCycle },
    enableReinitialize: true,
    validate: zodFormikValidate(budgetSchema),
    onSubmit: async ({ amount, cycleDay, isNewCycle }) => {
      try {
        await mutateAsync({
          budget: amount,
          ...(isNewCycle ? { cycleStartedAt: cycleStartFromDayKey(cycleDay) } : {}),
        });
        notifySuccess(isNewCycle ? messages.Budget.new_cycle_toast : messages.Budget.updated_toast);
        handleClose();
      } catch (error) {
        notifyActionError(error);
      }
    },
  });

  function handleClose() {
    formik.resetForm();
    onClose();
  }

  return (
    <AppSheet
      isOpen={isOpen}
      onChange={(open) => {
        if (!open) handleClose();
      }}
      header={
        <View className="flex-row items-center gap-2">
          <View className="size-10 items-center justify-center rounded-[0.875rem] bg-muted">
            <Icon as={EDIT_ICON} size={20} className="text-primary-action" />
          </View>
          <Text role="heading" className="font-figtree-bold text-lg">
            {messages.Budget.edit_title}
          </Text>
        </View>
      }
      footer={
        <FormikProvider value={formik}>
          <BudgetSheetActions
            submitLabel={messages.Budget.edit_button}
            submitIcon={EDIT_ICON}
            cancelLabel={messages.Common.cancel}
            onCancel={handleClose}
          />
        </FormikProvider>
      }
    >
      <FormikProvider value={formik}>
        <View className="gap-4">
          <FormCurrencyField
            name="amount"
            label={messages.Budget.amount_label}
            placeholder={messages.Budget.amount_placeholder}
          />
          <BudgetIncrementPresets />
          <NewCycleToggle cycleStartedAt={profile.cycleStartedAt} />
        </View>
      </FormikProvider>
    </AppSheet>
  );
}
