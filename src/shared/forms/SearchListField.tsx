import { fieldPlaceholderClass, fieldSurfaceClass } from "@/shared/components/ui/field-classes";
import { Icon } from "@/shared/components/ui/Icon";
import { Text } from "@/shared/components/ui/text";
import { messages } from "@/shared/i18n";
import { AppSheet } from "@/shared/overlays/AppSheet";
import { SheetTextInput } from "@/shared/overlays/SheetTextInput";
import { IconCheck, IconChevronDown, IconSearch, IconX } from "@tabler/icons-react-native";
import { useMemo, useState } from "react";
import { Pressable, View } from "react-native";

type SearchListFieldProps<T> = {
  value: string;
  onChange: (id: string) => void;
  items: T[];
  getItemId: (item: T) => string;
  filterItem: (item: T, normalizedQuery: string) => boolean;
  sortItems?: (items: T[]) => T[];
  renderSelected: (item: T) => React.ReactNode;
  renderOption: (item: T, isSelected: boolean) => React.ReactNode;
  placeholder: string;
  searchPlaceholder?: string;
  emptyListText?: string;
  noResultsText?: string;
  clearLabel?: string;
  hasError?: boolean;
  onItemSelect?: (item: T) => void;
  listHeader?: React.ReactNode;
};

export function SearchListField<T>({
  value,
  onChange,
  items,
  getItemId,
  filterItem,
  sortItems,
  renderSelected,
  renderOption,
  placeholder,
  searchPlaceholder = messages.Common.search,
  emptyListText = messages.Common.empty_list,
  noResultsText = messages.Common.no_results,
  clearLabel = messages.Common.clear,
  hasError = false,
  onItemSelect,
  listHeader,
}: SearchListFieldProps<T>) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const selected = items.find((item) => getItemId(item) === value);
  const normalizedQuery = query.trim().toLowerCase();

  const sorted = useMemo(() => (sortItems ? sortItems([...items]) : items), [items, sortItems]);
  const filtered = normalizedQuery
    ? sorted.filter((item) => filterItem(item, normalizedQuery))
    : sorted;

  const surfaceClass = fieldSurfaceClass(hasError, open);
  const mutedClass = fieldPlaceholderClass(hasError, open);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) setQuery("");
  };

  const handleSelect = (item: T) => {
    const id = getItemId(item);
    if (id !== value) {
      onChange(id);
      onItemSelect?.(item);
    }
    handleOpenChange(false);
  };

  return (
    <>
      <View className={`h-12 w-full flex-row items-center rounded-lg border pl-4 ${surfaceClass}`}>
        <Pressable
          role="button"
          accessibilityLabel={placeholder}
          aria-invalid={hasError}
          onPress={() => setOpen(true)}
          className="h-full min-w-0 flex-1 flex-row items-center gap-3"
        >
          {selected ? (
            <View className="min-w-0 flex-1">{renderSelected(selected)}</View>
          ) : (
            <>
              <Icon as={IconSearch} size={18} className={mutedClass} />
              <Text numberOfLines={1} className={`flex-1 ${mutedClass}`}>
                {placeholder}
              </Text>
            </>
          )}
        </Pressable>
        {selected ? (
          <Pressable
            role="button"
            accessibilityLabel={clearLabel}
            onPress={() => onChange("")}
            className="size-11 items-center justify-center"
          >
            <Icon as={IconX} size={16} className={mutedClass} />
          </Pressable>
        ) : null}
        <Pressable
          role="button"
          accessibilityLabel={placeholder}
          onPress={() => setOpen(true)}
          className={`h-full items-center justify-center pr-3 ${selected ? "" : "pl-2"}`}
        >
          <Icon as={IconChevronDown} size={18} className={mutedClass} />
        </Pressable>
      </View>

      <AppSheet
        isOpen={open}
        onChange={handleOpenChange}
        fullHeight
        header={
          <View className="h-12 flex-row items-center gap-3 rounded-lg border border-foreground/25 bg-field px-4">
            <Icon as={IconSearch} size={18} className="text-muted-foreground" />
            <SheetTextInput
              value={query}
              onChangeText={setQuery}
              placeholder={searchPlaceholder}
              autoCorrect={false}
              returnKeyType="search"
              className="h-full flex-1 py-0 font-figtree-regular text-base text-foreground placeholder:text-muted-foreground"
            />
            {query ? (
              <Pressable
                role="button"
                accessibilityLabel={clearLabel}
                onPress={() => setQuery("")}
                className="-mr-3 size-11 items-center justify-center"
              >
                <Icon as={IconX} size={16} className="text-muted-foreground" />
              </Pressable>
            ) : null}
          </View>
        }
      >
        {listHeader}
        {filtered.length > 0 ? (
          <View className="gap-0.5">
            {filtered.map((item) => {
              const id = getItemId(item);
              const isSelected = id === value;
              return (
                <Pressable
                  key={id}
                  role="button"
                  accessibilityState={{ selected: isSelected }}
                  onPress={() => handleSelect(item)}
                  className={`min-h-12 flex-row items-center justify-between gap-2 rounded-md px-3 py-2.5 ${isSelected ? "bg-accent" : "active:bg-muted"}`}
                >
                  <View className="min-w-0 flex-1">{renderOption(item, isSelected)}</View>
                  {isSelected ? <Icon as={IconCheck} size={16} className="text-primary" /> : null}
                </Pressable>
              );
            })}
          </View>
        ) : (
          <Text className="p-4 text-center text-xs text-muted-foreground">
            {normalizedQuery ? noResultsText : emptyListText}
          </Text>
        )}
      </AppSheet>
    </>
  );
}

export type { SearchListFieldProps };
