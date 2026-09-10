export interface UsernameRepository {
  checkAvailability(username: string): Promise<boolean>;
  reserve(username: string): Promise<void>;
  getReserved(): Promise<string | null>;
  clearReserved(): Promise<void>;
}
