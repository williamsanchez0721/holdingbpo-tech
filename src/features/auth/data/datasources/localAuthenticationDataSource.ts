import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

const BIOMETRIC_ENABLED_KEY = 'auth.biometricEnabled';
const DEFAULT_PROMPT_MESSAGE = 'Confirma tu identidad para activar el acceso biométrico';

export const localAuthenticationDataSource = {
  async isSupported(): Promise<boolean> {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    return hasHardware && isEnrolled;
  },
  async isEnabled(): Promise<boolean> {
    const value = await SecureStore.getItemAsync(BIOMETRIC_ENABLED_KEY);
    return value === 'true';
  },
  async authenticate(promptMessage: string = DEFAULT_PROMPT_MESSAGE): Promise<boolean> {
    const result = await LocalAuthentication.authenticateAsync({ promptMessage });
    return result.success;
  },
  setEnabled(enabled: boolean): Promise<void> {
    return SecureStore.setItemAsync(BIOMETRIC_ENABLED_KEY, enabled ? 'true' : 'false');
  },
  clearEnabled(): Promise<void> {
    return SecureStore.deleteItemAsync(BIOMETRIC_ENABLED_KEY);
  },
};
