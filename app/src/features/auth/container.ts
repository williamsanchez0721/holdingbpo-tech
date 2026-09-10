import { BiometricRepositoryImpl } from './data/repositories/BiometricRepositoryImpl';
import { PinRepositoryImpl } from './data/repositories/PinRepositoryImpl';
import { UsernameRepositoryImpl } from './data/repositories/UsernameRepositoryImpl';
import { WalletRecoveryRepositoryImpl } from './data/repositories/WalletRecoveryRepositoryImpl';
import { makeCreatePinUseCase } from './domain/usecases/createPinUseCase';
import { makeCreateUsernameUseCase } from './domain/usecases/createUsernameUseCase';
import { makeEnableBiometricLoginUseCase } from './domain/usecases/enableBiometricLoginUseCase';
import { makeGetReservedUsernameUseCase } from './domain/usecases/getReservedUsernameUseCase';
import { makeHasExistingWalletUseCase } from './domain/usecases/hasExistingWalletUseCase';
import { makeLogoutUseCase } from './domain/usecases/logoutUseCase';
import { makeRecoverWalletWithEmailUseCase } from './domain/usecases/recoverWalletWithEmailUseCase';
import { makeRecoverWalletWithSeedPhraseUseCase } from './domain/usecases/recoverWalletWithSeedPhraseUseCase';
import { makeUnlockWithBiometricsUseCase } from './domain/usecases/unlockWithBiometricsUseCase';
import { makeVerifyPinUseCase } from './domain/usecases/verifyPinUseCase';

const usernameRepository = new UsernameRepositoryImpl();
const pinRepository = new PinRepositoryImpl();
const biometricRepository = new BiometricRepositoryImpl();
const walletRecoveryRepository = new WalletRecoveryRepositoryImpl();

export const createPinUseCase = makeCreatePinUseCase(pinRepository);
export const verifyPinUseCase = makeVerifyPinUseCase(pinRepository);
export const hasExistingWalletUseCase = makeHasExistingWalletUseCase(pinRepository);
export const enableBiometricLoginUseCase = makeEnableBiometricLoginUseCase(biometricRepository);
export const unlockWithBiometricsUseCase = makeUnlockWithBiometricsUseCase(biometricRepository);
export const createUsernameUseCase = makeCreateUsernameUseCase(usernameRepository);
export const getReservedUsernameUseCase = makeGetReservedUsernameUseCase(usernameRepository);
export const recoverWalletWithEmailUseCase = makeRecoverWalletWithEmailUseCase(
  walletRecoveryRepository,
  usernameRepository,
);
export const recoverWalletWithSeedPhraseUseCase = makeRecoverWalletWithSeedPhraseUseCase(
  walletRecoveryRepository,
  usernameRepository,
);
export const logoutUseCase = makeLogoutUseCase(
  pinRepository,
  biometricRepository,
  usernameRepository,
);
