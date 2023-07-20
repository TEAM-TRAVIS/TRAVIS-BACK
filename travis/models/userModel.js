const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, 'A tour must have a id'],
    unique: true,
  },
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    default: 4.5,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
