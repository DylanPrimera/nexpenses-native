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
import { useState } from "react";
import { View } from "react-native";
import { useCredit, useDeleteCredit } from "../hooks";
import { creditErrorMessage } from "../lib/credit-errors";
import { creditMoney, creditOwed } from "../lib/credit-display";
import { DebtCalculations } from "./DebtCalculations";
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
  const credit = useCredit(id);
  const { mutateAsync: deleteCredit } = useDeleteCredit();
  const { refreshing, onRefresh } = usePullToRefresh(() => credit.refetch());
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const data = credit.data;

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
          <DebtCalculations credit={data} />
          <Button variant="destructive" size="lg" onPress={() => setDeleteOpen(true)}>
            <Icon as={IconTrash} size={20} />
            <Text className="font-figtree-semibold">{messages.Debts.delete_confirm}</Text>
          </Button>
        </View>
      );
    }
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
    <PageShell
      screenLabel={messages.Nav.debt_detail}
      navClearance={false}
      contentClassName="gap-4"
      refreshControl={
        <AppRefreshControl refreshing={refreshing} onRefresh={() => void onRefresh()} />
      }
    >
      <View className="flex-row">
        <BackButton accessibilityLabel={messages.Common.back} onPress={goBack} />
      </View>
      {content()}
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
    </PageShell>
  );
}
