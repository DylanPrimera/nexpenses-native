import { apiClient } from "@/core";
import { AUTH_PATHS, type AuthApiResponse, type AuthPayload } from "../interfaces";
import { AuthMapper } from "../mappers";

export const checkStatusAction = async (): Promise<AuthPayload | null> => {
  try {
    const { data } = await apiClient.get<AuthApiResponse>(AUTH_PATHS.checkStatus);
    return AuthMapper.fromApiResponse(data);
  } catch {
    return null;
  }
};
