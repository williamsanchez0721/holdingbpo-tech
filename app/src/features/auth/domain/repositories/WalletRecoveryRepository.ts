export interface WalletRecoveryRepository {
  recoverWithEmail(email: string, password: string): Promise<string | null>;
  recoverWithSeedPhrase(seedPhrase: string): Promise<string | null>;
}
