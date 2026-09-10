import * as Crypto from 'expo-crypto';

import { PinRepository } from '../../domain/repositories/PinRepository';
import { secureStorePinDataSource } from '../datasources/secureStorePinDataSource';

async function hashPin(pin: string): Promise<string> {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, pin);
}

export class PinRepositoryImpl implements PinRepository {
  async savePin(pin: string): Promise<void> {
    const pinHash = await hashPin(pin);
    await secureStorePinDataSource.savePinHash(pinHash);
  }

  async hasPin(): Promise<boolean> {
    const pinHash = await secureStorePinDataSource.getPinHash();
    return pinHash !== null;
  }

  async verifyPin(pin: string): Promise<boolean> {
    const storedHash = await secureStorePinDataSource.getPinHash();
    if (storedHash === null) {
      return false;
    }
    const candidateHash = await hashPin(pin);
    return candidateHash === storedHash;
  }

  clearPin(): Promise<void> {
    return secureStorePinDataSource.clearPinHash();
  }
}
