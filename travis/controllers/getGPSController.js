const AWS = require('aws-sdk'); //AWS
const dotenv = require('dotenv'); //.env 파일 읽는 라이브러리
const catchAsync = require('../utils/catchAsync');
const GPSModel = require('../models/GPSModel');

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
  const { email, date } = await req.body;
  const dateObj = new Date(date);
  const timestamp = dateObj.getTime();
  console.log(email, timestamp);
  // S3 업로드 경로
  const uploadRoute = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${email}/${timestamp}`, // user1/2023080213440503
  };
  const gzipFile = await getFileFromS3(uploadRoute); //해당 S3 ROUTE로 파일 다시 GET.
  //response
  return res.status(201).json({
    message: '해당 날짜의 GPS gzip 파일 GET 성공.',
    gzipFile: gzipFile,
  });
});

exports.getDailyGPS = catchAsync(async (req, res, next) => {
  const { email } = await req.body;
  const year = req.params.year * 1;
  const month = req.params.month * 1;
  const day = req.params.day * 1;

  const gps = await GPSModel.aggregate([
    {
      $match: {
        date: {
          $gte: new Date(`${year}-${month}-${day}T00:00:00Z`),
          $lt: new Date(`${year}-${month}-${day + 1}T00:00:00Z`),
        },
      },
    },
  ]);

  // const uploadRoute = {
  //   Bucket: process.env.AWS_S3_BUCKET_NAME,
  //   Key: `${email}/${gps.svRT}`, // user1/2023080213440503
  // };

  res.status(200).json({
    status: 'success',
    data: {
      gps,
    },
  });
});

// exports.getWeeklyGPS = catchAsync(async (req, res, next) => {
//   const year = req.params.year * 1; // Convert the year to a number (e.g., 2021)
//   const week = req.params.week * 1; // Convert the week number to a number (e.g., 30)
//
//   // Calculate the start and end dates of the week
//   const startDate = new Date(year, 0, (week - 1) * 7);
//   const endDate = new Date(year, 0, week * 7);
//
//   const plan = await Tour.aggregate([
//     {
//       $match: {
//         startDates: {
//           $gte: startDate,
//           $lt: endDate,
//         },
//       },
//     },
//     // Other aggregation stages or projection if needed
//   ]);
//
//   res.status(200).json({
//     status: 'success',
//     data: {
//       plan,
//     },
//   });
// });
//
// exports.getMonthlyGPS = catchAsync(async (req, res, next) => {
//   const year = req.params.year * 1; // Convert the year to a number (e.g., 2021)
//   const month = req.params.month * 1; // Convert the month to a number (e.g., 7)
//
//   const plan = await Tour.aggregate([
//     {
//       $match: {
//         startDates: {
//           $gte: new Date(`${year}-${month}-01T00:00:00Z`),
//           $lt: new Date(`${year}-${month + 1}-01T00:00:00Z`),
//         },
//       },
//     },
//     // Other aggregation stages or projection if needed
//   ]);
//
//   res.status(200).json({
//     status: 'success',
//     data: {
//       plan,
//     },
//   });
// });
//
// exports.getYearlyGPS = catchAsync(async (req, res, next) => {
//   const year = req.params.year * 1; // Convert the year to a number (e.g., 2021)
//
//   const plan = await Tour.aggregate([
//     {
//       $match: {
//         startDates: {
//           $gte: new Date(`${year}-01-01T00:00:00Z`),
//           $lt: new Date(`${year + 1}-01-01T00:00:00Z`),
//         },
//       },
//     },
//     // Other aggregation stages or projection if needed
//   ]);
//
//   res.status(200).json({
//     status: 'success',
//     data: {
//       plan,
//     },
//   });
// });
