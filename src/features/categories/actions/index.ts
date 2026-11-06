import { apiClient } from "@/core/api/api-client";
import {
  CATEGORY_LIST_LIMIT,
  CATEGORY_PATHS,
  type Category,
  type CategoryList,
  type UpdateCategoryInput,
} from "../interfaces";

export async function getCategoriesAction(): Promise<Category[]> {
  const { data } = await apiClient.get<CategoryList>(CATEGORY_PATHS.list, {
    params: { limit: CATEGORY_LIST_LIMIT },
  });
  return data?.items ?? [];
}

export async function getOrCreateCategoryAction(name: string): Promise<Category> {
  const { data } = await apiClient.post<Category>(CATEGORY_PATHS.getOrCreate, {
    name: name.trim(),
  });
  return data;
}

export async function updateCategoryAction({ id, name }: UpdateCategoryInput): Promise<Category> {
  const { data } = await apiClient.patch<Category>(CATEGORY_PATHS.detail(id), { name: name.trim() });
  return data;
}
