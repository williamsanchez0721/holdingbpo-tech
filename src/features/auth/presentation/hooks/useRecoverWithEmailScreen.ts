import { useCallback, useRef, useState } from 'react';

import { recoverWalletWithEmailUseCase } from '../../container';
import { WalletRecoveryError } from '../../domain/usecases/recoverWalletWithEmailUseCase';

const GENERIC_ERROR_MESSAGE = 'No pudimos recuperar tu billetera. Intenta nuevamente.';

interface UseRecoverWithEmailScreenParams {
  onRecovered: (username: string) => void;
}

export function useRecoverWithEmailScreen({ onRecovered }: UseRecoverWithEmailScreenParams) {
  const emailRef = useRef('');
  const passwordRef = useRef('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChangeEmail = useCallback((text: string) => {
    emailRef.current = text;
    setEmail(text);
    setErrorMessage(null);
  }, []);

  const handleChangePassword = useCallback((text: string) => {
    passwordRef.current = text;
    setPassword(text);
    setErrorMessage(null);
  }, []);

  const handleTogglePasswordVisibility = useCallback(() => {
    setIsPasswordVisible((current) => !current);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (emailRef.current.trim().length === 0 || passwordRef.current.trim().length === 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      const username = await recoverWalletWithEmailUseCase(emailRef.current, passwordRef.current);
      setErrorMessage(null);
      onRecovered(username);
    } catch (error) {
      setErrorMessage(error instanceof WalletRecoveryError ? error.message : GENERIC_ERROR_MESSAGE);
    } finally {
      setIsSubmitting(false);
    }
  }, [onRecovered]);

  return {
    email,
    password,
    isPasswordVisible,
    errorMessage,
    isSubmitting,
    isSubmitDisabled: email.trim().length === 0 || password.trim().length === 0 || isSubmitting,
    handleChangeEmail,
    handleChangePassword,
    handleTogglePasswordVisibility,
    handleSubmit,
  };
}
