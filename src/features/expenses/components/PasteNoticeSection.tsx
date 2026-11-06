import { useCategories, useGetOrCreateCategory } from "@/features/categories";
import { Field, FieldError } from "@/shared/components/ui/Field";
import { SwitchRow } from "@/shared/components/ui/SwitchRow";
import { Textarea } from "@/shared/components/ui/textarea";
import { FormFieldLabel } from "@/shared/forms/FormFieldLabel";
import { messages } from "@/shared/i18n";
import { notifyError } from "@/shared/toast/notify";
import { useFormikContext } from "formik";
import { useRef, useState } from "react";
import { View } from "react-native";
import { parseBankNotice } from "../lib/parse-bank-notice";
import type { ExpenseFormValues } from "../schemas";

const NOTICE_CATEGORY = "transferencia";
const NOTICE_MISS_MIN_LENGTH = 20;
const NOTICE_MAX = 2000;
const NOTICE_DESCRIPTION_MAX = 100;

function NoticeInput() {
  const { setValues } = useFormikContext<ExpenseFormValues>();
  const { data: categories = [] } = useCategories();
  const { mutateAsync: getOrCreate } = useGetOrCreateCategory();
  const [notice, setNotice] = useState("");
  const [miss, setMiss] = useState(false);
  const request = useRef(0);

  const apply = async (raw: string, reportMiss: boolean) => {
    const parsed = parseBankNotice(raw);
    if (!parsed.amount) {
      if (reportMiss) setMiss(true);
      return;
    }
    setMiss(false);
    const current = ++request.current;
    const amount = parsed.amount;
    try {
      const category =
        categories.find((item) => item.name.trim().toLowerCase() === NOTICE_CATEGORY) ??
        (await getOrCreate(NOTICE_CATEGORY));
      if (current !== request.current) return;
      void setValues((values) => ({
        ...values,
        amount,
        categoryId: category.id,
        title: messages.Expense.paste_title,
        description: parsed.snippet.slice(0, NOTICE_DESCRIPTION_MAX),
        paymentType: parsed.paymentType ?? "debit_card",
      }));
    } catch {
      if (current === request.current) notifyError();
    }
  };

  const change = (next: string) => {
    setNotice(next);
    if (!next.trim()) {
      request.current += 1;
      setMiss(false);
      return;
    }
    void apply(next, next.trim().length >= NOTICE_MISS_MIN_LENGTH);
  };

  return (
    <Field invalid={miss} className="gap-2">
      <FormFieldLabel label={messages.Expense.paste_label} required={false} />
      <Textarea
        value={notice}
        onChangeText={change}
        onBlur={() => {
          if (notice.trim()) void apply(notice, true);
        }}
        numberOfLines={3}
        maxLength={NOTICE_MAX}
        placeholder={messages.Expense.paste_placeholder}
        invalid={miss}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {miss ? <FieldError errors={messages.Expense.paste_miss} /> : null}
    </Field>
  );
}

export function PasteNoticeSection() {
  const { values, setValues } = useFormikContext<ExpenseFormValues>();
  const enabled = values.source === "notice";

  return (
    <View className="gap-3">
      <SwitchRow
        label={messages.Expense.paste_toggle}
        checked={enabled}
        onCheckedChange={(checked) =>
          void setValues((current) => ({
            ...current,
            source: checked ? "notice" : "manual",
            recurringId: "",
            saveAsRecurring: checked ? false : current.saveAsRecurring,
          }))
        }
      />
      {enabled ? <NoticeInput /> : null}
    </View>
  );
}
