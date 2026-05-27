const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    balance: { type: Number, default: 0 },
    currency: { type: String, default: 'NGN' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Wallet', WalletSchema);
