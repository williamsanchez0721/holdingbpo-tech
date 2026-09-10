export interface PinRepository {
  savePin(pin: string): Promise<void>;
  hasPin(): Promise<boolean>;
  verifyPin(pin: string): Promise<boolean>;
  clearPin(): Promise<void>;
}
