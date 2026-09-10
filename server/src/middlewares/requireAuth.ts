import { NextFunction, Request, Response } from 'express';

import { verifyAuthToken } from '../utils/jwt';

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice('Bearer '.length) : undefined;

  if (!token) {
    res.status(401).json({ message: 'Falta el token de autenticación.' });
    return;
  }

  try {
    const payload = verifyAuthToken(token);
    req.userId = payload.userId;
    next();
  } catch {
    res.status(401).json({ message: 'Token inválido o expirado.' });
  }
}
