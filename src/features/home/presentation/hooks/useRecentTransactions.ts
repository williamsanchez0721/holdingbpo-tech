import { useEffect, useState } from 'react';

import { getRecentTransactionsUseCase } from '../../container';
import { Transaction } from '../../domain/entities/Transaction';

interface UseRecentTransactionsResult {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
}

export function useRecentTransactions(): UseRecentTransactionsResult {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    getRecentTransactionsUseCase()
      .then((result) => {
        if (isMounted) {
          setTransactions(result);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError('No pudimos cargar tus movimientos. Intenta nuevamente.');
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { transactions, isLoading, error };
}
