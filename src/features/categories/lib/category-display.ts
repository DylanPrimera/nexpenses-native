import { messages, tx } from "@/shared/i18n";

export function categoryCountLabel(count: number): string {
  return count === 1 ? messages.Categories.one_expense : tx(messages.Categories.many_expenses, { count });
}

export function takenCategoryNames(categories: readonly { id: string; name: string }[], excludeId: string): string[] {
  return categories.filter((category) => category.id !== excludeId).map((category) => category.name);
}

export function sortCategoriesByUsage<T extends { name: string; usageCount: number }>(categories: readonly T[]): T[] {
  return [...categories].sort((a, b) => b.usageCount - a.usageCount || a.name.localeCompare(b.name, "es"));
}
