const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    nin: { type: String, required: true },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    walletBalance: { type: Number, default: 0 }
});

// Use lowercase userSchema here
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Use lowercase userSchema here
userSchema.methods.comparePassword = async function (candidate) {
  return await bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);