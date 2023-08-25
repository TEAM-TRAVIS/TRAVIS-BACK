const catchAsync = require('../utils/catchAsync');
const uploadToS3 = require('../utils/uploadToS3');
const getFileFromS3 = require('../utils/getFileFromS3');

exports.save = async (req, res) => {
  try {
    const { email } = req.body;
    const image = req.file.buffer; // 이미지 데이터 추출

    // S3 업로드 경로
    const uploadRoute = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `${email}/profile`, // user1@gmail.com/profile
    };

    //S3에 file 업로드
    await uploadToS3(uploadRoute, image, true); //업로드 후 업로드 경로를 변수에 저장.

    console.log('이미지 S3에 업로드 성공!');

    //response
    return res.status(201).json({
      message: 'profile이 s3에 성공적으로 저장됐습니다',
      image: image,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'imgController.js의 save()에서 오류가 발생했습니다.', ' error내용': error });
  }
};

exports.getImage = catchAsync(async (req, res, next) => {
  const { email } = req.body; //url에 포함된 정보 추츨
  const uploadRoute = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${email}/profile`, // user1@mgmail.com/profile
  };
  const gzipFile = await getFileFromS3(uploadRoute, true); //해당 S3 ROUTE로 파일 다시 GET.
  //response
  return res.status(201).json({
    message: '프로필 사진 get 성공.',
    image: gzipFile,
  });
});
