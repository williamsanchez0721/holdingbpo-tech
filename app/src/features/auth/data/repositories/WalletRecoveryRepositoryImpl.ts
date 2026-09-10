import { WalletRecoveryRepository } from '../../domain/repositories/WalletRecoveryRepository';
import { walletRecoveryLocalDataSource } from '../datasources/walletRecoveryLocalDataSource';

export class WalletRecoveryRepositoryImpl implements WalletRecoveryRepository {
  recoverWithEmail(email: string, password: string): Promise<string | null> {
    return walletRecoveryLocalDataSource.verifyEmail(email, password);
  }

  recoverWithSeedPhrase(seedPhrase: string): Promise<string | null> {
    return walletRecoveryLocalDataSource.verifySeedPhrase(seedPhrase);
  }
}
