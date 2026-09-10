import { UsernameRepository } from '../repositories/UsernameRepository';

import { evaluateUsernameFormatUseCase } from './evaluateUsernameFormatUseCase';

export type UsernameCreationErrorCode = 'INVALID_FORMAT' | 'TAKEN' | 'STORAGE_FAILURE';

export class UsernameCreationError extends Error {
  constructor(
    public readonly code: UsernameCreationErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'UsernameCreationError';
  }
}

export function makeCreateUsernameUseCase(repository: UsernameRepository) {
  return async function createUsernameUseCase(username: string): Promise<void> {
    const format = evaluateUsernameFormatUseCase(username);

    if (!format.isValid) {
      throw new UsernameCreationError(
        'INVALID_FORMAT',
        'El nombre de usuario no cumple el formato requerido.',
      );
    }

    const isAvailable = await repository.checkAvailability(username);

    if (!isAvailable) {
      throw new UsernameCreationError('TAKEN', 'El usuario ingresado no está disponible.');
    }

    try {
      await repository.reserve(username);
    } catch {
      throw new UsernameCreationError(
        'STORAGE_FAILURE',
        'No pudimos crear tu usuario. Intenta nuevamente.',
      );
    }
  };
}
