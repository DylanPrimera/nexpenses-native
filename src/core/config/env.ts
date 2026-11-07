import { Platform } from "react-native";

const STAGE = process.env.EXPO_PUBLIC_STAGE || "dev";

/**
 * Resolve API URL for native only (iOS / Android).
 * - prod → EXPO_PUBLIC_API_URL
 * - otherwise → platform-specific IOS / ANDROID URL
 */
const resolveApiUrl = (): string | undefined => {
  if (STAGE === "prod") {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  if (Platform.OS === "ios") {
    return process.env.EXPO_PUBLIC_API_URL_IOS;
  }
  if (Platform.OS === "android") {
    return process.env.EXPO_PUBLIC_API_URL_ANDROID;
  }
  // No web target — refuse other platforms explicitly.
  return undefined;
};

export const API_URL = resolveApiUrl();

export const env = {
  stage: STAGE,
  apiUrl: API_URL,
  googleWebClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  googleIosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
};

export const requireApiUrl = (): string => {
  if (!env.apiUrl) {
    throw new Error(
      "Falta la URL de la API. Copia .env.example a .env y define EXPO_PUBLIC_STAGE y EXPO_PUBLIC_API_URL / _IOS / _ANDROID.",
    );
  }
  return env.apiUrl;
};
