const AWS = require('aws-sdk');
const GPSModel = require('../models/GPSModel');

AWS.config.update({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  region: process.env.AWS_S3_REGION,
});

const s3 = new AWS.S3();

// S3에서 GPS 데이터 가져오기
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
    throw new Error('It failed to search GPS data');
  }
};

// 필터링된 GPS 데이터 합쳐서 클라이언트로 보냄
exports.sendUserGpsSummary = async (req, res) => {
  try {
    const { email } = req.body;
    const { days } = req.query;
    const currentDate = new Date();
    if (days) currentDate.setDate(currentDate.getDate() - days);
    const startDate = currentDate.toISOString();
    const endDate = new Date().toISOString();

    // MongoDB에서 필터링된 GPS 데이터를 조회

    const gpsDataResults = await GPSModel.find({
      email: email,
      'records.date': days == null ? { $lte: endDate } : { $gte: startDate, $lte: endDate },
    }).select('records.svRt');

    // S3에서 GPS 데이터를 가져옴
    const gpsDataPromises = gpsDataResults
      .flatMap((innerArray) => innerArray.records.map(({ svRt }) => svRt))
      .map((fileKey) => getGPSDataFromS3(fileKey));

    // S3에서 가져온 GPS 데이터를 합쳐서 클라이언트에 보냄
    const combinedData = await Promise.all(gpsDataPromises);
    res.status(200).json({
      message: 'Successful in searching GPS data',
      gpsData: combinedData,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
