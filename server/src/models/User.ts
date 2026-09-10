import { Schema, model, type InferSchemaType } from 'mongoose';

const userSchema = new Schema(
  {
    username: { type: String, unique: true, sparse: true, minlength: 5, maxlength: 20 },
    email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    passwordHash: { type: String, select: false },
    seedPhraseHash: { type: String, select: false },
    walletId: { type: Schema.Types.ObjectId, ref: 'Wallet', required: true },
  },
  { timestamps: true },
);

export type UserDocument = InferSchemaType<typeof userSchema>;

export const UserModel = model('User', userSchema);
