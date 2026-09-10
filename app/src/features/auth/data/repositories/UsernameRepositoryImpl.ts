import AsyncStorage from '@react-native-async-storage/async-storage';

import { apiRequest } from '@shared/services/apiClient';

import { UsernameRepository } from '../../domain/repositories/UsernameRepository';

const RESERVED_USERNAME_KEY = 'auth.username';

interface AvailabilityResponse {
  available: boolean;
}

export class UsernameRepositoryImpl implements UsernameRepository {
  async checkAvailability(username: string): Promise<boolean> {
    const { available } = await apiRequest<AvailabilityResponse>(
      `/username/${encodeURIComponent(username)}/availability`,
    );
    return available;
  }

  async reserve(username: string): Promise<void> {
    await apiRequest('/username', { method: 'POST', body: { username }, requiresAuth: true });
    await AsyncStorage.setItem(RESERVED_USERNAME_KEY, username);
  }

  getReserved(): Promise<string | null> {
    return AsyncStorage.getItem(RESERVED_USERNAME_KEY);
  }

  clearReserved(): Promise<void> {
    return AsyncStorage.removeItem(RESERVED_USERNAME_KEY);
  }
}
