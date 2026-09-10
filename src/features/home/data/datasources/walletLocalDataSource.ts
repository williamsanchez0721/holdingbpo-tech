import AsyncStorage from '@react-native-async-storage/async-storage';

import { Transaction } from '../../domain/entities/Transaction';
import { WalletBalance } from '../../domain/entities/WalletBalance';

const RECOVERED_FLAG_KEY = 'wallet.isRecovered';

const NEW_WALLET_BALANCE: WalletBalance = {
  amount: 0,
  currency: 'USD',
  convertedAmount: 0,
  convertedCurrency: 'COP',
};

// Simula el balance y los movimientos de una billetera recuperada desde un
// backup, hasta que exista un endpoint real que consultar.
const RECOVERED_WALLET_BALANCE: WalletBalance = {
  amount: 13502.59,
  currency: 'USDT',
  convertedAmount: 56079980.42,
  convertedCurrency: 'COP',
};

const RECOVERED_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    type: 'sent',
    status: 'completed',
    title: 'Enviaste',
    subtitle: 'ERC-20 Network',
    amountLabel: '100.00 USDT',
    dateLabel: '29 Enero',
  },
  {
    id: '2',
    type: 'sent',
    status: 'failed',
    title: 'Enviaste',
    subtitle: 'Transacción fallida',
    amountLabel: '0.023 BTC',
    dateLabel: '30 Enero',
  },
  {
    id: '3',
    type: 'exchanged',
    status: 'completed',
    title: 'Cambiaste',
    subtitle: 'BTC por USDT',
    amountLabel: '0.0344 BTC',
    dateLabel: '31 Enero',
  },
];

async function isWalletRecovered(): Promise<boolean> {
  const flag = await AsyncStorage.getItem(RECOVERED_FLAG_KEY);
  return flag === 'true';
}

export const walletLocalDataSource = {
  async getBalance(): Promise<WalletBalance> {
    return (await isWalletRecovered()) ? RECOVERED_WALLET_BALANCE : NEW_WALLET_BALANCE;
  },
  async getRecentTransactions(): Promise<Transaction[]> {
    return (await isWalletRecovered()) ? RECOVERED_TRANSACTIONS : [];
  },
  markAsRecovered(): Promise<void> {
    return AsyncStorage.setItem(RECOVERED_FLAG_KEY, 'true');
  },
};
