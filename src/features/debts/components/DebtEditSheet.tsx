import type { Credit } from "@/core/types/domain";
import { Button } from "@/shared/components/ui/button";
import { Icon } from "@/shared/components/ui/Icon";
import { Text } from "@/shared/components/ui/text";
import { FormCurrencyField } from "@/shared/forms/FormCurrencyField";
import { FormField } from "@/shared/forms/FormField";
import { zodFormikValidate } from "@/shared/forms/zod-formik";
import { messages } from "@/shared/i18n";
import { AppSheet } from "@/shared/overlays/AppSheet";
import { notifyError, notifySuccess } from "@/shared/toast/notify";
import { IconCheck, IconPencil, IconTag } from "@tabler/icons-react-native";
import { FormikProvider, useFormik, useFormikContext } from "formik";
import { View } from "react-native";
import { useUpdateCredit } from "../hooks";
import { CREDIT_NAME_MAX } from "../interfaces";
import { creditErrorMessage } from "../lib/credit-errors";
import { creditEditValues, creditUpdateBody } from "../lib/credit-form";
import { creditEditSchema, type CreditEditValues } from "../schemas";
import { DebtRateFields } from "./DebtRateFields";

type DebtEditSheetProps = {
  credit: Credit;
  isOpen: boolean;
  onClose: () => void;
};

function EditActions({ credit, onCancel }: { credit: Credit; onCancel: () => void }) {
  const { values, isSubmitting, submitForm } = useFormikContext<CreditEditValues>();
  const disabled = isSubmitting || !creditEditSchema(credit.kind).safeParse(values).success;

  return (
    <View className="flex-row gap-2">
      <Button variant="secondary" size="lg" className="flex-1" onPress={onCancel}>
        <Text className="font-figtree-semibold">{messages.Common.cancel}</Text>
      </Button>
      <Button size="lg" className="flex-1" disabled={disabled} onPress={() => void submitForm()}>
        <Icon as={IconCheck} size={20} strokeWidth={2.5} className="text-primary-foreground" />
        <Text className="font-figtree-bold">{messages.Debts.save}</Text>
      </Button>
    </View>
  );
}

function Hint({ children }: { children: string }) {
  return <Text className="-mt-1 text-xs text-muted-foreground">{children}</Text>;
}

export function DebtEditSheet({ credit, isOpen, onClose }: DebtEditSheetProps) {
  const { mutateAsync } = useUpdateCredit();
  const isCard = credit.kind === "TC";
  const formik = useFormik<CreditEditValues>({
    initialValues: creditEditValues(credit),
    enableReinitialize: true,
    validate: zodFormikValidate(creditEditSchema(credit.kind)),
    onSubmit: async (values) => {
      try {
        await mutateAsync({ id: credit.id, body: creditUpdateBody(credit, values) });
        notifySuccess(messages.Debts.updated_toast);
        handleClose();
      } catch (error) {
        notifyError(creditErrorMessage(error, messages.Debts.save_error));
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
        <View className="flex-row items-center gap-3">
          <View className="size-11 items-center justify-center rounded-[0.875rem] bg-primary/15">
            <Icon as={IconPencil} size={22} strokeWidth={1.75} className="text-primary-action" />
          </View>
          <Text
            role="heading"
            className="min-w-0 flex-1 font-figtree-semibold text-lg leading-tight tracking-tight"
          >
            {messages.Debts.edit_section}
          </Text>
        </View>
      }
      footer={
        <FormikProvider value={formik}>
          <EditActions credit={credit} onCancel={handleClose} />
        </FormikProvider>
      }
    >
      <FormikProvider value={formik}>
        <View className="gap-4">
          <FormField
            name="displayName"
            label={isCard ? messages.Debts.name_bank_label : messages.Debts.tipo_label}
            icon={IconTag}
            maxLength={CREDIT_NAME_MAX}
            autoCapitalize="sentences"
            returnKeyType="next"
          />
          {isCard ? (
            <>
              <View className="gap-2">
                <FormCurrencyField
                  name="remainingBalance"
                  label={messages.Debts.saldo_adeudado}
                  required={false}
                />
                <Hint>{messages.Debts.saldo_adeudado_hint}</Hint>
              </View>
              <View className="gap-2">
                <FormCurrencyField
                  name="creditLimit"
                  label={messages.Debts.cupo_total_edit}
                  required={false}
                />
                <Hint>{messages.Debts.cupo_total_edit_hint}</Hint>
              </View>
            </>
          ) : null}
          <DebtRateFields />
        </View>
      </FormikProvider>
    </AppSheet>
  );
}
