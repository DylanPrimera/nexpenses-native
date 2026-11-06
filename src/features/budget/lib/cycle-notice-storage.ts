import AsyncStorage from "@react-native-async-storage/async-storage";

const DISMISSED_KEY = "nexpenses-cycle-notice-dismissed";

export async function isCycleNoticeDismissed(cycleStartedAt: string): Promise<boolean> {
  const value = await AsyncStorage.getItem(DISMISSED_KEY).catch(() => null);
  return value === cycleStartedAt;
}

export async function dismissCycleNotice(cycleStartedAt: string): Promise<void> {
  await AsyncStorage.setItem(DISMISSED_KEY, cycleStartedAt).catch(() => undefined);
}
