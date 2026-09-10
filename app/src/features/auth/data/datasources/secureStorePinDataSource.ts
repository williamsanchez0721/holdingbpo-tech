import * as SecureStore from 'expo-secure-store';

const PIN_HASH_KEY = 'auth.pinHash';

export const secureStorePinDataSource = {
  savePinHash(pinHash: string): Promise<void> {
    return SecureStore.setItemAsync(PIN_HASH_KEY, pinHash);
  },
  getPinHash(): Promise<string | null> {
    return SecureStore.getItemAsync(PIN_HASH_KEY);
  },
  clearPinHash(): Promise<void> {
    return SecureStore.deleteItemAsync(PIN_HASH_KEY);
  },
};
