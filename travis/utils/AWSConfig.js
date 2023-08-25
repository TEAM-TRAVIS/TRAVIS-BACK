const AWS = require('aws-sdk');
const dotenv = require('dotenv');

dotenv.config();

AWS.config.update({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  region: process.env.AWS_S3_REGION,
});

module.exports = AWS;
