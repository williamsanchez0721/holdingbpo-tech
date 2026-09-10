import { Router } from 'express';

import { requireAuth } from '../middlewares/requireAuth';
import {
  getMyUsername,
  getUsernameAvailability,
  postReserveUsername,
} from '../controllers/username.controller';

export const usernameRouter = Router();

usernameRouter.get('/username/:username/availability', getUsernameAvailability);
usernameRouter.post('/username', requireAuth, postReserveUsername);
usernameRouter.get('/me/username', requireAuth, getMyUsername);
