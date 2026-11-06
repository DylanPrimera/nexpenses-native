import { Label } from "@/shared/components/ui/label";
import { View } from "react-native";

export function FormFieldLabel({ label, required = true }: { label: string; required?: boolean }) {
  return (
    <View className="flex-row items-center">
      {required ? <View aria-hidden className="mr-1.5 size-1.5 rounded-full bg-primary" /> : null}
      <Label className="font-figtree-medium text-xs text-muted-foreground">{label}</Label>
    </View>
  );
}
