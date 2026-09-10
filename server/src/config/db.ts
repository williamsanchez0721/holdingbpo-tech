import mongoose from 'mongoose';

import { env } from './env';

// mongodb-memory-server es solo una devDependency: se importa dinámicamente y únicamente
// cuando no hay MONGODB_URI (dev/demo), para que un despliegue real (que sí define la
// variable) nunca necesite tenerla instalada.
let memoryServer: import('mongodb-memory-server').MongoMemoryServer | undefined;

async function resolveMongoUri(): Promise<string> {
  if (env.mongodbUri) {
    return env.mongodbUri;
  }

  console.warn(
    'MONGODB_URI no configurado: levantando una MongoDB en memoria solo para desarrollo. ' +
      'Los datos se pierden al reiniciar el servidor.',
  );
  const { MongoMemoryServer } = await import('mongodb-memory-server');
  memoryServer = await MongoMemoryServer.create();
  return memoryServer.getUri();
}

export async function connectToDatabase(): Promise<void> {
  const uri = await resolveMongoUri();
  await mongoose.connect(uri);
}

export async function disconnectFromDatabase(): Promise<void> {
  await mongoose.disconnect();
  await memoryServer?.stop();
}
