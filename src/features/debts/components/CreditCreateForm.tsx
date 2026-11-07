import type { CreditKind } from "@/core/types/domain";
import { Button } from "@/shared/components/ui/button";
import { Icon } from "@/shared/components/ui/Icon";
import { Text } from "@/shared/components/ui/text";
import { FormField } from "@/shared/forms/FormField";
import { zodFormikValidate } from "@/shared/forms/zod-formik";
import { messages, tx } from "@/shared/i18n";
import { notifyError, notifySuccess } from "@/shared/toast/notify";
import { IconCheck, IconTag } from "@tabler/icons-react-native";
import { router } from "expo-router";
import { FormikProvider, useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import { Pressable, View } from "react-native";
import { useCreateCredit, useCredits } from "../hooks";
import { useStatementUpload } from "../hooks/use-statement-upload";
import { CREDIT_NAME_MAX } from "../interfaces";
import { hasReachedCreditLimit } from "../lib/credit-display";
import { creditErrorMessage, isStatementParseFailure } from "../lib/credit-errors";
import { creditCreateBody, emptyCreditCreateValues } from "../lib/credit-form";
import { parseRateInput } from "../lib/credit-rates";
import type { StatementFile } from "../lib/statement-file";
import { discardStatementCopy, pickStatement } from "../lib/statement-picker";
import { creditCreateSchema, type CreditCreateValues, type CreditEntryMode } from "../schemas";
import { CreditKindPicker } from "./CreditKindPicker";
import { CreditManualFields } from "./CreditManualFields";
import { DebtRateFields } from "./DebtRateFields";
import { StatementPdfField } from "./StatementPdfField";

function goBack() {
  if (router.canGoBack()) router.back();
  else router.replace("/debts");
}

function Hint({ children }: { children: string }) {
  return <Text className="-mt-2 text-xs text-muted-foreground">{children}</Text>;
}

export function CreditCreateForm() {
  const credits = useCredits();
  const { mutateAsync: createManual } = useCreateCredit();
  const { phase, percent, upload } = useStatementUpload();
  const [kind, setKind] = useState<CreditKind>("TC");
  const [entryMode, setEntryMode] = useState<CreditEntryMode>("statement");
  const [file, setFile] = useState<StatementFile | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [parseFailed, setParseFailed] = useState(false);
  const fileRef = useRef<StatementFile | null>(null);
  const isCard = kind === "TC";
  const uploading = phase !== "idle";

  useEffect(
    () => () => {
      if (fileRef.current) discardStatementCopy(fileRef.current.uri);
    },
    [],
  );

  const replaceFile = (next: StatementFile | null) => {
    if (fileRef.current) discardStatementCopy(fileRef.current.uri);
    fileRef.current = next;
    setFile(next);
  };

  const finish = (id: string) => {
    notifySuccess(messages.Debts.created_toast);
    router.replace({ pathname: "/debts/[id]", params: { id } });
  };

  const submitStatement = async (values: CreditCreateValues, statement: StatementFile) => {
    try {
      const created = await upload({
        kind,
        displayName: values.displayName.trim(),
        file: statement,
        rateEa: parseRateInput(values.rateEa),
        rateMv: parseRateInput(values.rateMv),
      });
      if (!created) return;
      replaceFile(null);
      finish(created.id);
    } catch (error) {
      const message = creditErrorMessage(error, messages.Debts.upload_error);
      notifyError(message);
      if (isStatementParseFailure(error)) switchMode("manual", true);
    }
  };

  const formik = useFormik<CreditCreateValues>({
    initialValues: emptyCreditCreateValues,
    validate: zodFormikValidate(creditCreateSchema(kind, entryMode)),
    onSubmit: async (values) => {
      if (hasReachedCreditLimit(credits.data?.length ?? 0)) {
        notifyError(messages.Debts.max_reached);
        return;
      }
      if (entryMode === "statement") {
        if (fileRef.current) await submitStatement(values, fileRef.current);
        return;
      }
      try {
        const created = await createManual(creditCreateBody(kind, values));
        finish(created.id);
      } catch (error) {
        notifyError(creditErrorMessage(error, messages.Debts.upload_error));
      }
    },
  });

  function resetFeedback() {
    formik.setErrors({});
    void formik.setTouched({}, false);
  }

  function switchMode(next: CreditEntryMode, afterFailure = false) {
    if (next === "manual") replaceFile(null);
    setEntryMode(next);
    setParseFailed(afterFailure);
    setFileError(null);
    resetFeedback();
  }

  const changeKind = (next: CreditKind) => {
    setKind(next);
    resetFeedback();
  };

  const pickFile = async () => {
    try {
      const picked = await pickStatement();
      if (!picked) return;
      replaceFile(picked.file);
      setFileError(picked.error);
    } catch {
      notifyError(messages.Debts.pdf_pick_error);
    }
  };

  const submit = () => {
    if (entryMode === "statement" && !fileRef.current) setFileError(messages.Debts.pdf_required);
    void formik.submitForm();
  };

  const submitLabel = () => {
    if (phase === "upload") return tx(messages.Debts.upload_progress, { percent });
    if (phase === "process") return messages.Debts.processing;
    return formik.isSubmitting ? messages.Debts.configuring : messages.Debts.configure;
  };

  const busy = formik.isSubmitting || uploading;

  return (
    <FormikProvider value={formik}>
      <View className="gap-4">
        <View
          pointerEvents={busy ? "none" : "auto"}
          className={`gap-4 ${busy ? "opacity-60" : ""}`}
        >
          <CreditKindPicker value={kind} onChange={changeKind} />
          <FormField
            name="displayName"
            label={isCard ? messages.Debts.name_bank_label : messages.Debts.tipo_label}
            icon={IconTag}
            placeholder={
              isCard ? messages.Debts.name_bank_placeholder : messages.Debts.tipo_placeholder
            }
            maxLength={CREDIT_NAME_MAX}
            autoCapitalize="sentences"
            returnKeyType="next"
          />
          {entryMode === "statement" ? (
            <StatementPdfField
              file={file}
              error={fileError}
              disabled={busy}
              onPick={() => void pickFile()}
              onRemove={() => replaceFile(null)}
              onSwitchToManual={() => switchMode("manual")}
            />
          ) : (
            <View className="gap-3">
              {parseFailed ? (
                <View
                  role="alert"
                  className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2"
                >
                  <Text className="text-xs font-medium text-destructive">
                    {messages.Debts.manual_after_fail}
                  </Text>
                </View>
              ) : null}
              <CreditManualFields kind={kind} />
              <Pressable
                role="button"
                onPress={() => switchMode("statement")}
                className="self-start py-1"
              >
                <Text className="font-figtree-semibold text-xs text-primary-action underline">
                  {messages.Debts.switch_to_pdf}
                </Text>
              </Pressable>
            </View>
          )}
          <DebtRateFields />
          <Hint>{messages.Debts.rate_optional_hint}</Hint>
        </View>
        <View className="flex-row gap-2">
          <Button variant="secondary" size="lg" className="flex-1" disabled={busy} onPress={goBack}>
            <Text className="font-figtree-semibold">{messages.Common.cancel}</Text>
          </Button>
          <Button size="lg" className="flex-1" disabled={busy} onPress={submit}>
            <Icon as={IconCheck} size={20} strokeWidth={2.5} className="text-primary-foreground" />
            <Text className="font-figtree-bold">{submitLabel()}</Text>
          </Button>
        </View>
      </View>
    </FormikProvider>
  );
}
