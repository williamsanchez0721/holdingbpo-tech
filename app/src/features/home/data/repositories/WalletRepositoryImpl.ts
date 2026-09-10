import { apiRequest } from '@shared/services/apiClient';
import { authSession } from '@shared/services/authSession';

import { Transaction } from '../../domain/entities/Transaction';
import { WalletBalance } from '../../domain/entities/WalletBalance';
import { WalletRepository } from '../../domain/repositories/WalletRepository';

interface TransactionDto {
  id: string;
  type: Transaction['type'];
  status: Transaction['status'];
  title: string;
  subtitle: string;
  amountLabel: string;
  date: string;
}

interface CreateWalletResponse {
  token: string;
  walletId: string;
}

function formatDateLabel(dateIso: string): string {
  return new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'long' }).format(
    new Date(dateIso),
  );
}

export class WalletRepositoryImpl implements WalletRepository {
  getBalance(): Promise<WalletBalance> {
    return apiRequest<WalletBalance>('/wallet/balance', { requiresAuth: true });
  }

  async getRecentTransactions(): Promise<Transaction[]> {
    const transactions = await apiRequest<TransactionDto[]>('/wallet/transactions', {
      requiresAuth: true,
    });

    return transactions.map((transaction) => ({
      id: transaction.id,
      type: transaction.type,
      status: transaction.status,
      title: transaction.title,
      subtitle: transaction.subtitle,
      amountLabel: transaction.amountLabel,
      dateLabel: formatDateLabel(transaction.date),
    }));
  }

  async createWalletAccount(): Promise<void> {
    const { token } = await apiRequest<CreateWalletResponse>('/wallets', { method: 'POST' });
    await authSession.setToken(token);
  }
}
