import { HttpError } from '../middlewares/errorHandler';
import { TransactionModel } from '../models/Transaction';
import { UserModel } from '../models/User';
import { WalletModel } from '../models/Wallet';

const RECENT_TRANSACTIONS_LIMIT = 20;

export interface WalletBalanceDto {
  amount: number;
  currency: string;
  convertedAmount: number;
  convertedCurrency: string;
}

export interface TransactionDto {
  id: string;
  type: 'sent' | 'received' | 'exchanged';
  status: 'completed' | 'failed';
  title: string;
  subtitle: string;
  amountLabel: string;
  date: string;
}

async function getWalletIdForUser(userId: string): Promise<string> {
  const user = await UserModel.findById(userId).lean();

  if (!user) {
    throw new HttpError(404, 'Usuario no encontrado.');
  }

  return user.walletId.toString();
}

export async function getWalletBalance(userId: string): Promise<WalletBalanceDto> {
  const walletId = await getWalletIdForUser(userId);
  const wallet = await WalletModel.findById(walletId).lean();

  if (!wallet) {
    throw new HttpError(404, 'Wallet no encontrada.');
  }

  return {
    amount: wallet.amount,
    currency: wallet.currency,
    convertedAmount: wallet.convertedAmount,
    convertedCurrency: wallet.convertedCurrency,
  };
}

export async function getRecentTransactions(userId: string): Promise<TransactionDto[]> {
  const walletId = await getWalletIdForUser(userId);
  const transactions = await TransactionModel.find({ walletId })
    .sort({ date: -1 })
    .limit(RECENT_TRANSACTIONS_LIMIT)
    .lean();

  return transactions.map((transaction) => ({
    id: transaction._id.toString(),
    type: transaction.type as TransactionDto['type'],
    status: transaction.status as TransactionDto['status'],
    title: transaction.title,
    subtitle: transaction.subtitle,
    amountLabel: transaction.amountLabel,
    date: transaction.date.toISOString(),
  }));
}

export async function createWalletForNewUser(): Promise<{ userId: string; walletId: string }> {
  const wallet = await WalletModel.create({
    amount: 0,
    convertedAmount: 0,
    isRecovered: false,
  });
  const user = await UserModel.create({ walletId: wallet._id });

  return { userId: user._id.toString(), walletId: wallet._id.toString() };
}
