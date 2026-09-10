import 'dotenv/config';

const DEV_JWT_SECRET_FALLBACK = 'dev-secret-change-me';

function resolveJwtSecret(): string {
  if (process.env.JWT_SECRET) {
    return process.env.JWT_SECRET;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('Falta la variable de entorno JWT_SECRET');
  }

  console.warn('JWT_SECRET no configurado: usando un valor por defecto solo para desarrollo.');
  return DEV_JWT_SECRET_FALLBACK;
}

export const env = {
  port: Number(process.env.PORT ?? 3000),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  // Si no se define, se levanta una MongoDB en memoria (ver config/db.ts) — solo para desarrollo.
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: resolveJwtSecret(),
};
