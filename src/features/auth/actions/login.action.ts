import { apiClient } from "@/core";
import { isAxiosError } from "axios";
import { AUTH_PATHS, type AuthApiResponse, type AuthPayload } from "../interfaces";
import { AuthMapper } from "../mappers";

export const loginAction = async (email: string, password: string): Promise<AuthPayload | null> => {
  try {
    const { data } = await apiClient.post<AuthApiResponse>(AUTH_PATHS.login, {
      email: email.toLowerCase().trim(),
      password,
    });
    return AuthMapper.fromApiResponse(data);
  } catch (error) {
    // Log the real cause (network error vs 401 vs 400) instead of hiding it.
    if (isAxiosError(error)) {
      console.warn("loginAction failed", {
        baseURL: error.config?.baseURL,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    } else {
      console.warn("loginAction failed", error);
    }
    return null;
  }
};
