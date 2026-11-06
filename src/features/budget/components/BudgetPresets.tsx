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
      {SETUP_PRESETS.map((preset) => {
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
            className={`rounded-md px-3 py-1.5 ${selected ? "bg-primary active:bg-primary/80" : "bg-primary/10 active:bg-primary/20"}`}
          >
            <Text
              className={`text-xs ${selected ? "font-figtree-semibold text-primary-foreground" : "font-figtree-medium text-primary"}`}
            >
              {`$${preset / 1_000_000}M COP`}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function BudgetIncrementPresets() {
  const { values, setFieldValue } = useFormikContext<BudgetFormValues>();

  return (
    <View className="flex-row gap-2">
      {EDIT_INCREMENTS.map((increment) => (
        <Pressable
          key={increment}
          role="button"
          onPress={() => {
            playPressSound();
            void setFieldValue("amount", Math.min(MAX_BUDGET, (values.amount || 0) + increment));
          }}
          className="h-9 flex-1 items-center justify-center rounded-md bg-primary/10 active:bg-primary/20"
        >
          <Text className="font-figtree-semibold text-sm text-primary">{`+${formatCOP(increment)}`}</Text>
        </Pressable>
      ))}
    </View>
  );
}
