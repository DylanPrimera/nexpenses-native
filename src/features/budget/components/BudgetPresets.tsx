import { OptionList } from "@/shared/components/ui/OptionList";
import { formatCOP } from "@/core/utils/currency";
import { playPressSound } from "@/shared/audio/ui-sound";
import { Text } from "@/shared/components/ui/text";
import { useFormikContext } from "formik";
import { Pressable, View } from "react-native";
import { MAX_BUDGET, type BudgetFormValues } from "../schemas";

const SETUP_PRESETS = [1_000_000, 2_000_000, 3_000_000, 5_000_000] as const;
const EDIT_INCREMENTS = [100_000, 250_000, 500_000] as const;

export function BudgetSetupPresets() {
  const { values, setFieldValue } = useFormikContext<BudgetFormValues>();

  return (
    <View className="flex-row flex-wrap gap-2">
      <OptionList
        items={SETUP_PRESETS}
        getKey={(item) => String(item)}
        extraData={values.amount}
        minHeight={48}
        renderOption={(preset) => {
          const selected = values.amount === preset;
          return (
            <Pressable
              key={preset}
              role="button"
              accessibilityState={{ selected }}
              onPress={() => {
                playPressSound();
                void setFieldValue("amount", preset);
              }}
              className={`min-h-12 w-full shrink-0 items-center justify-center rounded-md px-3 py-2 ${selected ? "bg-primary-action active:bg-primary-action" : "bg-primary/10 active:bg-primary/20"}`}
            >
              <Text
                className={`text-xs ${selected ? "font-figtree-semibold text-primary-foreground" : "font-figtree-medium text-foreground"}`}
              >
                {`$${preset / 1_000_000}M COP`}
              </Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

export function BudgetIncrementPresets() {
  const { values, setFieldValue } = useFormikContext<BudgetFormValues>();

  return (
    <View className="flex-row gap-2">
      <OptionList
        items={EDIT_INCREMENTS}
        getKey={(item) => String(item)}
        extraData={values.amount}
        minHeight={48}
        renderOption={(increment) => (
          <Pressable
            key={increment}
            role="button"
            onPress={() => {
              playPressSound();
              void setFieldValue("amount", Math.min(MAX_BUDGET, (values.amount || 0) + increment));
            }}
            className="min-h-12 w-full shrink-0 items-center justify-center rounded-md bg-primary/10 py-2 active:bg-primary/20"
          >
            <Text className="font-figtree-semibold text-sm text-foreground">{`+${formatCOP(increment)}`}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}
