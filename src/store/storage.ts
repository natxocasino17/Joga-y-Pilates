/**
 * Thin typed wrapper around AsyncStorage. All persistence is local to the
 * device — no accounts, no network. Each value is JSON-encoded under a
 * namespaced key.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIX = 'flora.v1.';

export const StorageKeys = {
  profile: 'profile',
  progress: 'progress',
  preferences: 'preferences',
  onboarded: 'onboarded',
  dailySalt: 'dailySalt',
} as const;

export type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys];

export async function loadItem<T>(key: StorageKey): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export async function saveItem<T>(key: StorageKey, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Persistence is best-effort; a write failure shouldn't crash the app.
  }
}

export async function clearAll(): Promise<void> {
  try {
    const keys = Object.values(StorageKeys).map((k) => PREFIX + k);
    await AsyncStorage.multiRemove(keys);
  } catch {
    // ignore
  }
}
