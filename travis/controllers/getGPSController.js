const AWS = require('aws-sdk'); //AWS
const dotenv = require('dotenv'); //.env 파일 읽는 라이브러리
const catchAsync = require('../utils/catchAsync');
const GPSModel = require('../models/GPSModel');
const getGPSUploadRoute = require('../utils/getGPSUploadRoute');

//.env 파일 load
dotenv.config();

// AWS S3 설정
AWS.config.update({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  region: process.env.AWS_S3_REGION,
});

const s3 = new AWS.S3();

// S3에 업로드된 파일 조회
const getFileFromS3 = async (uploadRoute) => {
  const getObjectData = await s3.getObject(uploadRoute).promise();
  const file = getObjectData.Body.toString('utf-8'); //인코딩
  return file;
};

exports.getUserGPS = catchAsync(async (req, res, next) => {
  const { email, date } = req.body; //url에 포함된 정보 추츨
  const uploadRoute = await getGPSUploadRoute(email, date); //S3 업로드 경로
  const gzipFile = await getFileFromS3(uploadRoute); //해당 S3 ROUTE로 파일 다시 GET.
  //response
  return res.status(201).json({
    message: '해당 날짜의 GPS gzip 파일 GET 성공.',
    gzipFile: gzipFile,
  });
});

exports.deleteUserGPS = async (email, date, res) => {
  const uploadRoute = await getGPSUploadRoute(email, date); //S3 업로드 경로
  try {
    const deleteObjectData = await s3.deleteObject(uploadRoute).promise();
    return { success: true, deleteObjectData: deleteObjectData };
  } catch (err) {
    console.log('Error deleting GPS gzip file from S3: ', err);
    return { success: false, error: err.message };
  }
};
