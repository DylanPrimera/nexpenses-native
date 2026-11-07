import { useRef, useMemo, useState } from "react";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { fieldPlaceholderClass, fieldSurfaceClass } from "@/shared/components/ui/field-classes";
import { Icon } from "@/shared/components/ui/Icon";
import { Text } from "@/shared/components/ui/text";
import { messages } from "@/shared/i18n";
import { AppSheet } from "@/shared/overlays/AppSheet";
import { SheetTextInput } from "@/shared/overlays/SheetTextInput";
import {
  IconCheck,
  IconChevronDown,
  IconPlus,
  IconSearch,
  IconX,
} from "@tabler/icons-react-native";
import { Pressable, View } from "react-native";

type SearchListFieldProps<T> = {
  value: string;
  onChange: (id: string) => void;
  items: T[];
  getItemId: (item: T) => string;
  getItemLabel: (item: T) => string;
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
  createOption?: SearchListCreateOption;
};

type SearchListCreateOption = {
  label: (query: string) => string;
  isAvailable: (normalizedQuery: string) => boolean;
  onCreate: (query: string) => Promise<boolean>;
};

export function SearchListField<T>({
  value,
  onChange,
  items,
  getItemId,
  getItemLabel,
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
  createOption,
}: SearchListFieldProps<T>) {
  const triggerRef = useRef<React.ComponentRef<typeof Pressable>>(null);
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [query, setQuery] = useState("");
  const selected = items.find((item) => getItemId(item) === value);
  const normalizedQuery = query.trim().toLowerCase();

  const sorted = useMemo(() => (sortItems ? sortItems([...items]) : items), [items, sortItems]);
  const filtered = normalizedQuery
    ? sorted.filter((item) => filterItem(item, normalizedQuery))
    : sorted;

  const canCreate =
    !!createOption && !!normalizedQuery && createOption.isAvailable(normalizedQuery);

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

  const handleCreate = async () => {
    if (!createOption || creating) return;
    setCreating(true);
    const created = await createOption.onCreate(query.trim()).catch(() => false);
    setCreating(false);
    if (created) handleOpenChange(false);
  };

  const searchHeader = (
    <View className="min-h-12 flex-row items-center gap-3 rounded-lg border border-control-border bg-muted/70 px-4">
      <Icon as={IconSearch} size={18} className="text-muted-foreground" />
      <SheetTextInput
        value={query}
        onChangeText={setQuery}
        placeholder={searchPlaceholder}
        autoCorrect={false}
        returnKeyType="search"
        className="min-h-12 flex-1 py-3 font-figtree-regular text-base text-foreground placeholder:text-muted-foreground"
      />
      {query ? (
        <Pressable
          role="button"
          accessibilityLabel={clearLabel}
          onPress={() => setQuery("")}
          className="-mr-3 size-12 items-center justify-center"
        >
          <Icon as={IconX} size={16} className="text-muted-foreground" />
        </Pressable>
      ) : null}
    </View>
  );
  const createRow =
    canCreate && createOption ? (
      <Pressable
        role="button"
        disabled={creating}
        onPress={() => void handleCreate()}
        className={`mb-1 min-h-12 flex-row items-center gap-2 rounded-md px-3 py-2.5 active:bg-muted ${creating ? "opacity-50" : ""}`}
      >
        <Icon as={IconPlus} size={16} className="text-primary-action" />
        <Text className="flex-1 font-figtree-medium text-sm text-primary-action">
          {createOption.label(query.trim())}
        </Text>
      </Pressable>
    ) : null;
  return (
    <>
      <View className={`min-h-12 w-full flex-row items-center rounded-lg border ${surfaceClass}`}>
        <Pressable
          ref={triggerRef}
          role="button"
          accessibilityLabel={placeholder}
          accessibilityValue={{
            text: selected ? getItemLabel(selected) : messages.Common.none_selected,
          }}
          accessibilityState={{ expanded: open }}
          aria-invalid={hasError}
          onPress={() => setOpen(true)}
          className="min-h-12 min-w-0 flex-1 flex-row items-center gap-3 pl-4 pr-3"
        >
          {selected ? (
            <View className="min-w-0 flex-1">{renderSelected(selected)}</View>
          ) : (
            <>
              <Icon as={IconSearch} size={18} className={mutedClass} />
              <Text className={`flex-1 ${mutedClass}`}>{placeholder}</Text>
            </>
          )}
          <Icon as={IconChevronDown} size={18} className={mutedClass} />
        </Pressable>
        {selected ? (
          <Pressable
            role="button"
            accessibilityLabel={clearLabel}
            onPress={() => onChange("")}
            className="size-12 items-center justify-center"
          >
            <Icon as={IconX} size={16} className={mutedClass} />
          </Pressable>
        ) : null}
      </View>

      <AppSheet
        returnFocusRef={triggerRef}
        isOpen={open}
        onChange={handleOpenChange}
        fullHeight
        header={searchHeader}
        renderScrollable={({ paddingBottom, header }) => (
          <BottomSheetFlatList<T>
            data={filtered}
            keyExtractor={getItemId}
            extraData={value}
            renderItem={({ item }) => {
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
                  {isSelected ? (
                    <Icon as={IconCheck} size={16} className="text-primary-action" />
                  ) : null}
                </Pressable>
              );
            }}
            ListHeaderComponent={
              <View className="gap-2 pb-3 pr-10">
                {header}
                {listHeader}
                {createRow}
              </View>
            }
            ListEmptyComponent={
              canCreate ? undefined : (
                <Text className="p-4 text-center text-xs text-muted-foreground">
                  {normalizedQuery ? noResultsText : emptyListText}
                </Text>
              )
            }
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom }}
            keyboardShouldPersistTaps="handled"
            initialNumToRender={12}
            windowSize={7}
            removeClippedSubviews={false}
          />
        )}
      />
    </>
  );
}

export type { SearchListCreateOption, SearchListFieldProps };
