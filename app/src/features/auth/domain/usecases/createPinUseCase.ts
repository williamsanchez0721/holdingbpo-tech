import { PinRepository } from '../repositories/PinRepository';

import { evaluatePinStrengthUseCase } from './evaluatePinStrengthUseCase';

export class WeakPinError extends Error {
  constructor(public readonly reason: string) {
    super('El PIN no cumple con la política de seguridad.');
    this.name = 'WeakPinError';
  }
}

export function makeCreatePinUseCase(repository: PinRepository) {
  return async function createPinUseCase(pin: string): Promise<void> {
    const strength = evaluatePinStrengthUseCase(pin);

    if (!strength.isValid) {
      throw new WeakPinError(strength.reason ?? 'UNKNOWN');
    }

    await repository.savePin(pin);
  };
}
