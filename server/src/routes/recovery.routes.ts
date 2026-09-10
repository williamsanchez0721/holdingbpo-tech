import { Router } from 'express';

import {
  postRecoverWithEmail,
  postRecoverWithSeedPhrase,
} from '../controllers/recovery.controller';
import { recoveryRateLimiter } from '../middlewares/rateLimiters';

export const recoveryRouter = Router();

recoveryRouter.post('/auth/recover/email', recoveryRateLimiter, postRecoverWithEmail);
recoveryRouter.post('/auth/recover/seed-phrase', recoveryRateLimiter, postRecoverWithSeedPhrase);
