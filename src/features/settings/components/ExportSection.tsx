import { OptionList } from "@/shared/components/ui/OptionList";
import { isNetworkError } from "@/core/api";
import type { UserProfile } from "@/features/budget";
import {
  currentHistoryMonth,
  historyMonthTitle,
  isAfterHistoryMonth,
  shiftHistoryMonth,
} from "@/features/history/lib/history-month";
import { Button } from "@/shared/components/ui/button";
import { Icon } from "@/shared/components/ui/Icon";
import { SURFACE_CLASS } from "@/shared/components/ui/surface-classes";
import { Text } from "@/shared/components/ui/text";
import { messages } from "@/shared/i18n";
import { notifyError, notifySuccess } from "@/shared/toast/notify";
import { IconChevronLeft, IconChevronRight, IconFileSpreadsheet } from "@tabler/icons-react-native";
import { useRef, useState } from "react";
import { Platform, Pressable, View } from "react-native";
import type { ExportScope, ExportScopeKind } from "../interfaces";
import { buildExpenseReport } from "../lib/expense-report";
import { exportFileName, exportPeriodLabel } from "../lib/export-scope";
import { IncompleteExportError, loadExportExpenses } from "../lib/fetch-export-expenses";
import { EXPENSE_REPORT_LABELS, PAYMENT_REPORT_LABELS } from "../lib/report-labels";
import { saveReportToDevice } from "../lib/save-report-native";

type ExportSectionProps = {
  profile: UserProfile | undefined;
};

const SCOPE_OPTIONS: readonly { value: ExportScopeKind; label: string }[] = [
  { value: "cycle", label: messages.Settings.export_scope_cycle },
  { value: "month", label: messages.Settings.export_scope_month },
  { value: "all", label: messages.Settings.export_scope_all },
];

function exportErrorMessage(error: unknown) {
  if (error instanceof IncompleteExportError) return messages.Settings.export_incomplete_toast;
  if (isNetworkError(error)) return messages.Settings.export_offline_toast;
  return messages.Settings.export_error_toast;
}

export function ExportSection({ profile }: ExportSectionProps) {
  const [scopeKind, setScopeKind] = useState<ExportScopeKind>("cycle");
  const [month, setMonth] = useState(() => currentHistoryMonth());
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);

  const canGoNext = isAfterHistoryMonth(currentHistoryMonth(), month);
  const cycleUnavailable = scopeKind === "cycle" && !profile;
  const hint =
    Platform.OS === "ios"
      ? messages.Settings.export_hint_ios
      : messages.Settings.export_hint_android;

  const handleExport = async () => {
    if (busyRef.current) return;
    let scope: ExportScope;
    if (scopeKind === "cycle") {
      if (!profile) return;
      scope = { kind: "cycle", cycleStartedAt: profile.cycleStartedAt };
    } else if (scopeKind === "month") {
      scope = { kind: "month", year: month.year, month: month.month };
    } else {
      scope = { kind: "all" };
    }

    busyRef.current = true;
    setBusy(true);
    try {
      const result = await saveReportToDevice(exportFileName(scope), async () => {
        const expenses = await loadExportExpenses(scope);
        return buildExpenseReport({
          expenses,
          periodLabel: exportPeriodLabel(scope),
          budget: scope.kind === "cycle" && profile ? profile.budget : null,
          labels: EXPENSE_REPORT_LABELS,
          paymentLabels: PAYMENT_REPORT_LABELS,
          now: Date.now(),
        });
      });
      if (result === "saved") notifySuccess(messages.Settings.export_success_toast);
    } catch (error) {
      notifyError(exportErrorMessage(error));
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  };

  return (
    <View className={`${SURFACE_CLASS} gap-3 p-4`}>
      <Text className="text-sm leading-relaxed text-muted-foreground">
        {messages.Settings.export_description}
      </Text>
      <View role="radiogroup" className="flex-row gap-1 rounded-[0.625rem] bg-background p-1">
        <OptionList
          items={SCOPE_OPTIONS}
          getKey={(item) => item.value}
          extraData={[scopeKind, busy]}
          minHeight={48}
          renderOption={({ value, label }) => {
            const selected = scopeKind === value;
            return (
              <Pressable
                key={value}
                role="radio"
                disabled={busy}
                accessibilityLabel={label}
                accessibilityState={{ selected, disabled: busy }}
                onPress={() => setScopeKind(value)}
                className={`min-h-12 w-full shrink-0 items-center justify-center rounded-md py-2 ${selected ? "bg-card" : "active:bg-accent"}`}
              >
                <Text
                  className={`font-figtree-semibold text-sm ${selected ? "text-foreground" : "text-muted-foreground"}`}
                >
                  {label}
                </Text>
              </Pressable>
            );
          }}
        />
      </View>
      {scopeKind === "month" ? (
        <View className="flex-row items-center justify-between">
          <Button
            variant="ghost"
            size="icon-sm"
            disabled={busy}
            accessibilityLabel={messages.Common.previous_month}
            onPress={() => setMonth(shiftHistoryMonth(month, -1))}
          >
            <Icon as={IconChevronLeft} size={20} />
          </Button>
          <Text className="shrink font-figtree-semibold text-sm">{historyMonthTitle(month)}</Text>
          <Button
            variant="ghost"
            size="icon-sm"
            disabled={busy || !canGoNext}
            accessibilityLabel={messages.Common.next_month}
            onPress={() => setMonth(shiftHistoryMonth(month, 1))}
          >
            <Icon as={IconChevronRight} size={20} />
          </Button>
        </View>
      ) : null}
      <Button disabled={busy || cycleUnavailable} onPress={() => void handleExport()}>
        <Icon as={IconFileSpreadsheet} size={18} className="text-primary-foreground" />
        <Text>{busy ? messages.Settings.export_preparing : messages.Settings.export_button}</Text>
      </Button>
      <Text className="text-xs leading-relaxed text-muted-foreground">{hint}</Text>
    </View>
  );
}
