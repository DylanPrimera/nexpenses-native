import { useConnectivity } from "@/core/network/connectivity";
import { isApiError } from "@/core/api";
import { Button } from "@/shared/components/ui/button";
import { BackButton } from "@/shared/components/ui/BackButton";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { Icon } from "@/shared/components/ui/Icon";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { SURFACE_CLASS } from "@/shared/components/ui/surface-classes";
import { Text } from "@/shared/components/ui/text";
import { messages } from "@/shared/i18n";
import { AppRefreshControl, PageShell, usePullToRefresh } from "@/shared/layout";
import { ConfirmDialog } from "@/shared/overlays/ConfirmDialog";
import { notifyError, notifySuccess } from "@/shared/toast/notify";
import { IconCloudOff, IconPencil, IconTrash } from "@tabler/icons-react-native";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, View } from "react-native";
import { projectionModel } from "../lib/credit-projection";
import { AmortizationHeader, AmortizationRow, AmortizationFooter } from "./DebtAmortization";
import { useCredit, useDeleteCredit } from "../hooks";
import { creditErrorMessage } from "../lib/credit-errors";
import { creditMoney, creditOwed } from "../lib/credit-display";
import { DebtCalculations, DebtCalculationsFooter } from "./DebtCalculations";
import { DebtEditSheet } from "./DebtEditSheet";
import { DebtFigures } from "./DebtFigures";

const NOT_FOUND_STATUS = 404;

function goBack() {
  if (router.canGoBack()) router.back();
  else router.replace("/debts");
}

function DetailSkeleton() {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      className="gap-2.5"
    >
      <View className={`${SURFACE_CLASS} gap-3 p-4`}>
        <Skeleton className="h-6 w-3/5 rounded-md" />
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-full rounded-md" />
      </View>
      <Skeleton className="h-40 w-full rounded-[0.875rem]" />
    </View>
  );
}

export function DebtDetailScreen({ id }: { id: string }) {
  const { isOnline } = useConnectivity();
  const credit = useCredit(id);
  const { mutateAsync: deleteCredit } = useDeleteCredit();
  const { refreshing, onRefresh } = usePullToRefresh(() => credit.refetch());
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const data = credit.data;
  const [expandedCredit, setExpandedCredit] = useState<string | null>(null);
  const showAll = expandedCredit === id;
  const model = useMemo(() => (data ? projectionModel(data) : undefined), [data]);
  const schedule = data?.kind !== "TC" ? model?.schedule : null;
  const rows = schedule?.rows ?? [];

  const confirmDelete = async () => {
    try {
      await deleteCredit(id);
      notifySuccess(messages.Debts.deleted_toast);
      goBack();
    } catch (error) {
      notifyError(creditErrorMessage(error, messages.Debts.delete_error));
    }
  };

  const content = () => {
    if (data) {
      return (
        <View className="gap-4">
          <DebtFigures credit={data} />
          <Button variant="secondary" size="lg" onPress={() => setEditOpen(true)}>
            <Icon as={IconPencil} size={20} />
            <Text className="font-figtree-semibold">{messages.Debts.edit_section}</Text>
          </Button>
          {model ? <DebtCalculations credit={data} model={model} /> : null}
        </View>
      );
    }
    if (!isOnline)
      return (
        <EmptyState
          icon={IconCloudOff}
          title={messages.Offline.offline_title}
          description={messages.Offline.debts_unavailable}
        />
      );
    if (credit.isError) {
      const missing = isApiError(credit.error) && credit.error.status === NOT_FOUND_STATUS;
      return (
        <View className="gap-4">
          <EmptyState
            icon={IconCloudOff}
            title={missing ? messages.Debts.not_found : messages.Debts.load_error}
            description={missing ? undefined : messages.Common.load_error_description}
          />
          {missing ? null : (
            <Button variant="secondary" onPress={() => void credit.refetch()}>
              <Text>{messages.Debts.retry_load}</Text>
            </Button>
          )}
        </View>
      );
    }
    return <DetailSkeleton />;
  };

  return (
    <>
      <PageShell
        screenLabel={messages.Nav.debt_detail}
        navClearance={false}
        contentClassName="gap-4"
        renderScrollable={({ contentContainerStyle }) => (
          <FlatList
            style={{ flex: 1 }}
            data={showAll ? rows : rows.slice(0, 8)}
            keyExtractor={(row) => `${id}:${row.number}`}
            contentContainerStyle={contentContainerStyle}
            renderItem={({ item }) => <AmortizationRow row={item} />}
            ListHeaderComponent={
              <View className="gap-4">
                <View className="flex-row">
                  <BackButton accessibilityLabel={messages.Common.back} onPress={goBack} />
                </View>
                {content()}
                {rows.length ? <AmortizationHeader /> : null}
              </View>
            }
            ListFooterComponent={
              data && model ? (
                <View className="gap-4 pt-3">
                  {schedule && rows.length ? (
                    <AmortizationFooter
                      schedule={schedule}
                      showAll={showAll}
                      onToggle={() => setExpandedCredit(showAll ? null : id)}
                    />
                  ) : null}
                  <DebtCalculationsFooter model={model} />
                  <Button variant="destructive" size="lg" onPress={() => setDeleteOpen(true)}>
                    <Icon as={IconTrash} size={20} />
                    <Text className="font-figtree-semibold">{messages.Debts.delete_confirm}</Text>
                  </Button>
                </View>
              ) : undefined
            }
            refreshControl={
              <AppRefreshControl
                refreshing={isOnline && refreshing}
                onRefresh={() => {
                  if (isOnline) void onRefresh();
                }}
              />
            }
            keyboardShouldPersistTaps="handled"
            initialNumToRender={10}
            windowSize={7}
            removeClippedSubviews={false}
          />
        )}
      />
      {data ? (
        <>
          <DebtEditSheet credit={data} isOpen={editOpen} onClose={() => setEditOpen(false)} />
          <ConfirmDialog
            isOpen={deleteOpen}
            title={messages.Debts.delete_title}
            description={messages.Debts.delete_description}
            confirmLabel={messages.Debts.delete_confirm}
            isDestructive
            preview={{ title: data.displayName, amount: creditMoney(creditOwed(data)) }}
            onConfirm={() => void confirmDelete()}
            onClose={() => setDeleteOpen(false)}
          />
        </>
      ) : null}
    </>
  );
}
