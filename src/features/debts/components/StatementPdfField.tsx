import { Button } from "@/shared/components/ui/button";
import { Icon } from "@/shared/components/ui/Icon";
import { Text } from "@/shared/components/ui/text";
import { FormFieldLabel } from "@/shared/forms/FormFieldLabel";
import { messages } from "@/shared/i18n";
import { IconFileTypePdf, IconUpload, IconX } from "@tabler/icons-react-native";
import { Linking, Pressable, View } from "react-native";
import { formatFileSize, type StatementFile } from "../lib/statement-file";

const UNLOCK_URL = "https://www.ilovepdf.com/unlock_pdf";

type StatementPdfFieldProps = {
  file: StatementFile | null;
  error: string | null;
  disabled: boolean;
  onPick: () => void;
  onRemove: () => void;
  onSwitchToManual: () => void;
};

export function StatementPdfField({
  file,
  error,
  disabled,
  onPick,
  onRemove,
  onSwitchToManual,
}: StatementPdfFieldProps) {
  const borderClass = error ? "border-destructive" : "border-transparent";

  return (
    <View className="gap-2">
      <FormFieldLabel label={messages.Debts.pdf_label} required />
      <Text className="text-xs text-muted-foreground">{messages.Debts.pdf_hint}</Text>
      <View role="note" className="rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2">
        <Text className="text-xs font-medium text-amber-950 dark:text-amber-100">
          {messages.Debts.pdf_unlock_hint}{" "}
          <Text
            role="link"
            onPress={() => void Linking.openURL(UNLOCK_URL)}
            className="text-xs font-bold text-amber-950 underline dark:text-amber-50"
          >
            {messages.Debts.pdf_unlock_link}
          </Text>
        </Text>
      </View>
      {file ? (
        <View
          className={`min-h-12 flex-row items-center gap-3 rounded-lg border bg-muted px-4 py-2 ${borderClass}`}
        >
          <Icon as={IconFileTypePdf} size={22} className="text-primary" />
          <View className="min-w-0 flex-1">
            <Text numberOfLines={1} className="font-figtree-medium text-sm">
              {file.name}
            </Text>
            {file.size === null ? null : (
              <Text className="text-xs text-muted-foreground">{formatFileSize(file.size)}</Text>
            )}
          </View>
          <Pressable
            role="button"
            accessibilityLabel={messages.Debts.pdf_remove}
            disabled={disabled}
            hitSlop={8}
            onPress={onRemove}
          >
            <Icon as={IconX} size={20} className="text-muted-foreground" />
          </Pressable>
        </View>
      ) : null}
      <Button variant="secondary" size="lg" disabled={disabled} onPress={onPick}>
        <Icon as={IconUpload} size={20} />
        <Text className="font-figtree-semibold">
          {file ? messages.Debts.pdf_replace : messages.Debts.pdf_pick}
        </Text>
      </Button>
      {error ? <Text className="text-xs font-medium text-destructive">{error}</Text> : null}
      <Text className="text-xs text-muted-foreground">{messages.Debts.pdf_privacy_note}</Text>
      <Pressable
        role="button"
        disabled={disabled}
        onPress={onSwitchToManual}
        className="self-start py-1"
      >
        <Text className="font-figtree-semibold text-xs text-primary underline">
          {messages.Debts.switch_to_manual}
        </Text>
      </Pressable>
    </View>
  );
}
