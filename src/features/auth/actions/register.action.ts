import { apiClient } from "@/core";
import { AUTH_PATHS, type AuthApiResponse, type AuthPayload } from "../interfaces";
import { AuthMapper } from "../mappers";

export const registerAction = async (
  fullName: string,
  email: string,
  password: string,
): Promise<AuthPayload | null> => {
  try {
    const { data } = await apiClient.post<AuthApiResponse>(AUTH_PATHS.register, {
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      password: password.trim(),
    });
    return AuthMapper.fromApiResponse(data);
  } catch {
    return null;
  }
};
