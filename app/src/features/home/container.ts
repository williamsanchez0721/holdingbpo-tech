import { WalletRepositoryImpl } from './data/repositories/WalletRepositoryImpl';
import { makeGetRecentTransactionsUseCase } from './domain/usecases/getRecentTransactionsUseCase';
import { makeGetWalletBalanceUseCase } from './domain/usecases/getWalletBalanceUseCase';
import { makeMarkWalletAsRecoveredUseCase } from './domain/usecases/markWalletAsRecoveredUseCase';

const walletRepository = new WalletRepositoryImpl();

export const getWalletBalanceUseCase = makeGetWalletBalanceUseCase(walletRepository);
export const getRecentTransactionsUseCase = makeGetRecentTransactionsUseCase(walletRepository);
export const markWalletAsRecoveredUseCase = makeMarkWalletAsRecoveredUseCase(walletRepository);
