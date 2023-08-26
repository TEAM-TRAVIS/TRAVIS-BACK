const uploadToS3 = require('../utils/uploadToS3');
const GPSModel = require('../models/GPSModel');
require("aws-sdk/lib/maintenance_mode_message").suppress = true;

//몽고DB 업로드
const saveToMongo = async (record) => {
  try {
    let GPSDB = await GPSModel.findOne({ email: record.email });
    const distNumber = Number(record.dist);
    const timeNumber = Number(record.time);

    // 해당 id로 이전에 생성된 GPS 문서가 없는 경우
    if (!GPSDB) {
      GPSDB = new GPSModel({
        email: record.email,
        to_dist: distNumber,
        to_time: timeNumber,
        records: [],
      });
    } else {
      // 총 거리, 총 시간 갱신
      GPSDB.to_dist += distNumber;
      GPSDB.to_time += timeNumber;
    }

    GPSDB.records.push(record); // 새 레코드 push

    await GPSDB.save(); // 저장
    console.log('GPS 데이터 업로드 성공!');
  } catch (error) {
    console.error('GPS 데이터 업로드 중 에러 발생:', error);
  }
};

exports.saveGPS = async (req, res) => {
  try {
    // const { email, dist, time, title, content, isPublic, city1, city2, city3, file } = req.body;
    const record = req.body;
    record.date = Date.now();

    // S3 업로드 경로
    const uploadRoute = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `${record.email}/${record.date}`, // seung@eon.kim/2023080213440503
    };

    //S3에 file 업로드
    const uploadedURL = await uploadToS3(uploadRoute, record.file, false); //업로드 후 업로드 경로를 변수에 저장.
    record.svRt = uploadRoute.Key;

    //몽고DB 업로드
    saveToMongo(record);

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
