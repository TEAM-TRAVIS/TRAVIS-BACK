const mongoose = require('mongoose');

const GPSSchema = new mongoose.Schema({
  //userModel 참조
  email: {
    type: String,
    ref: 'UserModel',
    required: [true, 'User email is required'],
  },
  to_dist: { type: Number, required: [true, 'Total distance is required'] }, //해당 유저의 총 거리
  to_time: { type: Number, required: [true, 'Total time is required'] }, //해당 유저의 총 시간
  records: [
    {
      date: { type: Number, required: [true, 'Record date is required'] }, //측정일
      dist: { type: Number, required: [true, 'Distance is required'] }, //총 이동거리
      time: { type: Number, required: [true, 'Duration time is required'] }, //총 이동시간
      svRt: { type: String, required: [true, 'AWS S3 save route is required'] }, //S3에 저장된 경로
    },
  ],
});

const GPSModel = mongoose.model('GPS', GPSSchema);
module.exports = GPSModel;
