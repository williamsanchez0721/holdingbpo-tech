export type TransactionType = 'sent' | 'received' | 'exchanged';
export type TransactionStatus = 'completed' | 'failed';

export interface Transaction {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  title: string;
  subtitle: string;
  amountLabel: string;
  dateLabel: string;
}
