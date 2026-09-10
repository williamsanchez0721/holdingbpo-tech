import { useCallback, useEffect, useRef, useState } from 'react';

import { unlockWithBiometricsUseCase, verifyPinUseCase } from '../../container';
import { PIN_LENGTH } from '../../domain/usecases/evaluatePinStrengthUseCase';

const MISMATCH_ERROR_MESSAGE = 'El PIN ingresado no es correcto. Intenta nuevamente.';

interface UseUnlockScreenParams {
  onUnlocked: () => void;
}

export function useUnlockScreen({ onUnlocked }: UseUnlockScreenParams) {
  const isVerifyingRef = useRef(false);
  const [value, setValue] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const verifyPin = useCallback(
    async (pin: string) => {
      isVerifyingRef.current = true;
      try {
        const isValid = await verifyPinUseCase(pin);
        if (isValid) {
          onUnlocked();
          return;
        }
        setErrorMessage(MISMATCH_ERROR_MESSAGE);
        setValue('');
      } finally {
        isVerifyingRef.current = false;
      }
    },
    [onUnlocked],
  );

  const attemptBiometricUnlock = useCallback(async () => {
    const result = await unlockWithBiometricsUseCase();
    if (result === 'UNLOCKED') {
      onUnlocked();
    }
  }, [onUnlocked]);

  useEffect(() => {
    void attemptBiometricUnlock();
  }, [attemptBiometricUnlock]);

  const onChangeText = useCallback(
    (rawText: string) => {
      if (isVerifyingRef.current) {
        return;
      }

      const digitsOnly = rawText.replace(/\D/g, '').slice(0, PIN_LENGTH);
      setErrorMessage(null);
      setValue(digitsOnly);

      if (digitsOnly.length === PIN_LENGTH) {
        void verifyPin(digitsOnly);
      }
    },
    [verifyPin],
  );

  return { value, errorMessage, onChangeText };
}
