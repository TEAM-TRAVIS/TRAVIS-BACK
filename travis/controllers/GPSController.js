const AWS = require('aws-sdk'); //AWS
const dotenv = require('dotenv'); //.env 파일 읽는 라이브러리
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


//json 타입을 Buffer 타입으로 변환하는 함수
const jsonToBuffer = async (jsonInput) => {
  const jsonString = JSON.stringify(jsonInput); // JSON 객체를 string로 변환
  const bufferFile = Buffer.from(jsonString); //string을 Buffer type으로 바꾸기
  return bufferFile;
};

//s3에 파일 업로드
const uploadToS3 = async (uploadRoute, file) => {
  //buffer 타입으로 변경
  const bufferFile = await jsonToBuffer(file);
  //담기
  const uploadParams = {
    Bucket: uploadRoute.Bucket,
    Key: uploadRoute.Key,
    Body: bufferFile,
  };
  try {
    const data = await s3.upload(uploadParams).promise();
    console.log('S3에 파일 업로드 성공!: ', data.Location);
    return data.Location; //저장된 경로 return
  } catch (err) {
    console.error('S3 업로드 중 에러 발생: ', err);
    return null;
  }
};

// S3에 업로드된 파일 조회
const getFileFromS3 = async (uploadRoute) => {
  const getObjectData = await s3.getObject(uploadRoute).promise();
  const file = getObjectData.Body.toString('utf-8'); //인코딩
  return file;
};

//몽고DB 업로드
const saveToMongo = async (email, date, dist, time, svRt) => {
  let GPSDB = await GPSModel.findOne({ id });

  // 해당 id로 이전에 생성된 GPS 문서가 없는 경우
  if (!GPSDB) {
    GPSDB = new GPSModel({ email: email, records: [] });
  }
  // 새로운 레코드 추가
  GPSDB.records.push({ date, dist, time, svRt });

  try {
    await GPSDB.save(); // 저장
    console.log('GPS 데이터 업로드 성공!');
  } catch (error) {
    console.error('GPS 데이터 업로드 중 에러 발생:', error);
  }
};

exports.saveGPS = async (req, res) => {
  try {
    const { email, date, dist, time, file } = req.body;

    // S3 업로드 경로
    const uploadRoute = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `${email}/${time}`, // user1/2023080213440503
    };

    //S3에 file 업로드
    const uploadedURL = await uploadToS3(uploadRoute, file); //업로드 후 업로드 경로를 변수에 저장.

    //몽고DB 업로드
    saveToMongo(email, date, dist, time, uploadRoute.Key);

    const uploadedFile = await getFileFromS3(uploadRoute); //해당 S3 ROUTE로 파일 다시 GET.

    //response
    return res.status(201).json({
      message: 'GPSController.js의 saveGPS()의 response 입니다.',
      reqHeader: req.headers,
      reqBody: req.body,
      uploadedURL: uploadedURL,
      uploadedFile: uploadedFile,
    });
  } catch (error) {
    res.status(500).json({ error: 'GPSController.js saveGPS의 error 발생', ' error내용': error });
  }
};

//성공시 response의 uploadedURL로 들어가면 request에 해당하는 내용의 파일이 다운되어야함.
