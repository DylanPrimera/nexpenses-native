import { useConnectivity } from "@/core/network/connectivity";
import { usePendingExpenses } from "@/features/expenses/hooks/usePendingExpenses";
import { AccountDrawer } from "@/features/auth";
import { Button } from "@/shared/components/ui/button";
import { Text } from "@/shared/components/ui/text";
import { useDebouncedValue, useThemeColors } from "@/shared/hooks";
import { messages } from "@/shared/i18n";
import { AppRefreshControl, PageShell, usePullToRefresh } from "@/shared/layout";
import { useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useHistoryExpenses, useHistoryMonthExpenses, useHistoryMonthTotal } from "../hooks";
import type { HistoryFilters, HistoryView, PaymentFilter } from "../interfaces";
import { groupExpensesByDay } from "../lib/group-by-day";
import { EMPTY_HISTORY_FILTERS, hasActiveFilters } from "../lib/history-filters";
import {
  currentHistoryMonth,
  historyMonthFromKey,
  isAfterHistoryMonth,
  shiftHistoryMonth,
} from "../lib/history-month";
import { HistoryCalendarView } from "./HistoryCalendarView";
import { HistoryDayGroups } from "./HistoryDayGroups";
import { HistoryFiltersCard } from "./HistoryFiltersCard";
import { HistoryHeader } from "./HistoryHeader";
import {
  HistoryEmptyMonth,
  HistoryError,
  HistoryListSkeleton,
  HistoryNoResults,
} from "./HistoryStates";
import { HistoryTotal } from "./HistoryTotal";

const SEARCH_DEBOUNCE_MS = 300;

export function HistoryScreen() {
  const colors = useThemeColors();
  const { isOnline } = useConnectivity();
  const pending = usePendingExpenses();
  const canFetch = isOnline && pending.length === 0;
  const [month, setMonth] = useState(currentHistoryMonth);
  const [view, setView] = useState<HistoryView>("list");
  const [categoryId, setCategoryId] = useState(EMPTY_HISTORY_FILTERS.categoryId);
  const [paymentType, setPaymentType] = useState<PaymentFilter>(EMPTY_HISTORY_FILTERS.paymentType);
  const [searchInput, setSearchInput] = useState(EMPTY_HISTORY_FILTERS.search);
  const debouncedSearch = useDebouncedValue(searchInput.trim(), SEARCH_DEBOUNCE_MS);
  const search = searchInput.trim() === "" ? "" : debouncedSearch;

  const filters: HistoryFilters = { categoryId, paymentType, search };
  const filtersActive = hasActiveFilters(filters);
  const inputActive = hasActiveFilters({ categoryId, paymentType, search: searchInput });
  const isList = view === "list";

  const list = useHistoryExpenses(month, filters, isList);
  const monthExpenses = useHistoryMonthExpenses(month, !isList);
  const monthTotal = useHistoryMonthTotal(month, isList && filtersActive);

  const items = list.items;
  const filteredTotal = list.projectedTotal;
  const filteredAmount = list.projectedAmount;

  const listCount = filtersActive ? monthTotal.data : list.projectedTotal;
  const monthCount = isList ? listCount : monthExpenses.data?.length;
  const isMonthEmpty = monthCount === 0 && !inputActive;
  const canGoNext = !isAfterHistoryMonth(shiftHistoryMonth(month, 1), currentHistoryMonth());

  const { refreshing, onRefresh } = usePullToRefresh(() =>
    canFetch
      ? Promise.all([
          isList ? list.refetch() : monthExpenses.refetch(),
          isList && filtersActive ? monthTotal.refetch() : undefined,
        ])
      : Promise.resolve(),
  );

  const changeMonth = (next: typeof month) => {
    if (isAfterHistoryMonth(next, currentHistoryMonth())) return;
    setMonth(next);
  };

  const resetFilters = () => {
    setCategoryId(EMPTY_HISTORY_FILTERS.categoryId);
    setPaymentType(EMPTY_HISTORY_FILTERS.paymentType);
    setSearchInput(EMPTY_HISTORY_FILTERS.search);
  };

  const loadMore = () => {
    if (
      !canFetch ||
      !isList ||
      !list.hasNextPage ||
      list.isFetchingNextPage ||
      list.isFetchNextPageError
    )
      return;
    void list.fetchNextPage();
  };

  const listBody = () => {
    if (list.isError && !list.data && isOnline && items.length === 0)
      return <HistoryError onRetry={() => void list.refetch()} />;
    if (!list.data && !isOnline && items.length === 0)
      return <Text className="text-sm text-muted-foreground">{messages.Offline.no_data}</Text>;
    if (list.isPending && items.length === 0 && canFetch) return <HistoryListSkeleton />;
    if (items.length === 0) {
      return filtersActive ? <HistoryNoResults onClear={resetFilters} /> : <HistoryEmptyMonth />;
    }
    return (
      <View className="gap-4">
        {!list.data ? (
          <Text className="text-xs text-muted-foreground">{messages.Offline.partial}</Text>
        ) : null}
        <HistoryTotal count={filteredTotal} amount={filteredAmount} />
        <HistoryDayGroups groups={groupExpensesByDay(items)} />
        {list.isFetchingNextPage ? (
          <ActivityIndicator color={colors.primary} className="py-4" />
        ) : null}
        {list.isFetchNextPageError && canFetch ? (
          <Button variant="secondary" onPress={() => void list.fetchNextPage()}>
            <Text>{messages.Common.retry}</Text>
          </Button>
        ) : null}
      </View>
    );
  };

  const calendarBody = () => {
    if (monthExpenses.isError && !monthExpenses.data && isOnline) {
      return <HistoryError onRetry={() => void monthExpenses.refetch()} />;
    }
    if (!monthExpenses.data && !isOnline)
      return <Text className="text-sm text-muted-foreground">{messages.Offline.no_data}</Text>;
    return (
      <View className="gap-2">
        {!monthExpenses.hasServerData && monthExpenses.data ? (
          <Text className="text-xs text-muted-foreground">{messages.Offline.partial}</Text>
        ) : null}
        <HistoryCalendarView
          month={month}
          onMonthChange={(key) => changeMonth(historyMonthFromKey(key))}
          expenses={monthExpenses.data}
        />
      </View>
    );
  };

  return (
    <PageShell
      screenLabel={messages.Nav.history}
      headerAction={<AccountDrawer />}
      contentClassName="gap-4"
      refreshControl={
        <AppRefreshControl refreshing={refreshing} onRefresh={() => void onRefresh()} />
      }
      onEndReached={loadMore}
    >
      <HistoryHeader
        month={month}
        canGoNext={canGoNext}
        onPrevious={() => changeMonth(shiftHistoryMonth(month, -1))}
        onNext={() => changeMonth(shiftHistoryMonth(month, 1))}
        view={view}
        onViewChange={setView}
        count={monthCount}
      />
      {isList && !isMonthEmpty ? (
        <HistoryFiltersCard
          search={searchInput}
          onSearchChange={setSearchInput}
          categoryId={categoryId}
          onCategoryChange={setCategoryId}
          paymentType={paymentType}
          onPaymentChange={setPaymentType}
          isActive={inputActive}
          onReset={resetFilters}
        />
      ) : null}
      {isList ? listBody() : calendarBody()}
    </PageShell>
  );
}
