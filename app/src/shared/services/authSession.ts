import * as SecureStore from 'expo-secure-store';

const AUTH_TOKEN_KEY = 'auth.token';

export const authSession = {
  getToken(): Promise<string | null> {
    return SecureStore.getItemAsync(AUTH_TOKEN_KEY);
  },
  setToken(token: string): Promise<void> {
    return SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
  },
  clearToken(): Promise<void> {
    return SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
  },
};
