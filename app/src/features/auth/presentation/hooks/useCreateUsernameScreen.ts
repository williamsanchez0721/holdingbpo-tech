import { useCallback, useRef, useState } from 'react';

import { createUsernameUseCase } from '../../container';
import { UsernameCreationError } from '../../domain/usecases/createUsernameUseCase';

export type UsernameFieldStatus = 'idle' | 'checking' | 'available' | 'taken' | 'invalid';

const GENERIC_ERROR_MESSAGE = 'No pudimos crear tu usuario. Intenta nuevamente.';

interface UseCreateUsernameScreenParams {
  onCompleted: () => void;
}

export function useCreateUsernameScreen({ onCompleted }: UseCreateUsernameScreenParams) {
  const usernameRef = useRef('');
  const [username, setUsername] = useState('');
  const [status, setStatus] = useState<UsernameFieldStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChangeText = useCallback((text: string) => {
    usernameRef.current = text;
    setUsername(text);
    setStatus('idle');
    setErrorMessage(null);
  }, []);

  const handleSubmit = useCallback(async () => {
    const currentUsername = usernameRef.current;

    if (currentUsername.trim().length === 0) {
      return;
    }

    setStatus('checking');
    try {
      await createUsernameUseCase(currentUsername);
      setStatus('available');
      onCompleted();
    } catch (error) {
      if (error instanceof UsernameCreationError) {
        setStatus(error.code === 'TAKEN' ? 'taken' : 'invalid');
        setErrorMessage(error.message);
        return;
      }
      setStatus('invalid');
      setErrorMessage(GENERIC_ERROR_MESSAGE);
    }
  }, [onCompleted]);

  const handleSkip = useCallback(() => {
    onCompleted();
  }, [onCompleted]);

  return {
    username,
    status,
    errorMessage,
    isSubmitDisabled: username.trim().length === 0 || status === 'checking',
    handleChangeText,
    handleSubmit,
    handleSkip,
  };
}
