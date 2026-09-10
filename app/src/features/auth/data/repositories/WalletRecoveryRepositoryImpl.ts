import { ApiError, apiRequest } from '@shared/services/apiClient';
import { authSession } from '@shared/services/authSession';

import { WalletRecoveryRepository } from '../../domain/repositories/WalletRecoveryRepository';

interface RecoveryResponse {
  token: string;
  username: string | null;
}

async function recover(path: string, body: unknown): Promise<string | null> {
  try {
    const { token, username } = await apiRequest<RecoveryResponse>(path, {
      method: 'POST',
      body,
    });
    await authSession.setToken(token);
    return username;
  } catch (error) {
    if (error instanceof ApiError) {
      return null;
    }
    throw error;
  }
}

export class WalletRecoveryRepositoryImpl implements WalletRecoveryRepository {
  recoverWithEmail(email: string, password: string): Promise<string | null> {
    return recover('/auth/recover/email', { email, password });
  }

  recoverWithSeedPhrase(seedPhrase: string): Promise<string | null> {
    return recover('/auth/recover/seed-phrase', { seedPhrase });
  }
}
