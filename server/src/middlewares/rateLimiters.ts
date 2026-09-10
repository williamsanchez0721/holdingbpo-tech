import rateLimit from 'express-rate-limit';

const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;
const MAX_RECOVERY_ATTEMPTS = 5;

export const recoveryRateLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES_MS,
  max: MAX_RECOVERY_ATTEMPTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Demasiados intentos. Intenta de nuevo más tarde.' },
});
