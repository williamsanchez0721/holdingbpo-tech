const SIMULATED_NETWORK_DELAY_MS = 500;

// Simula el backend de recuperación: una única cuenta de backup conocida,
// hasta que exista un endpoint real que verificar contra el servidor.
const VALID_EMAIL_BACKUP = {
  email: 'luismauriciocano@gmail.com',
  password: 'Guatapay123!',
};

const VALID_SEED_PHRASE =
  'yellow monday mug magazine scholar zone superheroes eleven wonderlust shoes precious spectrum';

const RECOVERED_USERNAME = 'luismauricio297';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeSeedPhrase(seedPhrase: string): string {
  return seedPhrase.trim().split(/\s+/).join(' ').toLowerCase();
}

export const walletRecoveryLocalDataSource = {
  async verifyEmail(email: string, password: string): Promise<string | null> {
    await delay(SIMULATED_NETWORK_DELAY_MS);
    const matches =
      email.toLowerCase() === VALID_EMAIL_BACKUP.email && password === VALID_EMAIL_BACKUP.password;
    return matches ? RECOVERED_USERNAME : null;
  },
  async verifySeedPhrase(seedPhrase: string): Promise<string | null> {
    await delay(SIMULATED_NETWORK_DELAY_MS);
    const matches = normalizeSeedPhrase(seedPhrase) === VALID_SEED_PHRASE;
    return matches ? RECOVERED_USERNAME : null;
  },
};
