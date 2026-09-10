import { useCallback, useRef, useState } from 'react';

import { createPinUseCase, enableBiometricLoginUseCase } from '../../container';
import { confirmPinMatchUseCase } from '../../domain/usecases/confirmPinMatchUseCase';

const MAX_MISMATCH_ATTEMPTS = 3;
const MISMATCH_ERROR_MESSAGE = 'El código ingresado no coincide. Intenta nuevamente.';
const SAVE_ERROR_MESSAGE = 'No pudimos guardar tu PIN. Intenta nuevamente.';

interface UseConfirmPinScreenParams {
  pinLength: number;
  originalPin: string;
  onConfirmed: () => void | Promise<void>;
  onRestartRequired: () => void;
}

interface ConfirmPinCallbacks {
  onConfirmed: () => void | Promise<void>;
  setIsSubmitting: (value: boolean) => void;
  setErrorMessage: (value: string | null) => void;
  setPinValue: (value: string) => void;
}

async function submitConfirmedPin(pin: string, callbacks: ConfirmPinCallbacks): Promise<void> {
  callbacks.setIsSubmitting(true);
  try {
    await createPinUseCase(pin);
    await enableBiometricLoginUseCase();
    callbacks.setErrorMessage(null);
    await callbacks.onConfirmed();
  } catch {
    callbacks.setErrorMessage(SAVE_ERROR_MESSAGE);
    callbacks.setPinValue('');
  } finally {
    callbacks.setIsSubmitting(false);
  }
}

export function useConfirmPinScreen({
  pinLength,
  originalPin,
  onConfirmed,
  onRestartRequired,
}: UseConfirmPinScreenParams) {
  const valueRef = useRef('');
  const mismatchCountRef = useRef(0);
  const isSubmittingRef = useRef(false);
  const [value, setValue] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setPinValue = useCallback((nextValue: string) => {
    valueRef.current = nextValue;
    setValue(nextValue);
  }, []);

  const handleMatch = useCallback(
    async (pin: string) => {
      isSubmittingRef.current = true;
      await submitConfirmedPin(pin, { onConfirmed, setIsSubmitting, setErrorMessage, setPinValue });
      isSubmittingRef.current = false;
    },
    [onConfirmed, setPinValue],
  );

  const onChangeText = useCallback(
    (rawText: string) => {
      if (isSubmittingRef.current) {
        return;
      }

      const digitsOnly = rawText.replace(/\D/g, '').slice(0, pinLength);
      setErrorMessage(null);

      if (digitsOnly.length < pinLength) {
        setPinValue(digitsOnly);
        return;
      }

      if (!confirmPinMatchUseCase(originalPin, digitsOnly)) {
        mismatchCountRef.current += 1;
        setErrorMessage(MISMATCH_ERROR_MESSAGE);
        setPinValue('');

        if (mismatchCountRef.current >= MAX_MISMATCH_ATTEMPTS) {
          onRestartRequired();
        }
        return;
      }

      setPinValue(digitsOnly);
      void handleMatch(digitsOnly);
    },
    [pinLength, originalPin, onRestartRequired, handleMatch, setPinValue],
  );

  return { value, errorMessage, isSubmitting, onChangeText };
}
