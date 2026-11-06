import { messages } from "@/shared/i18n";
import {
  IconCreditCard,
  IconHistory,
  IconHome,
  IconRepeat,
  IconSettings,
  IconTags,
  type Icon as TablerIconType,
} from "@tabler/icons-react-native";

export type NavItem = {
  route: string;
  label: string;
  icon: TablerIconType;
};

export const NAV_ITEMS: readonly NavItem[] = [
  { route: "index", label: messages.Nav.dashboard, icon: IconHome },
  { route: "history", label: messages.Nav.history, icon: IconHistory },
  { route: "recurring", label: messages.Nav.recurring, icon: IconRepeat },
  { route: "categories", label: messages.Nav.categories, icon: IconTags },
  { route: "debts", label: messages.Nav.debts, icon: IconCreditCard },
  { route: "settings", label: messages.Nav.settings, icon: IconSettings },
];

export const NAV_SPLIT_INDEX = 3;

export const WIDE_NAV_MIN_WIDTH = 380;

export function splitNavItems(items: readonly NavItem[] = NAV_ITEMS) {
  return [items.slice(0, NAV_SPLIT_INDEX), items.slice(NAV_SPLIT_INDEX)] as const;
}

export function navItemSizeClass(screenWidth: number) {
  return screenWidth >= WIDE_NAV_MIN_WIDTH ? "size-10" : "size-9";
}

export function navItemHitSlop(screenWidth: number) {
  const vertical = screenWidth >= WIDE_NAV_MIN_WIDTH ? 4 : 6;
  return { top: vertical, bottom: vertical, left: 2, right: 2 };
}
