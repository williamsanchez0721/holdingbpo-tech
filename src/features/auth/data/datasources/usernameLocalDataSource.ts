import AsyncStorage from '@react-native-async-storage/async-storage';

const RESERVED_USERNAME_KEY = 'auth.username';

// Simula un backend: lista de usuarios ya tomados y una latencia de red,
// hasta que exista un endpoint real para validar disponibilidad.
const TAKEN_USERNAMES = new Set(['luismauricio99', 'admin', 'guatapay']);
const SIMULATED_NETWORK_DELAY_MS = 400;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const usernameLocalDataSource = {
  async isTaken(username: string): Promise<boolean> {
    await delay(SIMULATED_NETWORK_DELAY_MS);
    return TAKEN_USERNAMES.has(username.toLowerCase());
  },
  persist(username: string): Promise<void> {
    return AsyncStorage.setItem(RESERVED_USERNAME_KEY, username);
  },
  getPersisted(): Promise<string | null> {
    return AsyncStorage.getItem(RESERVED_USERNAME_KEY);
  },
  clearPersisted(): Promise<void> {
    return AsyncStorage.removeItem(RESERVED_USERNAME_KEY);
  },
};
