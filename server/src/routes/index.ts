import { Router } from 'express';

import { recoveryRouter } from './recovery.routes';
import { usernameRouter } from './username.routes';
import { walletRouter } from './wallet.routes';

export const apiRouter = Router();

apiRouter.use(usernameRouter);
apiRouter.use(walletRouter);
apiRouter.use(recoveryRouter);
