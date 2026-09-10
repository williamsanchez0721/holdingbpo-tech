import { Router } from 'express';

import { requireAuth } from '../middlewares/requireAuth';
import { getBalance, getTransactions, postCreateWallet } from '../controllers/wallet.controller';

export const walletRouter = Router();

walletRouter.post('/wallets', postCreateWallet);
walletRouter.get('/wallet/balance', requireAuth, getBalance);
walletRouter.get('/wallet/transactions', requireAuth, getTransactions);
