import { useCallback, useRef, useState } from 'react';

import { PinWeaknessReason } from '../../domain/entities/PinStrengthResult';
import { evaluatePinStrengthUseCase } from '../../domain/usecases/evaluatePinStrengthUseCase';

const PIN_ERROR_MESSAGES: Record<PinWeaknessReason, string> = {
  TOO_SHORT: 'El PIN debe tener 6 dígitos.',
  REPEATED_DIGIT: 'El PIN no puede tener todos los dígitos iguales.',
  SEQUENTIAL: 'El PIN no puede ser una secuencia (ej. 123456).',
};

interface UseCreatePinScreenParams {
  pinLength: number;
  onPinCreated: (pin: string) => void;
}

export function useCreatePinScreen({ pinLength, onPinCreated }: UseCreatePinScreenParams) {
  const valueRef = useRef('');
  const [value, setValue] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const setPinValue = useCallback((nextValue: string) => {
    valueRef.current = nextValue;
    setValue(nextValue);
  }, []);

  const onChangeText = useCallback(
    (rawText: string) => {
      const digitsOnly = rawText.replace(/\D/g, '').slice(0, pinLength);
      setErrorMessage(null);

      if (digitsOnly.length < pinLength) {
        setPinValue(digitsOnly);
        return;
      }

      const strength = evaluatePinStrengthUseCase(digitsOnly);

      if (!strength.isValid) {
        setPinValue('');
        setErrorMessage(PIN_ERROR_MESSAGES[strength.reason as PinWeaknessReason]);
        return;
      }

      setPinValue('');
      onPinCreated(digitsOnly);
    },
    [pinLength, onPinCreated, setPinValue],
  );

  return { value, errorMessage, onChangeText };
}
