const mongoose = require('mongoose');

const GPSSchema = new mongoose.Schema({
  //userModel 참조
  email: {
    type: String,
    ref: 'UserModel',
    required: [true, 'User email is required'],
  },
  to_dist: {
    type: Number,
    get: (value) => Number(value.toFixed(1)),
    set: (value) => Number(value.toFixed(1)),
    required: [true, 'Total distance is required'],
  }, //해당 유저의 총 거리
  to_time: { type: Number, required: [true, 'Total time is required'] }, //해당 유저의 총 시간
  records: [
    {
      date: { type: Date, default: Date.now(), required: [true, 'Record date is required'] }, //측정일
      dist: {
        type: Number,
        get: (value) => Number(value).toFixed(1),

        set: (value) => Number(value).toFixed(1),
        required: [true, 'Distance is required'],
      }, //총 이동거리
      time: { type: Number, required: [true, 'Duration time is required'] }, //총 이동시간
      title: String,
      content: String,
      city1: String,
      city2: String,
      city3: String,
      isPublic: { type: Boolean, default: false }, //공개 여부
      svRt: { type: String, required: [true, 'AWS S3 save route is required'] }, //S3에 저장된 경로
      splitnum: { type: String, required: [true, 'GPS split number is required'] }, //GPS 파일 split 횟수: 너무커서 (0~500은 1/ 500~1000은 2) else 0
    },
  ],
});

const GPSModel = mongoose.model('GPS', GPSSchema);
module.exports = GPSModel;
