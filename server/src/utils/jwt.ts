import jwt from 'jsonwebtoken';

import { env } from '../config/env';

const TOKEN_EXPIRATION = '30d';

export interface AuthTokenPayload {
  userId: string;
}

export function signAuthToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: TOKEN_EXPIRATION });
}

export function verifyAuthToken(token: string): AuthTokenPayload {
  return jwt.verify(token, env.jwtSecret) as AuthTokenPayload;
}
