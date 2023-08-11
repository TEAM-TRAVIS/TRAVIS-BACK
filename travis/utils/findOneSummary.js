const GPSModel = require('../models/GPSModel');

module.exports = async (req, res, next) => {
  const { email, date } = req.body; // Extract the information contained in the URL

  // Find the GPS data for the specific user
  const userGPS = await GPSModel.findOne({ email });

  if (!userGPS) {
    return res.status(404).json({ message: 'There is no saved GPS data for that user.' });
  }

  // Find the GPS data for the specific date
  const oneSummary = userGPS.records.find((record) => {
    const recordDate = record.date.toISOString().replace('Z', '+00:00');
    return recordDate === date;
  });

  return oneSummary;
};
