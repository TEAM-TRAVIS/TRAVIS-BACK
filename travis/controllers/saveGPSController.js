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

//s3에 파일 업로드
const uploadToS3 = async (uploadRoute, file) => {
  //buffer 타입으로 변경
  const bufferFile = Buffer.from(file);

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

//몽고DB 업로드
const saveToMongo = async (email, date, dist, time, title, content, svRt) => {
  try {
    let GPSDB = await GPSModel.findOne({ email });
    const distNumber = Number(dist);
    const timeNumber = Number(time);

    // 해당 id로 이전에 생성된 GPS 문서가 없는 경우
    if (!GPSDB) {
      GPSDB = new GPSModel({ email, to_dist: distNumber, to_time: timeNumber, records: [] });
    } else {
      // 총 거리, 총 시간 갱신
      GPSDB.to_dist += distNumber;
      GPSDB.to_time += timeNumber;
    }

    GPSDB.records.push({
      date,
      dist: distNumber,
      time: timeNumber,
      title,
      content,
      svRt,
    }); // 새 레코드 push

    await GPSDB.save(); // 저장
    console.log('GPS 데이터 업로드 성공!');
  } catch (error) {
    console.error('GPS 데이터 업로드 중 에러 발생:', error);
  }
};

exports.saveGPS = async (req, res) => {
  try {
    const { email, dist, time, title, content, file } = req.body;
    const date = Date.now();

    // S3 업로드 경로
    const uploadRoute = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `${email}/${date}`, // seung@eon.kim/2023080213440503
    };

    //S3에 file 업로드
    const uploadedURL = await uploadToS3(uploadRoute, file); //업로드 후 업로드 경로를 변수에 저장.

    //몽고DB 업로드
    saveToMongo(email, date, dist, time, title, content, uploadRoute.Key);

    //response
    return res.status(201).json({
      message: 'GPSController.js의 saveGPS()의 response 입니다.',
      reqHeader: req.headers,
      reqBody: req.body,
      uploadedURL: uploadedURL,
    });
  } catch (error) {
    res.status(500).json({ error: 'GPSController.js saveGPS의 error 발생', ' error내용': error });
  }
};

//성공시 response의 uploadedURL로 들어가면 request에 해당하는 내용의 파일이 다운되어야함.
