import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  AUTH_TOKEN_KEY,
  SecureStorageAdapter,
} from "@/core/storage/secure-storage.adapter";

const SESSION_META_KEY = "nexpenses.auth.sessionMeta";

export interface SessionMeta {
  userId: string;
  firstName: string;
  lastName: string;
}

export async function saveToken(token: string) {
  await SecureStorageAdapter.setItem(AUTH_TOKEN_KEY, token);
}

export async function readToken() {
  return SecureStorageAdapter.getItem(AUTH_TOKEN_KEY);
}

export async function clearToken() {
  await SecureStorageAdapter.removeItem(AUTH_TOKEN_KEY);
}

export async function saveSessionMeta(meta: SessionMeta) {
  await AsyncStorage.setItem(SESSION_META_KEY, JSON.stringify(meta));
}

export async function readSessionMeta(): Promise<SessionMeta | null> {
  const raw = await AsyncStorage.getItem(SESSION_META_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as SessionMeta;
    if (!parsed?.userId) return null;
    return {
      userId: parsed.userId,
      firstName: parsed.firstName ?? "",
      lastName: parsed.lastName ?? "",
    };
  } catch {
    return null;
  }
}

export async function clearSessionMeta() {
  await AsyncStorage.removeItem(SESSION_META_KEY);
}

export async function clearAllSession() {
  await clearToken();
  await clearSessionMeta();
}
