import { apiRequest } from '@shared/services/apiClient';
import { authSession } from '@shared/services/authSession';

import { WalletRepositoryImpl } from './WalletRepositoryImpl';

jest.mock('@shared/services/apiClient', () => ({
  apiRequest: jest.fn(),
}));

jest.mock('@shared/services/authSession', () => ({
  authSession: {
    setToken: jest.fn(),
  },
}));

describe('WalletRepositoryImpl', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('obtiene el balance de la billetera desde el backend', async () => {
    const balance = { amount: 0, currency: 'USD', convertedAmount: 0, convertedCurrency: 'COP' };
    jest.mocked(apiRequest).mockResolvedValue(balance);
    const repository = new WalletRepositoryImpl();

    await expect(repository.getBalance()).resolves.toEqual(balance);
    expect(apiRequest).toHaveBeenCalledWith('/wallet/balance', { requiresAuth: true });
  });

  it('obtiene y mapea los movimientos recientes desde el backend', async () => {
    jest.mocked(apiRequest).mockResolvedValue([
      {
        id: '1',
        type: 'sent',
        status: 'completed',
        title: 'Enviaste',
        subtitle: 'ERC-20 Network',
        amountLabel: '100.00 USDT',
        date: '2026-01-29T00:00:00.000Z',
      },
    ]);
    const repository = new WalletRepositoryImpl();

    const transactions = await repository.getRecentTransactions();

    expect(transactions).toEqual([
      {
        id: '1',
        type: 'sent',
        status: 'completed',
        title: 'Enviaste',
        subtitle: 'ERC-20 Network',
        amountLabel: '100.00 USDT',
        dateLabel: expect.any(String),
      },
    ]);
  });

  it('crea la cuenta de la billetera y guarda el token de sesión', async () => {
    jest.mocked(apiRequest).mockResolvedValue({ token: 'jwt-token', walletId: 'w1' });
    const repository = new WalletRepositoryImpl();

    await repository.createWalletAccount();

    expect(apiRequest).toHaveBeenCalledWith('/wallets', { method: 'POST' });
    expect(authSession.setToken).toHaveBeenCalledWith('jwt-token');
  });
});
