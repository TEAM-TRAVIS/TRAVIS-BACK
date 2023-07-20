const mongoose = require('mongoose');

const gpsSchema = new mongoose.Schema({
  longitude: { type: Number, required: true },
  latitude: { type: Number, required: true },
  height: { type: Number, required: true },
  time: { type: Number, required: true },
});

const GPSModel = mongoose.model('GPS', gpsSchema);

module.exports = GPSModel;
