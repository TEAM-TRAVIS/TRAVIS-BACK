const AWS = require('../utils/AWSConfig');

const s3 = new AWS.S3();

// S3에 업로드된 파일 조회
const getFileFromS3 = async (uploadRoute, isImage) => {
  try {
    const getObjectData = await s3.getObject(uploadRoute).promise();
    let file = getObjectData.Body;
    if (!isImage) {
      file = file.toString('utf-8'); //인코딩
    }
    return file;
  } catch (error) {
    return error;
  }
};

module.exports = getFileFromS3;
