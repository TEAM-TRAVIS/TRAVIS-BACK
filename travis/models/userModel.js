const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'] },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validator: [validator.isEmail, 'Please provide a valid email'],
  },
  password: { type: String, required: false, minlength: 8, select: false },
  joinDate: { type: Date, required: true },
  emailVerificationToken: { type: String },
  isEmailVerified: { type: Boolean, default: false },
});

// 비밀번호 암호화
userSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) {
      // 비밀번호가 변경되지 않은 경우
      return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
