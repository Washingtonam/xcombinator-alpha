const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    balance: { type: Number, default: 0 },
    role: { type: String, default: 'user' }
}, { timestamps: true });

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