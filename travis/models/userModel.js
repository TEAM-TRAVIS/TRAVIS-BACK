const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const GPSModel = require('./GPSModel'); // Import the GPS Model

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  records: [
    {
      record_id: { type: Number, required: true },
      date: { type: Date, required: true },
      text: { type: String, required: true },
      duration: { type: Number, required: true },
      distance: { type: Number, required: true },
      GPS: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GPS' }], // Reference to GPSModel
    },
  ],
});

userSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
