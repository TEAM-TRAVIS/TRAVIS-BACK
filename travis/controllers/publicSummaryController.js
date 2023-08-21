const GPSModel = require('../models/GPSModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllPublicSummary = catchAsync(async (req, res) => {
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

  const responsePayload = {
    summaries,
  };

  return res.status(200).json(responsePayload);
});
