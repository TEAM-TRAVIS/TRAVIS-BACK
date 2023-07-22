const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const GPSModel = require('./GPSModel'); // Import the GPS Model

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'] },
  email: { type: String, required: [true, 'Email is required'], unique: true },
  password: { type: String, required: [true, 'Password is required'] },
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
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
