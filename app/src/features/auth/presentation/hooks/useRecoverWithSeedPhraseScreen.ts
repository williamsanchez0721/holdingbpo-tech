import { useCallback, useRef, useState } from 'react';

import { recoverWalletWithSeedPhraseUseCase } from '../../container';
import { WalletRecoveryError } from '../../domain/usecases/recoverWalletWithEmailUseCase';

const GENERIC_ERROR_MESSAGE = 'No pudimos recuperar tu billetera. Intenta nuevamente.';

interface UseRecoverWithSeedPhraseScreenParams {
  onRecovered: (username: string) => void;
}

export function useRecoverWithSeedPhraseScreen({
  onRecovered,
}: UseRecoverWithSeedPhraseScreenParams) {
  const seedPhraseRef = useRef('');
  const [seedPhrase, setSeedPhrase] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChangeText = useCallback((text: string) => {
    seedPhraseRef.current = text;
    setSeedPhrase(text);
    setErrorMessage(null);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (seedPhraseRef.current.trim().length === 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      const username = await recoverWalletWithSeedPhraseUseCase(seedPhraseRef.current);
      setErrorMessage(null);
      onRecovered(username);
    } catch (error) {
      setErrorMessage(error instanceof WalletRecoveryError ? error.message : GENERIC_ERROR_MESSAGE);
    } finally {
      setIsSubmitting(false);
    }
  }, [onRecovered]);

  return {
    seedPhrase,
    errorMessage,
    isSubmitting,
    isSubmitDisabled: seedPhrase.trim().length === 0 || isSubmitting,
    handleChangeText,
    handleSubmit,
  };
}
