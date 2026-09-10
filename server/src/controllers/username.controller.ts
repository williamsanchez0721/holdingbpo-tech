import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

import { AuthenticatedRequest } from '../middlewares/requireAuth';
import {
  checkUsernameAvailability,
  getReservedUsername,
  reserveUsername,
} from '../services/username.service';

const reserveUsernameSchema = z.object({ username: z.string() });

export async function getUsernameAvailability(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const available = await checkUsernameAvailability(req.params.username);
    res.json({ available });
  } catch (error) {
    next(error);
  }
}

export async function postReserveUsername(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { username } = reserveUsernameSchema.parse(req.body);
    await reserveUsername(req.userId!, username);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function getMyUsername(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const username = await getReservedUsername(req.userId!);
    res.json({ username });
  } catch (error) {
    next(error);
  }
}
