import { requireOnline } from "@/core/network/require-online";
import { apiClient } from "@/core/api/api-client";
import type { Credit } from "@/core/types/domain";
import {
  CREDIT_PAGE_LIMIT,
  CREDIT_PATHS,
  type ApiCredit,
  type ApiCreditList,
  STATEMENT_TIMEOUT_MS,
  type CreateCreditBody,
  type CreateCreditFromStatementInput,
  type CreditsTotal,
  type UpdateCreditInput,
} from "../interfaces";
import { mapApiCredit } from "../lib/credit-mapper";

export async function getCreditsAction(): Promise<Credit[]> {
  const items: ApiCredit[] = [];
  let total = 0;
  do {
    const { data } = await apiClient.get<ApiCreditList>(CREDIT_PATHS.list, {
      params: { limit: CREDIT_PAGE_LIMIT, offset: items.length },
    });
    total = data?.total ?? 0;
    if (!data?.items?.length) break;
    items.push(...data.items);
  } while (items.length < total);
  return items.map(mapApiCredit);
}

export async function getCreditsTotalAction(): Promise<number> {
  const { data } = await apiClient.get<CreditsTotal>(CREDIT_PATHS.total);
  return data?.totalBalance ?? 0;
}

export async function getCreditAction(id: string): Promise<Credit> {
  const { data } = await apiClient.get<ApiCredit>(CREDIT_PATHS.detail(id));
  return mapApiCredit(data);
}

export async function createCreditAction(body: CreateCreditBody): Promise<Credit> {
  requireOnline();
  const { data } = await apiClient.post<ApiCredit>(CREDIT_PATHS.list, body);
  return mapApiCredit(data);
}

export async function updateCreditAction({ id, body }: UpdateCreditInput): Promise<Credit> {
  requireOnline();
  await apiClient.patch<ApiCredit>(CREDIT_PATHS.detail(id), body);
  return getCreditAction(id);
}

export async function deleteCreditAction(id: string): Promise<void> {
  requireOnline();
  await apiClient.delete(CREDIT_PATHS.detail(id));
}

export async function createCreditFromStatementAction({
  file,
  kind,
  displayName,
  rateEa,
  rateMv,
  signal,
  onUploadProgress,
}: CreateCreditFromStatementInput): Promise<Credit> {
  requireOnline();
  const form = new FormData();
  form.append("kind", kind);
  form.append("displayName", displayName);
  if (rateEa !== null) form.append("rateEa", String(rateEa));
  if (rateMv !== null) form.append("rateMv", String(rateMv));
  form.append("file", {
    uri: file.uri,
    name: file.name,
    type: "application/pdf",
  } as unknown as Blob);
  const { data } = await apiClient.post<ApiCredit>(CREDIT_PATHS.statement, form, {
    headers: { "Content-Type": "multipart/form-data" },
    signal,
    timeout: STATEMENT_TIMEOUT_MS,
    onUploadProgress: (event) => {
      if (!event.total) return;
      onUploadProgress?.(Math.round((event.loaded / event.total) * 100));
    },
  });
  return mapApiCredit(data);
}
