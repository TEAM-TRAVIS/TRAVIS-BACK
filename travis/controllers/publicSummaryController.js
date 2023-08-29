const GPSModel = require('../models/GPSModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const getFileFromS3 = require('../utils/getFileFromS3');

exports.getAllPublicSummary = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;

  const users = await GPSModel.find();

  if (!users) {
    return next(new AppError('There is no saved GPS data for that date.', 404));
  }

  let summaries = users.map((user) => {
    const { records } = user;
    //종민오빠 제외 코드 (나중에 20번 줄 제외하고 삭제해야함)
    if (user.email === 'hyeeun7904@gmail.com') {
      return records;
    }
    return null;
  });
  summaries = summaries.filter((element) => element != null); // 종민오빠 제외 (나중에 삭제해야함)

  summaries = summaries.flat();
  summaries = summaries.filter((summary) => summary.isPublic === true);

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const paginatedSummaries = summaries.slice(startIndex, endIndex);

  //paginatedSummaries 배열에서 S3에서 이미지 조회 후 배열에 저장 -> response로 리턴
  // 깊은 복사를 위해 JSON.stringify()와 JSON.parse() 사용
  const deepCopypaginatedSummaries = JSON.parse(JSON.stringify(paginatedSummaries));

  Promise.all(
    deepCopypaginatedSummaries.map(async (summary) => {
      const key = summary.svRt;
      const uploadRoute = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `${key}_SS`, // user1@mgmail.com/1693277942025_SS
      };
      summary.image = await getFileFromS3(uploadRoute, true); // GPS screenshot 조회
      return summary;
    }),
  )
    .then((results) => {
      console.log('완성된 summary: ', results);
      const responsePayload = {
        summaries: results,
        currentPage: page,
        totalPages: Math.ceil(summaries.length / limit),
      };
      return res.status(200).json(responsePayload);
    })
    .catch((error) => {
      console.error('에러 발생:', error);
    });
});
