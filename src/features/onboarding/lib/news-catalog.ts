import { messages } from "@/shared/i18n";
import { IconCreditCard, IconRepeat } from "@tabler/icons-react-native";
import type { NewsItem } from "../interfaces";

const items = messages.WhatsNew.items;

export const NEWS_ITEMS: readonly NewsItem[] = [
  { id: "credits-debts", icon: IconCreditCard, ...items["credits-debts"] },
  { id: "recurring-payments", icon: IconRepeat, ...items["recurring-payments"] },
];
