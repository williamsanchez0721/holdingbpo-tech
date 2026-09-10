import bcrypt from 'bcrypt';

import { HttpError } from '../middlewares/errorHandler';
import { UserModel } from '../models/User';
import { WalletModel } from '../models/Wallet';
import { hasValidSeedPhraseWordCount, normalizeSeedPhrase } from '../utils/normalizeSeedPhrase';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INVALID_CREDENTIALS_MESSAGE = 'Las credenciales ingresadas no son válidas.';

export interface RecoveredAccount {
  userId: string;
  username: string | null;
}

async function markWalletAsRecovered(walletId: string): Promise<void> {
  await WalletModel.findByIdAndUpdate(walletId, { isRecovered: true });
}

export async function recoverWithEmail(email: string, password: string): Promise<RecoveredAccount> {
  if (!EMAIL_PATTERN.test(email) || password.length === 0) {
    throw new HttpError(400, INVALID_CREDENTIALS_MESSAGE);
  }

  const user = await UserModel.findOne({ email: email.toLowerCase() }).select('+passwordHash');

  if (!user?.passwordHash || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new HttpError(401, INVALID_CREDENTIALS_MESSAGE);
  }

  await markWalletAsRecovered(user.walletId.toString());

  return { userId: user._id.toString(), username: user.username ?? null };
}

export async function recoverWithSeedPhrase(seedPhrase: string): Promise<RecoveredAccount> {
  if (!hasValidSeedPhraseWordCount(seedPhrase)) {
    throw new HttpError(400, INVALID_CREDENTIALS_MESSAGE);
  }

  const normalized = normalizeSeedPhrase(seedPhrase);
  // bcrypt salts each hash differently, so it can't be matched at the query level;
  // this scans every stored seed phrase hash, which is fine at MVP scale but should
  // move to a deterministic lookup (e.g. HMAC-SHA256 with a server-side pepper) later.
  const candidates = await UserModel.find({ seedPhraseHash: { $exists: true } }).select(
    '+seedPhraseHash',
  );

  for (const candidate of candidates) {
    if (candidate.seedPhraseHash && (await bcrypt.compare(normalized, candidate.seedPhraseHash))) {
      await markWalletAsRecovered(candidate.walletId.toString());
      return { userId: candidate._id.toString(), username: candidate.username ?? null };
    }
  }

  throw new HttpError(401, INVALID_CREDENTIALS_MESSAGE);
}
