import { createApp } from './app';
import { connectToDatabase } from './config/db';
import { env } from './config/env';

async function main(): Promise<void> {
  await connectToDatabase();

  const app = createApp();

  app.listen(env.port, () => {
    console.warn(`Guatapay server listening on port ${env.port}`);
  });
}

main().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});
