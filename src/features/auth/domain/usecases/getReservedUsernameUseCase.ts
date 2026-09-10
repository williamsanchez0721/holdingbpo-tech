import { UsernameRepository } from '../repositories/UsernameRepository';

export function makeGetReservedUsernameUseCase(repository: UsernameRepository) {
  return function getReservedUsernameUseCase(): Promise<string | null> {
    return repository.getReserved();
  };
}
