import { Schema, model, type InferSchemaType } from 'mongoose';

const walletSchema = new Schema(
  {
    amount: { type: Number, required: true, default: 0 },
    currency: { type: String, required: true, default: 'USDT' },
    convertedAmount: { type: Number, required: true, default: 0 },
    convertedCurrency: { type: String, required: true, default: 'COP' },
    isRecovered: { type: Boolean, required: true, default: false },
  },
  { timestamps: true },
);

export type WalletDocument = InferSchemaType<typeof walletSchema>;

export const WalletModel = model('Wallet', walletSchema);
