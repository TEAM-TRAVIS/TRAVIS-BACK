const catchAsync = require('../utils/catchAsync');
const uploadToS3 = require('../utils/uploadToS3');
const getFileFromS3 = require('../utils/getFileFromS3');

// 프로필 이미지 저장
exports.saveImage = catchAsync(async (req, res, next) => {
  const S3UrlKey = req.file.s3SaveUrl; // 필드에서 email/date_SS 또는 email/profile 을 받아와야 함.
  console.log('imgController.js의 S3 URL은? ', S3UrlKey);
  const image = req.file.buffer; // 이미지 데이터 추출

  // S3 업로드 경로
  const uploadRoute = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: S3UrlKey, // user1@gmail.com/profile
  };
  //S3에 file 업로드
  const uploadToS3Result = await uploadToS3(uploadRoute, image, true); //업로드 후 업로드 경로를 변수에 저장.

  // S3 업로드 중 에러 발생 처리
  if (uploadToS3Result instanceof Error) {
    return res
      .status(500)
      .json({ error: 'S3에 이미지 저장 중 error 발생', ' error내용': uploadToS3Result });
  }

  //성공 response
  return res.status(201).json({
    message: 'profile이 s3에 성공적으로 저장됐습니다',
    url: uploadRoute.Key,
  });
});

// 프로필 이미지 조회
exports.getImage = catchAsync(async (req, res, next) => {
  const { email } = req.body; //url에 포함된 정보 추츨
  const uploadRoute = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${email}/profile`, // user1@mgmail.com/profile
  };
  const getFileFromS3Result = await getFileFromS3(uploadRoute, true); //해당 S3 ROUTE로 파일 다시 GET.
  // S3 파일 조회 중 에러 발생 처리
  if (getFileFromS3Result instanceof Error) {
    return res
      .status(500)
      .json({ error: 'S3에서 이미지 조회 중 error 발생', ' error내용': getFileFromS3Result });
  }
  //성공 response
  return res.status(201).json({
    message: '프로필 사진 GET 성공.',
    image: getFileFromS3Result,
  });
});
