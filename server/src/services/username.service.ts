import { HttpError } from '../middlewares/errorHandler';
import { UserModel } from '../models/User';

const USERNAME_MIN_LENGTH = 5;
const USERNAME_MAX_LENGTH = 20;
const ALLOWED_CHARACTERS_PATTERN = /^[a-z0-9_]+$/;

export function isValidUsernameFormat(username: string): boolean {
  return (
    username.length >= USERNAME_MIN_LENGTH &&
    username.length <= USERNAME_MAX_LENGTH &&
    ALLOWED_CHARACTERS_PATTERN.test(username)
  );
}

export async function checkUsernameAvailability(username: string): Promise<boolean> {
  if (!isValidUsernameFormat(username)) {
    return false;
  }

  const existing = await UserModel.findOne({ username }).lean();
  return existing === null;
}

export async function reserveUsername(userId: string, username: string): Promise<void> {
  if (!isValidUsernameFormat(username)) {
    throw new HttpError(400, 'El nombre de usuario no cumple el formato requerido.');
  }

  const existing = await UserModel.findOne({ username }).lean();

  // Reservar el propio username ya asignado es un no-op válido (ej. la app lo vuelve a
  // "reservar" localmente tras recuperar una billetera cuyo username ya viene del backend).
  const belongsToAnotherUser = existing !== null && existing._id.toString() !== userId;

  if (belongsToAnotherUser) {
    throw new HttpError(409, 'El usuario ingresado no está disponible.');
  }

  const updated = await UserModel.findByIdAndUpdate(userId, { username });

  if (!updated) {
    throw new HttpError(404, 'Usuario no encontrado.');
  }
}

export async function getReservedUsername(userId: string): Promise<string | null> {
  const user = await UserModel.findById(userId).lean();
  return user?.username ?? null;
}
