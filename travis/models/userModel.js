const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'] },
  email: { type: String, required: [true, 'Email is required'], unique: true },
  password: { type: String, required: false },
  joinDate: { type: Date, required: true },
  emailVerificationToken: { type: String },
  isEmailVerified: { type: Boolean, default: false },
  records: [
    {
      record_id: { type: Number, required: false, unique: true, sparse: true },
      date: { type: Date, required: false },
      text: { type: String, required: false },
      duration: { type: Number, required: false },
      distance: { type: Number, required: false },
      GPS: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GPSModel' }], // Reference to GPSModel
    },
  ],
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

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
