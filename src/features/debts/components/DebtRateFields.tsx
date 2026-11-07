import { FormField } from "@/shared/forms/FormField";
import { messages } from "@/shared/i18n";
import { IconPercentage } from "@tabler/icons-react-native";
import { View } from "react-native";

export function DebtRateFields() {
  return (
    <View className="flex-row gap-2">
      <View className="flex-1">
        <FormField
          name="rateEa"
          label={messages.Debts.rate_ea_label}
          required={false}
          icon={IconPercentage}
          keyboardType="decimal-pad"
          placeholder="0"
        />
      </View>
      <View className="flex-1">
        <FormField
          name="rateMv"
          label={messages.Debts.rate_mv_label}
          required={false}
          icon={IconPercentage}
          keyboardType="decimal-pad"
          placeholder="0"
        />
      </View>
    </View>
  );
}
