import { useCallback, useEffect, useState } from 'react';

import { getWalletBalanceUseCase } from '../../container';
import { WalletBalance } from '../../domain/entities/WalletBalance';

interface UseWalletBalanceResult {
  balance: WalletBalance | null;
  isLoading: boolean;
  error: string | null;
  isVisible: boolean;
  toggleVisibility: () => void;
}

export function useWalletBalance(): UseWalletBalanceResult {
  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let isMounted = true;

    getWalletBalanceUseCase()
      .then((result) => {
        if (isMounted) {
          setBalance(result);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError('No pudimos cargar tu balance. Intenta nuevamente.');
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

  const toggleVisibility = useCallback(() => setIsVisible((current) => !current), []);

  return { balance, isLoading, error, isVisible, toggleVisibility };
}
