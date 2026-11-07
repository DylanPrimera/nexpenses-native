import { queryClient, queryKeys } from "@/core/query";
import type { Credit } from "@/core/types/domain";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createCreditAction,
  createCreditFromStatementAction,
  deleteCreditAction,
  getCreditAction,
  getCreditsAction,
  getCreditsTotalAction,
  updateCreditAction,
} from "../actions";

const CREDITS_STALE_MS = 5 * 60 * 1000;

function refreshCreditCollections() {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.credits.total }),
    queryClient.invalidateQueries({ queryKey: queryKeys.credits.list }),
  ]);
}

export function useCredits(enabled = true) {
  return useQuery({
    queryKey: queryKeys.credits.list,
    queryFn: getCreditsAction,
    enabled,
    staleTime: CREDITS_STALE_MS,
  });
}

export function useCreditsTotal(enabled = true) {
  return useQuery({
    queryKey: queryKeys.credits.total,
    queryFn: getCreditsTotalAction,
    enabled,
    staleTime: Infinity,
  });
}

export function useCredit(id: string) {
  return useQuery({
    queryKey: queryKeys.credits.detail(id),
    queryFn: () => getCreditAction(id),
    initialData: () =>
      queryClient.getQueryData<Credit[]>(queryKeys.credits.list)?.find((item) => item.id === id),
    initialDataUpdatedAt: () => queryClient.getQueryState(queryKeys.credits.list)?.dataUpdatedAt,
    staleTime: CREDITS_STALE_MS,
  });
}

export function useCreateCredit() {
  return useMutation({
    mutationFn: createCreditAction,
    onSuccess: (credit) => {
      queryClient.setQueryData(queryKeys.credits.detail(credit.id), credit);
      return refreshCreditCollections();
    },
  });
}

export function useCreateCreditFromStatement() {
  return useMutation({
    mutationFn: createCreditFromStatementAction,
    onSuccess: (credit) => {
      queryClient.setQueryData(queryKeys.credits.detail(credit.id), credit);
      return refreshCreditCollections();
    },
  });
}

export function useUpdateCredit() {
  return useMutation({
    mutationFn: updateCreditAction,
    onSuccess: (credit) => {
      queryClient.setQueryData(queryKeys.credits.detail(credit.id), credit);
      return refreshCreditCollections();
    },
  });
}

export function useDeleteCredit() {
  return useMutation({
    mutationFn: deleteCreditAction,
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: queryKeys.credits.detail(id) });
      return Promise.all([
        refreshCreditCollections(),
        queryClient.invalidateQueries({ queryKey: queryKeys.expenses.all }),
        queryClient.invalidateQueries({ queryKey: queryKeys.history.all }),
      ]);
    },
  });
}
