const GPSModel = require('../models/GPSModel');

//AWS S3에서 특정 날짜의 gzip 파일 GET
exports.getUserSummary = async (req, res) => {
  try {
    const { name } = req.params; //url에 포함된 정보 추츨

    // Find the GPS data for the specific user
    const userGPS = await GPSModel.findOne({ name });

    if (!userGPS) {
      return res.status(404).json({ message: '해당 유저로 저장된 GPS 데이터가 없습니다.' });
    }

    // 유저의 모든 GPS summary 데이터 추출
    const userData = userGPS.records.map(({ date, dist, time }) => ({ date, dist, time }));

    // to_dist, to_time 데이터도 포함하여 응답으로 보냄
    const responsePayload = {
      to_dist: userGPS.to_dist,
      to_time: userGPS.to_time,
      userData: userData,
    };

    return res.status(200).json(responsePayload);
  } catch (error) {
    res
      .status(500)
      .json({ error: '유저의 GPS summary 데이터 가져오기 실패.', 'error 내용': error });
  }
};
