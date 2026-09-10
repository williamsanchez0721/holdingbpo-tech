import { useEffect } from 'react';

import { hasExistingWalletUseCase } from '../../container';

const REDIRECT_DELAY_MS = 1800;

export function useSplashRedirect(onRedirect: (hasExistingWallet: boolean) => void): void {
  useEffect(() => {
    let isCancelled = false;

    const timer = setTimeout(() => {
      void hasExistingWalletUseCase().then((hasExistingWallet) => {
        if (!isCancelled) {
          onRedirect(hasExistingWallet);
        }
      });
    }, REDIRECT_DELAY_MS);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [onRedirect]);
}
