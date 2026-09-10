import { UsernameRepository } from '../../domain/repositories/UsernameRepository';
import { usernameLocalDataSource } from '../datasources/usernameLocalDataSource';

export class UsernameRepositoryImpl implements UsernameRepository {
  async checkAvailability(username: string): Promise<boolean> {
    const taken = await usernameLocalDataSource.isTaken(username);
    return !taken;
  }

  reserve(username: string): Promise<void> {
    return usernameLocalDataSource.persist(username);
  }

  getReserved(): Promise<string | null> {
    return usernameLocalDataSource.getPersisted();
  }

  clearReserved(): Promise<void> {
    return usernameLocalDataSource.clearPersisted();
  }
}
