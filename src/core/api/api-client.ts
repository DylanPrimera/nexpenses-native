import { API_URL } from "@/core/config/env";
import { AUTH_TOKEN_KEY, SecureStorageAdapter } from "@/core/storage/secure-storage.adapter";
import axios from "axios";

export const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStorageAdapter.getItem(AUTH_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
