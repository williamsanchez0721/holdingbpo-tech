import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import { UserModel } from '../models/User';
import { WalletModel } from '../models/Wallet';

import { checkUsernameAvailability, reserveUsername } from './username.service';

let memoryServer: MongoMemoryServer;

beforeAll(async () => {
  memoryServer = await MongoMemoryServer.create();
  await mongoose.connect(memoryServer.getUri());
});

afterEach(async () => {
  await UserModel.deleteMany({});
  await WalletModel.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await memoryServer.stop();
});

async function createUser(username?: string): Promise<string> {
  const wallet = await WalletModel.create({});
  const user = await UserModel.create({ walletId: wallet._id, username });
  return user._id.toString();
}

describe('reserveUsername', () => {
  it('asigna un username disponible al usuario', async () => {
    const userId = await createUser();

    await reserveUsername(userId, 'luismauricio297');

    expect(await checkUsernameAvailability('luismauricio297')).toBe(false);
  });

  it('rechaza un username ya tomado por otro usuario', async () => {
    await createUser('luismauricio297');
    const otherUserId = await createUser();

    await expect(reserveUsername(otherUserId, 'luismauricio297')).rejects.toMatchObject({
      status: 409,
    });
  });

  it('permite volver a reservar el propio username ya asignado (idempotente)', async () => {
    const userId = await createUser('luismauricio297');

    await expect(reserveUsername(userId, 'luismauricio297')).resolves.toBeUndefined();
  });
});
