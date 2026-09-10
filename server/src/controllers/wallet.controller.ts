import { NextFunction, Response } from 'express';

import { AuthenticatedRequest } from '../middlewares/requireAuth';
import { signAuthToken } from '../utils/jwt';
import {
  createWalletForNewUser,
  getRecentTransactions,
  getWalletBalance,
} from '../services/wallet.service';

export async function getBalance(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const balance = await getWalletBalance(req.userId!);
    res.json(balance);
  } catch (error) {
    next(error);
  }
}

export async function getTransactions(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const transactions = await getRecentTransactions(req.userId!);
    res.json(transactions);
  } catch (error) {
    next(error);
  }
}

export async function postCreateWallet(
  _req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { userId, walletId } = await createWalletForNewUser();
    const token = signAuthToken({ userId });
    res.status(201).json({ token, walletId });
  } catch (error) {
    next(error);
  }
}
