const GPSModel = require('../models/GPSModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllPublicSummary = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;

  const users = await GPSModel.find();

  if (!users) {
    return res.status(404).json({ message: 'There is no public GPS data.' });
  }

  let summaries = users.map((user) => {
    const { records } = user;
    return records;
  });

  summaries = summaries.flat();
  summaries = summaries.filter((summary) => summary.isPublic === true);

  // Calculate startIndex and endIndex for pagination
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  // Get summaries for the current page
  const paginatedSummaries = summaries.slice(startIndex, endIndex);

  const responsePayload = {
    summaries: paginatedSummaries,
    currentPage: page,
    totalPages: Math.ceil(summaries.length / limit),
  };

  return res.status(200).json(responsePayload);
});
