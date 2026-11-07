import { assertQuerySession } from "@/core/query/session-runtime";
import { CanceledError } from "axios";
import { API_URL } from "@/core/config/env";
import { AUTH_TOKEN_KEY, SecureStorageAdapter } from "@/core/storage/secure-storage.adapter";
import { create, type AxiosResponse } from "axios";
import { peelEnvelope } from "./envelope";
import { notifyUnauthorized } from "./unauthorized-handler";

declare module "axios" {
  interface AxiosRequestConfig {
    expectedUserId?: string;
  }
}

export const apiClient = create({
  baseURL: API_URL,
  headers: {
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStorageAdapter.getItem(AUTH_TOKEN_KEY);
  if (config.signal?.aborted) throw new CanceledError();
  if (config.expectedUserId) assertQuerySession(config.expectedUserId);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const rt = response.config.responseType;
    if (rt === "blob" || rt === "arraybuffer") {
      return response;
    }
    const peeled = peelEnvelope(response.data, response.status, response.statusText);
    response.data = peeled.data;
    (response as AxiosResponse & { apiMessage?: string }).apiMessage = peeled.message;
    return response;
  },
  async (error) => {
    const status = error.response?.status as number | undefined;
    const body = error.response?.data;
    if (status === 401) {
      notifyUnauthorized();
    }
    if (error.response) {
      try {
        peelEnvelope(body, status ?? 500, error.response.statusText);
      } catch (apiError) {
        return Promise.reject(apiError);
      }
    }
    return Promise.reject(error);
  },
);
