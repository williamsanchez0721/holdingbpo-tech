import { UsernameRepository } from '../repositories/UsernameRepository';
import { WalletRecoveryRepository } from '../repositories/WalletRecoveryRepository';

import { evaluateSeedPhraseFormatUseCase } from './evaluateSeedPhraseFormatUseCase';
import { WalletRecoveryError } from './recoverWalletWithEmailUseCase';

export function makeRecoverWalletWithSeedPhraseUseCase(
  recoveryRepository: WalletRecoveryRepository,
  usernameRepository: UsernameRepository,
) {
  return async function recoverWalletWithSeedPhraseUseCase(seedPhrase: string): Promise<string> {
    const format = evaluateSeedPhraseFormatUseCase(seedPhrase);

    if (!format.isValid) {
      throw new WalletRecoveryError(
        'INVALID_WORD_COUNT',
        'La frase semilla debe tener 12 palabras separadas por espacios.',
      );
    }

    const username = await recoveryRepository.recoverWithSeedPhrase(seedPhrase);

    if (!username) {
      throw new WalletRecoveryError(
        'INVALID_CREDENTIALS',
        'La frase semilla ingresada no es válida. Por favor verifica.',
      );
    }

    await usernameRepository.reserve(username);
    return username;
  };
}
