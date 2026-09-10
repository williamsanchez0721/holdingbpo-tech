import { Schema, model, type InferSchemaType } from 'mongoose';

const transactionSchema = new Schema(
  {
    walletId: { type: Schema.Types.ObjectId, ref: 'Wallet', required: true, index: true },
    type: { type: String, enum: ['sent', 'received', 'exchanged'], required: true },
    status: { type: String, enum: ['completed', 'failed'], required: true },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    amountLabel: { type: String, required: true },
    date: { type: Date, required: true },
  },
  { timestamps: true },
);

export type TransactionDocument = InferSchemaType<typeof transactionSchema>;

export const TransactionModel = model('Transaction', transactionSchema);
