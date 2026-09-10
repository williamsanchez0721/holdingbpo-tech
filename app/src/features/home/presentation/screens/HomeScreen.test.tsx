import { render, screen, waitFor } from '@testing-library/react-native';

import { getRecentTransactionsUseCase, getWalletBalanceUseCase } from '../../container';

import { HomeScreen } from './HomeScreen';

jest.mock('../../container', () => ({
  getWalletBalanceUseCase: jest.fn(),
  getRecentTransactionsUseCase: jest.fn(),
}));

jest.mock('../../../auth/container', () => ({
  getReservedUsernameUseCase: jest.fn(() => Promise.resolve('luismauricio297')),
}));

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.mocked(getWalletBalanceUseCase).mockResolvedValue({
      amount: 0,
      currency: 'USD',
      convertedAmount: 0,
      convertedCurrency: 'COP',
    });
    jest.mocked(getRecentTransactionsUseCase).mockResolvedValue([]);
  });

  it('muestra el balance en cero y el estado vacío de movimientos para una billetera nueva', async () => {
    await render(<HomeScreen />);

    await waitFor(() => {
      expect(screen.getByText('$0,00')).toBeTruthy();
    });

    expect(screen.getByText('luismauricio297')).toBeTruthy();
    expect(
      screen.getByText('Aún no tienes transacciones disponibles para mostrar...'),
    ).toBeTruthy();
  });
});
