import { WalletRepositoryImpl } from './data/repositories/WalletRepositoryImpl';
import { makeCreateWalletAccountUseCase } from './domain/usecases/createWalletAccountUseCase';
import { makeGetRecentTransactionsUseCase } from './domain/usecases/getRecentTransactionsUseCase';
import { makeGetWalletBalanceUseCase } from './domain/usecases/getWalletBalanceUseCase';

const walletRepository = new WalletRepositoryImpl();

export const getWalletBalanceUseCase = makeGetWalletBalanceUseCase(walletRepository);
export const getRecentTransactionsUseCase = makeGetRecentTransactionsUseCase(walletRepository);
export const createWalletAccountUseCase = makeCreateWalletAccountUseCase(walletRepository);
