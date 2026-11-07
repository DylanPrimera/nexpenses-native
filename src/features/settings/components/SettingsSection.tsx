import { Icon } from "@/shared/components/ui/Icon";
import { Text } from "@/shared/components/ui/text";
import type { Icon as TablerIconType } from "@tabler/icons-react-native";
import { View } from "react-native";

type SettingsSectionProps = {
  icon: TablerIconType;
  title: string;
  tone?: "default" | "danger";
  children: React.ReactNode;
};

export function SettingsSection({ icon, title, tone = "default", children }: SettingsSectionProps) {
  const toneClass = tone === "danger" ? "text-destructive" : "text-primary-action";

  return (
    <View className="gap-3">
      <View className="flex-row items-center gap-1.5">
        <Icon as={icon} size={15} className={toneClass} />
        <Text role="heading" className="font-figtree-semibold text-sm">
          {title}
        </Text>
      </View>
      {children}
    </View>
  );
}
