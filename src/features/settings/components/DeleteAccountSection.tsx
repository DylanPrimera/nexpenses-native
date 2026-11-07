import { isNetworkError } from "@/core/api";
import { useAuthStore } from "@/features/auth";
import { Button } from "@/shared/components/ui/button";
import { Icon } from "@/shared/components/ui/Icon";
import { Text } from "@/shared/components/ui/text";
import { FormField } from "@/shared/forms/FormField";
import { zodFormikValidate } from "@/shared/forms/zod-formik";
import { messages, tx } from "@/shared/i18n";
import { ConfirmDialog } from "@/shared/overlays/ConfirmDialog";
import { notifyError, notifySuccess, notifyWarning } from "@/shared/toast/notify";
import { IconLock, IconTrash } from "@tabler/icons-react-native";
import { FormikProvider, useFormik } from "formik";
import { useRef, useState } from "react";
import { View } from "react-native";
import {
  DELETE_CONFIRMATION_WORD,
  deleteAccountSchema,
  type DeleteAccountFormValues,
} from "../schemas";

export function DeleteAccountSection() {
  const { deleteAccount } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const pendingRef = useRef(false);

  const formik = useFormik<DeleteAccountFormValues>({
    initialValues: { confirmation: "" },
    validate: zodFormikValidate(deleteAccountSchema),
    onSubmit: () => undefined,
  });
  const confirmed = deleteAccountSchema.safeParse(formik.values).success;

  const handleClose = () => {
    if (pendingRef.current) return;
    formik.resetForm();
    setIsOpen(false);
  };

  const handleDelete = async () => {
    if (pendingRef.current || !confirmed) return;
    pendingRef.current = true;
    setIsPending(true);
    try {
      await deleteAccount();
      notifySuccess(messages.Settings.reset_success_toast);
    } catch (error) {
      if (isNetworkError(error)) notifyWarning(messages.Settings.reset_offline_toast);
      else notifyError(messages.Settings.reset_error_toast);
    } finally {
      pendingRef.current = false;
      setIsPending(false);
    }
  };

  return (
    <View className="gap-3 rounded-[0.875rem] border border-destructive/40 bg-card p-4">
      <Text className="text-sm leading-relaxed text-muted-foreground">
        {messages.Settings.reset_description}
      </Text>
      <Button variant="destructive" onPress={() => setIsOpen(true)}>
        <Icon as={IconTrash} size={18} className="text-destructive" />
        <Text>{messages.Settings.reset_button}</Text>
      </Button>
      <ConfirmDialog
        isOpen={isOpen}
        title={messages.Settings.reset_confirm_title}
        description={messages.Settings.reset_confirm_description}
        confirmLabel={messages.Settings.reset_confirm_button}
        confirmDisabled={!confirmed}
        isPending={isPending}
        closeOnConfirm={false}
        onConfirm={() => void handleDelete()}
        onClose={handleClose}
      >
        <FormikProvider value={formik}>
          <FormField
            name="confirmation"
            label={tx(messages.Settings.reset_confirm_field_label, {
              word: DELETE_CONFIRMATION_WORD,
            })}
            icon={IconLock}
            required={false}
            placeholder={DELETE_CONFIRMATION_WORD}
            autoCapitalize="characters"
            autoCorrect={false}
            editable={!isPending}
          />
        </FormikProvider>
      </ConfirmDialog>
    </View>
  );
}
