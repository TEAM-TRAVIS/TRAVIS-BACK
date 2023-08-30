const GPSModel = require('../models/GPSModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllPublicSummary = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;

  const users = await GPSModel.find();

  if (!users) {
    return next(new AppError('There is no saved GPS data for that date.', 404));
  }

  let summaries = users.map((user) => {
    const { records } = user;
    return records;
  });

  summaries = summaries.flat();
  summaries = summaries.filter((summary) => summary.isPublic === true);

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const paginatedSummaries = summaries.slice(startIndex, endIndex);

  const responsePayload = {
    summaries: paginatedSummaries,
    currentPage: page,
    totalPages: Math.ceil(summaries.length / limit),
  };

  return res.status(200).json(responsePayload);
});
