import { ExpenseList, type Expense } from "@/features/expenses";
import { Icon } from "@/shared/components/ui/Icon";
import { Text } from "@/shared/components/ui/text";
import { messages, transactionCount } from "@/shared/i18n";
import { IconArrowRight, IconReceipt } from "@tabler/icons-react-native";
import { Link } from "expo-router";
import { Pressable, View } from "react-native";

export function RecentExpensesHeader({ count }: { count?: number }) {
  const items = { length: count ?? 0 };
  const expenses = count !== undefined;
  return (
    <View className="flex-row items-center gap-3 pt-1">
      <View className="min-w-0 flex-1 flex-row flex-wrap items-center gap-x-2 gap-y-1">
        <Text role="heading" className="font-figtree-semibold text-lg tracking-tight">
          {messages.Budget.recent}
        </Text>
        {expenses ? (
          <View className="shrink-0 rounded-md border border-border bg-card px-2 py-0.5">
            <Text className="font-figtree-medium text-xs text-muted-foreground">
              {transactionCount(items.length)}
            </Text>
          </View>
        ) : null}
      </View>
      <Link href="/history" asChild>
        <Pressable
          role="link"
          hitSlop={8}
          className="shrink-0 flex-row items-center gap-0.5 active:bg-accent"
        >
          <Text className="font-figtree-medium text-sm text-primary-action">
            {messages.Budget.see_all}
          </Text>
          <Icon as={IconArrowRight} size={14} className="text-primary-action" />
        </Pressable>
      </Link>
    </View>
  );
}

export function RecentExpensesEmpty() {
  return (
    <View className="items-start rounded-md border border-dashed border-border px-4 py-12">
      <View className="mb-3 size-12 items-center justify-center rounded-md bg-muted">
        <Icon as={IconReceipt} size={24} strokeWidth={1.5} className="text-muted-foreground" />
      </View>
      <Text className="font-figtree-semibold text-sm">{messages.History.empty_title}</Text>
      <Text className="mt-1 max-w-xs text-xs text-muted-foreground">
        {messages.History.empty_description}
      </Text>
    </View>
  );
}

export function RecentExpenses({
  expenses,
  isLoading,
}: {
  expenses: Expense[] | undefined;
  isLoading: boolean;
}) {
  return (
    <ExpenseList
      expenses={expenses ?? []}
      loading={isLoading && !expenses}
      ListHeaderComponent={<RecentExpensesHeader count={expenses?.length} />}
      ListEmptyComponent={<RecentExpensesEmpty />}
    />
  );
}
