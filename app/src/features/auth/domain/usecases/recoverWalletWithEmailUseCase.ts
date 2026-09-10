import { UsernameRepository } from '../repositories/UsernameRepository';
import { WalletRecoveryRepository } from '../repositories/WalletRecoveryRepository';

import { evaluateEmailCredentialsFormatUseCase } from './evaluateEmailCredentialsFormatUseCase';

export type WalletRecoveryErrorCode =
  'INVALID_EMAIL' | 'EMPTY_PASSWORD' | 'INVALID_WORD_COUNT' | 'INVALID_CREDENTIALS';

export class WalletRecoveryError extends Error {
  constructor(
    public readonly code: WalletRecoveryErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'WalletRecoveryError';
  }
}

export function makeRecoverWalletWithEmailUseCase(
  recoveryRepository: WalletRecoveryRepository,
  usernameRepository: UsernameRepository,
) {
  return async function recoverWalletWithEmailUseCase(
    email: string,
    password: string,
  ): Promise<string> {
    const format = evaluateEmailCredentialsFormatUseCase(email, password);

    if (!format.isValid) {
      const message =
        format.reason === 'INVALID_EMAIL'
          ? 'Ingresa un correo electrónico válido.'
          : 'Ingresa tu contraseña.';
      throw new WalletRecoveryError(format.reason as WalletRecoveryErrorCode, message);
    }

    const username = await recoveryRepository.recoverWithEmail(email, password);

    if (!username) {
      throw new WalletRecoveryError(
        'INVALID_CREDENTIALS',
        'Las credenciales ingresadas no son válidas. Por favor verifica.',
      );
    }

    await usernameRepository.reserve(username);
    return username;
  };
}
