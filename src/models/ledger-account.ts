import mongoose from 'mongoose';

export interface ILedgerAccount {
  externalId: string;
  name: string;
  customerId: string;
  createdAt: Date;
  updatedAt: Date;
}

const ledgerAccountSchema = new mongoose.Schema<ILedgerAccount>(
  {
    externalId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    customerId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound indices for common queries
ledgerAccountSchema.index({ customerId: 1, createdAt: -1 });
ledgerAccountSchema.index({ customerId: 1, externalId: 1 }, { unique: true });

export const LedgerAccount = mongoose.models.LedgerAccount || mongoose.model<ILedgerAccount>('LedgerAccount', ledgerAccountSchema); 