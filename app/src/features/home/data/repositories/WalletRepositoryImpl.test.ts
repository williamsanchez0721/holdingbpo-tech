import AsyncStorage from '@react-native-async-storage/async-storage';

import { WalletRepositoryImpl } from './WalletRepositoryImpl';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe('WalletRepositoryImpl', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('retorna un balance en cero para una billetera nueva (no recuperada)', async () => {
    jest.mocked(AsyncStorage.getItem).mockResolvedValue(null);
    const repository = new WalletRepositoryImpl();

    await expect(repository.getBalance()).resolves.toEqual({
      amount: 0,
      currency: 'USD',
      convertedAmount: 0,
      convertedCurrency: 'COP',
    });
  });

  it('retorna una lista vacía de movimientos para una billetera nueva', async () => {
    jest.mocked(AsyncStorage.getItem).mockResolvedValue(null);
    const repository = new WalletRepositoryImpl();

    await expect(repository.getRecentTransactions()).resolves.toEqual([]);
  });

  it('retorna balance y movimientos simulados cuando la billetera fue recuperada', async () => {
    jest.mocked(AsyncStorage.getItem).mockResolvedValue('true');
    const repository = new WalletRepositoryImpl();

    const balance = await repository.getBalance();
    const transactions = await repository.getRecentTransactions();

    expect(balance.amount).toBeGreaterThan(0);
    expect(transactions.length).toBeGreaterThan(0);
  });

  it('marca la billetera como recuperada', async () => {
    const repository = new WalletRepositoryImpl();

    await repository.markAsRecovered();

    expect(AsyncStorage.setItem).toHaveBeenCalledWith('wallet.isRecovered', 'true');
  });
});
