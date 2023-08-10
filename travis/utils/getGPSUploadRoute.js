module.exports = async (req, res, next) => {
  const { email, date } = await req.body;
  const dateObj = new Date(date);
  const timestamp = dateObj.getTime();
  // S3 업로드 경로
  const uploadRoute = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${email}/${timestamp}`, // user1/2023080213440503
  };

  return uploadRoute;
};
