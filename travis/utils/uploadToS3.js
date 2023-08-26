const AWS = require('../utils/AWSConfig');

const s3 = new AWS.S3(); //s3에 파일 업로드

const uploadToS3 = async (uploadRoute, file, isImage) => {
  let bufferFile = file;
  if (!isImage) {
    bufferFile = Buffer.from(file); //image가 아니라면 buffer 타입으로 변경
  }
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
    return err;
  }
};

module.exports = uploadToS3;
