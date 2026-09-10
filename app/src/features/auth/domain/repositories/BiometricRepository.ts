export interface BiometricRepository {
  isAvailable(): Promise<boolean>;
  isEnabled(): Promise<boolean>;
  authenticate(promptMessage?: string): Promise<boolean>;
  setEnabled(enabled: boolean): Promise<void>;
  clear(): Promise<void>;
}
