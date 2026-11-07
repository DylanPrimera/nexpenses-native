import AsyncStorage from "@react-native-async-storage/async-storage";
import type { PersistedOnboarding } from "../interfaces";
import { parseOnboarding } from "./onboarding-state";

const KEY_PREFIX = "nexpenses.onboarding.";

export function onboardingKey(userId: string) {
  return `${KEY_PREFIX}${userId}`;
}

export async function readOnboarding(userId: string): Promise<PersistedOnboarding> {
  const raw = await AsyncStorage.getItem(onboardingKey(userId)).catch(() => null);
  return parseOnboarding(raw);
}

export async function saveOnboarding(userId: string, state: PersistedOnboarding): Promise<void> {
  await AsyncStorage.setItem(onboardingKey(userId), JSON.stringify(state)).catch(() => undefined);
}

export async function clearOnboarding(userId: string): Promise<void> {
  await AsyncStorage.removeItem(onboardingKey(userId));
}
