import { CategoryBadge, useCategories, type Category } from "@/features/categories";
import { Text } from "@/shared/components/ui/text";
import { FormFieldLabel } from "@/shared/forms/FormFieldLabel";
import { SearchListField } from "@/shared/forms/SearchListField";
import { IconInput } from "@/shared/components/ui/IconInput";
import { SURFACE_CLASS } from "@/shared/components/ui/surface-classes";
import { messages } from "@/shared/i18n";
import { IconSearch } from "@tabler/icons-react-native";
import { Pressable, View } from "react-native";
import { HISTORY_SEARCH_MAX, type PaymentFilter } from "../interfaces";
import { PaymentFilterChips } from "./PaymentFilterChips";

type HistoryFiltersCardProps = {
  search: string;
  onSearchChange: (value: string) => void;
  categoryId: string;
  onCategoryChange: (id: string) => void;
  paymentType: PaymentFilter;
  onPaymentChange: (value: PaymentFilter) => void;
  isActive: boolean;
  onReset: () => void;
};

const sortByUsage = (items: Category[]) =>
  items.sort((a, b) => b.usageCount - a.usageCount || a.name.localeCompare(b.name));

export function HistoryFiltersCard({
  search,
  onSearchChange,
  categoryId,
  onCategoryChange,
  paymentType,
  onPaymentChange,
  isActive,
  onReset,
}: HistoryFiltersCardProps) {
  const { data: categories = [] } = useCategories();

  return (
    <View className={`${SURFACE_CLASS} gap-4 p-4`}>
      <View className="min-h-6 flex-row items-center justify-between gap-2">
        <Text className="font-figtree-semibold text-[11px] uppercase tracking-wider text-primary">
          {messages.History.filters_heading}
        </Text>
        {isActive ? (
          <Pressable role="button" hitSlop={8} onPress={onReset} className="active:opacity-70">
            <Text className="font-figtree-semibold text-xs text-primary">{messages.History.clear_filters}</Text>
          </Pressable>
        ) : null}
      </View>

      <IconInput
        icon={IconSearch}
        value={search}
        onChangeText={onSearchChange}
        placeholder={messages.History.search_placeholder}
        accessibilityLabel={messages.History.search_placeholder}
        maxLength={HISTORY_SEARCH_MAX}
        autoCorrect={false}
        returnKeyType="search"
      />

      <View className="gap-2">
        <FormFieldLabel label={messages.History.category_section} required={false} />
        <SearchListField
          value={categoryId}
          onChange={onCategoryChange}
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
          placeholder={messages.History.filter_category_placeholder}
          noResultsText={messages.History.filter_empty}
        />
      </View>

      <View className="gap-2">
        <FormFieldLabel label={messages.History.payment_section} required={false} />
        <PaymentFilterChips value={paymentType} onChange={onPaymentChange} />
      </View>
    </View>
  );
}
