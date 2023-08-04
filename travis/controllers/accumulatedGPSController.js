const AWS = require('aws-sdk');
const GPSModel = require('../models/GPSModel');

AWS.config.update({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  region: process.env.AWS_S3_REGION,
});

const s3 = new AWS.S3();

// S3에서 GPS 데이터를 가져오는 함수
const getGPSDataFromS3 = async (fileKey) => {
  try {
    const getObjectData = await s3
      .getObject({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: fileKey,
      })
      .promise();
    const gpsData = getObjectData.Body.toString('utf-8');
    return gpsData;
  } catch (error) {
    throw new Error('GPS 데이터 조회에 실패했습니다.');
  }
};

// 필터링된 GPS 데이터를 클라이언트에 보내는 함수
exports.sendUserGpsSummary = async (req, res) => {
  try {
    const { email } = req.params;
    const { days } = req.query;
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - days);
    const startDate = currentDate.toISOString();
    const endDate = new Date().toISOString();

    // MongoDB에서 필터링된 GPS 데이터를 조회
    const gpsDataResults = await GPSModel.find({
      email: email,
      'records.date': { $gte: startDate, $lte: endDate },
    }).select('records.file');

    // S3에서 GPS 데이터를 가져옵니다
    const gpsDataPromises = gpsDataResults.map(({ records }) => {
      const fileKey = records.file;
      return getGPSDataFromS3(fileKey);
    });

    // S3에서 가져온 GPS 데이터를 합쳐서 클라이언트에 보냅니다
    const combinedData = await Promise.all(gpsDataPromises);

    res.status(200).json({ message: 'GPS 데이터 조회 성공', gpsData: combinedData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
