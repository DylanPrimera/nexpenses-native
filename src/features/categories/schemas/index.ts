import { messages } from "@/shared/i18n";
import { z } from "zod";
import { normalizeCategoryName } from "../lib/category-colors";

export const CATEGORY_NAME_MAX = 40;

export function categoryNameSchema(takenNames: readonly string[]) {
  const taken = new Set(takenNames.map(normalizeCategoryName));
  return z
    .object({
      name: z.string().trim().min(1, messages.Categories.validation_required).max(CATEGORY_NAME_MAX),
    })
    .refine((values) => !taken.has(normalizeCategoryName(values.name)), {
      message: messages.Categories.validation_duplicate,
      path: ["name"],
    });
}

export type CategoryNameValues = z.input<ReturnType<typeof categoryNameSchema>>;
