import * as SecureStore from "expo-secure-store";

export class SecureStorageAdapter {
  static async setItem(key: string, value: string) {
    await SecureStore.setItemAsync(key, value);
  }

  static async getItem(key: string) {
    return SecureStore.getItemAsync(key);
  }

  static async removeItem(key: string) {
    await SecureStore.deleteItemAsync(key);
  }
}

export const AUTH_TOKEN_KEY = "token";
