import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

import { signAuthToken } from '../utils/jwt';
import { recoverWithEmail, recoverWithSeedPhrase } from '../services/recovery.service';

const recoverWithEmailSchema = z.object({ email: z.string(), password: z.string() });
const recoverWithSeedPhraseSchema = z.object({ seedPhrase: z.string() });

export async function postRecoverWithEmail(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { email, password } = recoverWithEmailSchema.parse(req.body);
    const { userId, username } = await recoverWithEmail(email, password);
    res.json({ token: signAuthToken({ userId }), username });
  } catch (error) {
    next(error);
  }
}

export async function postRecoverWithSeedPhrase(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { seedPhrase } = recoverWithSeedPhraseSchema.parse(req.body);
    const { userId, username } = await recoverWithSeedPhrase(seedPhrase);
    res.json({ token: signAuthToken({ userId }), username });
  } catch (error) {
    next(error);
  }
}
