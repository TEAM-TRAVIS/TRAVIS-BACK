const AWS = require('../utils/AWSConfig');
const catchAsync = require('../utils/catchAsync');
const getGPSUploadRoute = require('../utils/getGPSUploadRoute');
const getFileFromS3 = require('../utils/getFileFromS3');

const s3 = new AWS.S3();

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
