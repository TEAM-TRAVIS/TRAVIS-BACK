const AWS = require('aws-sdk'); //AWS
const dotenv = require('dotenv'); //.env 파일 읽는 라이브러리

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

exports.getUserGpS = async (req, res) => {
  try {
    const { name, date } = await req.params;
    console.log(name, date);
    // S3 업로드 경로
    const uploadRoute = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `${name}/${date}`, // user1/2023080213440503
    };
    const gzipFile = await getFileFromS3(uploadRoute); //해당 S3 ROUTE로 파일 다시 GET.
    //response
    return res.status(201).json({
      message: '해당 날짜의 GPS gzip 파일 GET 성공.',
      gzipFile: gzipFile,
    });
  } catch (error) {
    res.status(500).json({ error: '해당 날짜의 GPS gzip GET 실패', ' error내용': error });
  }
};
