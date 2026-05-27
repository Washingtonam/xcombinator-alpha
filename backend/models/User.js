const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const WalletSchema = new mongoose.Schema(
  {
    balance: { type: Number, default: 0 },
    currency: { type: String, default: 'NGN' },
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    wallet: { type: WalletSchema, default: () => ({}) },
    roles: { type: [String], default: ['user'] },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', UserSchema);
