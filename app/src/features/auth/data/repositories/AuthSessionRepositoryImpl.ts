import { authSession } from '@shared/services/authSession';

import { AuthSessionRepository } from '../../domain/repositories/AuthSessionRepository';

export class AuthSessionRepositoryImpl implements AuthSessionRepository {
  clearToken(): Promise<void> {
    return authSession.clearToken();
  }
}
