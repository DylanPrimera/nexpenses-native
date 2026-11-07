import { useConnectivity } from "@/core/network/connectivity";
import {
  CategoryBadge,
  normalizeCategoryName,
  useCategories,
  useGetOrCreateCategory,
  type Category,
} from "@/features/categories";
import { Field, FieldError } from "@/shared/components/ui/Field";
import { Text } from "@/shared/components/ui/text";
import { visibleFieldError } from "@/shared/forms/field-meta";
import { FormFieldLabel } from "@/shared/forms/FormFieldLabel";
import { SearchListField } from "@/shared/forms/SearchListField";
import { messages, tx } from "@/shared/i18n";
import { notifyActionError } from "@/shared/toast/notify";
import { useField, useFormikContext } from "formik";
import { View } from "react-native";

const sortByUsage = (items: Category[]) =>
  items.sort((a, b) => b.usageCount - a.usageCount || a.name.localeCompare(b.name));

export function CategoryField({ name }: { name: string }) {
  const { isOnline } = useConnectivity();
  const [field, meta] = useField<string>(name);
  const { setFieldValue, setFieldTouched, submitCount } = useFormikContext();
  const { data: categories = [] } = useCategories();
  const { mutateAsync } = useGetOrCreateCategory();
  const error = visibleFieldError(meta, { empty: !field.value, submitted: submitCount > 0 });

  const select = (id: string) => {
    void setFieldValue(name, id);
    void setFieldTouched(name, true, false);
  };

  return (
    <Field invalid={!!error} className="gap-2">
      <FormFieldLabel label={messages.Expense.category_label} />
      <SearchListField
        value={field.value}
        onChange={select}
        items={categories}
        getItemId={(item) => item.id}
        filterItem={(item, query) => item.name.toLowerCase().includes(query)}
        sortItems={sortByUsage}
        renderSelected={(item) => (
          <View className="flex-row">
            <CategoryBadge name={item.name} color={item.color} />
          </View>
        )}
        renderOption={(item) => (
          <View className="flex-row items-center gap-2">
            <View style={{ backgroundColor: item.color }} className="size-2 rounded-full" />
            <Text numberOfLines={1} className="flex-1 text-sm capitalize">
              {item.name}
            </Text>
          </View>
        )}
        placeholder={messages.Expense.category_placeholder}
        clearLabel={messages.Expense.clear_category}
        hasError={!!error}
        createOption={
          isOnline
            ? {
                label: (query) => tx(messages.Expense.category_create, { name: query }),
                isAvailable: (query) =>
                  !categories.some((item) => normalizeCategoryName(item.name) === query),
                onCreate: async (query) => {
                  try {
                    const category = await mutateAsync(query);
                    select(category.id);
                    return true;
                  } catch (error) {
                    notifyActionError(error);
                    return false;
                  }
                },
              }
            : undefined
        }
      />
      {!isOnline ? (
        <Text className="text-xs text-muted-foreground">
          {categories.length
            ? messages.Offline.categories_cached
            : messages.Offline.categories_missing}
        </Text>
      ) : null}
      <FieldError errors={error} />
    </Field>
  );
}
