import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';

import { errorHandler } from './middlewares/errorHandler';
import { apiRouter } from './routes';

export function createApp(): Express {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api', apiRouter);

  app.use(errorHandler);

  return app;
}
