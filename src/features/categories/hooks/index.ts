import { queryClient, queryKeys } from "@/core/query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getCategoriesAction, getOrCreateCategoryAction, updateCategoryAction } from "../actions";
import type { Category } from "../interfaces";

const CATEGORIES_STALE_MS = 5 * 60 * 1000;

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: getCategoriesAction,
    staleTime: CATEGORIES_STALE_MS,
  });
}

export function useGetOrCreateCategory() {
  return useMutation({
    networkMode: "always",
    retry: false,
    mutationFn: getOrCreateCategoryAction,
    onSuccess: (category) => {
      queryClient.setQueryData<Category[]>(queryKeys.categories.all, (current) =>
        current?.some((item) => item.id === category.id) ? current : [...(current ?? []), category],
      );
      void queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    },
  });
}

export function useUpdateCategory() {
  return useMutation({
    networkMode: "always",
    retry: false,
    mutationFn: updateCategoryAction,
    onSuccess: (category) => {
      queryClient.setQueryData<Category[]>(queryKeys.categories.all, (current) =>
        current?.map((item) => (item.id === category.id ? { ...item, ...category } : item)),
      );
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.categories.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.expenses.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.history.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.recurring.all }),
      ]);
    },
  });
}
