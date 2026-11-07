import { isApiError } from "@/core/api";
import { Button } from "@/shared/components/ui/button";
import { Icon } from "@/shared/components/ui/Icon";
import { Text } from "@/shared/components/ui/text";
import { FormField } from "@/shared/forms/FormField";
import { zodFormikValidate } from "@/shared/forms/zod-formik";
import { messages } from "@/shared/i18n";
import { AppSheet } from "@/shared/overlays/AppSheet";
import { notifyActionError, notifySuccess } from "@/shared/toast/notify";
import { IconCheck, IconPencil, IconTag } from "@tabler/icons-react-native";
import { FormikProvider, useFormik, useFormikContext } from "formik";
import { useMemo } from "react";
import { View } from "react-native";
import { useUpdateCategory } from "../hooks";
import type { Category } from "../interfaces";
import { normalizeCategoryName } from "../lib/category-colors";
import { takenCategoryNames } from "../lib/category-display";
import { CATEGORY_NAME_MAX, categoryNameSchema, type CategoryNameValues } from "../schemas";

const CONFLICT_STATUS = 409;

type CategoryEditSheetProps = {
  category: Category | null;
  categories: readonly Category[];
  isOpen: boolean;
  onClose: () => void;
};

function CategoryEditActions({
  schemaValid,
  onCancel,
}: {
  schemaValid: boolean;
  onCancel: () => void;
}) {
  const { isSubmitting, submitForm } = useFormikContext<CategoryNameValues>();

  return (
    <View className="flex-row gap-2">
      <Button variant="secondary" size="lg" className="flex-1" onPress={onCancel}>
        <Text className="font-figtree-semibold">{messages.Common.cancel}</Text>
      </Button>
      <Button
        size="lg"
        className="flex-1"
        disabled={isSubmitting || !schemaValid}
        onPress={() => void submitForm()}
      >
        <Icon as={IconCheck} size={20} strokeWidth={2.5} className="text-primary-foreground" />
        <Text className="font-figtree-bold">{messages.Categories.save_button}</Text>
      </Button>
    </View>
  );
}

export function CategoryEditSheet({
  category,
  categories,
  isOpen,
  onClose,
}: CategoryEditSheetProps) {
  const { mutateAsync } = useUpdateCategory();
  const schema = useMemo(
    () => categoryNameSchema(takenCategoryNames(categories, category?.id ?? "")),
    [categories, category?.id],
  );

  const formik = useFormik<CategoryNameValues>({
    initialValues: { name: category?.name ?? "" },
    enableReinitialize: true,
    validate: zodFormikValidate(schema),
    onSubmit: async ({ name }, { setFieldError }) => {
      if (!category) return;
      if (normalizeCategoryName(name) === normalizeCategoryName(category.name)) {
        handleClose();
        return;
      }
      try {
        await mutateAsync({ id: category.id, name });
        notifySuccess(messages.Categories.edit_success);
        handleClose();
      } catch (error) {
        if (isApiError(error) && error.status === CONFLICT_STATUS) {
          setFieldError("name", messages.Categories.validation_duplicate);
          return;
        }
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
      isOpen={isOpen && !!category}
      onChange={(open) => {
        if (!open) handleClose();
      }}
      header={
        <View className="flex-row items-center gap-3">
          <View className="size-11 items-center justify-center rounded-[0.875rem] bg-primary/15">
            <Icon as={IconPencil} size={22} strokeWidth={1.75} className="text-primary-action" />
          </View>
          <View className="min-w-0 flex-1">
            <Text
              role="heading"
              className="font-figtree-semibold text-lg leading-tight tracking-tight"
            >
              {messages.Categories.edit_title}
            </Text>
            <Text className="mt-0.5 text-sm text-muted-foreground">
              {messages.Categories.edit_subtitle}
            </Text>
          </View>
        </View>
      }
      footer={
        <FormikProvider value={formik}>
          <CategoryEditActions
            schemaValid={schema.safeParse(formik.values).success}
            onCancel={handleClose}
          />
        </FormikProvider>
      }
    >
      <FormikProvider value={formik}>
        <FormField
          name="name"
          label={messages.Categories.name_label}
          placeholder={messages.Categories.name_placeholder}
          icon={IconTag}
          maxLength={CATEGORY_NAME_MAX}
          autoCapitalize="sentences"
          returnKeyType="done"
          onSubmitEditing={() => void formik.submitForm()}
        />
      </FormikProvider>
    </AppSheet>
  );
}
