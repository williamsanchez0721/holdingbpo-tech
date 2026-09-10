export interface AuthSessionRepository {
  clearToken(): Promise<void>;
}
