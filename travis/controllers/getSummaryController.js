const GPSModel = require('../models/GPSModel');
const catchAsync = require('../utils/catchAsync');
const findOneSummary = require('../utils/findOneSummary');
const gpsController = require('./getGPSController');
const moment = require('moment');

const aggregateSummary = (records, groupingCallback) => {
  const summary = {};

  for (const record of records) {
    const groupKey = groupingCallback(record.date);

    if (!summary[groupKey]) {
      summary[groupKey] = {
        totalDist: 0,
        totalTime: 0,
        records: [],
      };
    }

    summary[groupKey].totalDist += record.dist;
    summary[groupKey].totalTime += record.time;
    summary[groupKey].records.push({
      date: record.date,
      dist: record.dist,
      time: record.time,
      title: record.title,
      content: record.content,
      city1: record.city1,
      city2: record.city2,
      city3: record.city3,
      svRt: record.svRt,
    });
  }

  return summary;
};

const getSummaryByTime = async (req, res, timeUnit) => {
  const { email } = req.body;
  const { year, month, day, week } = req.params;
  const { page = 1, limit = 10 } = req.query; // Default page to 1 and limit to 10
  const userGPS = await GPSModel.findOne({ email });

  if (!userGPS) {
    return res.status(404).json({ message: 'There is no saved GPS data for that user.' });
  }

  let selectedMoment;

  if (timeUnit === 'day') {
    selectedMoment = moment.utc(`${year}-${month}-${day}`, 'YYYY-MM-DD');
  } else if (timeUnit === 'week') {
    selectedMoment = moment.utc(`${year}-W${week}`);
  } else if (timeUnit === 'month') {
    selectedMoment = moment.utc(`${year}-${month}`, 'YYYY-MM');
  } else if (timeUnit === 'year') {
    selectedMoment = moment.utc(`${year}`, 'YYYY');
  }

  const filteredRecords = userGPS.records.filter((record) => {
    const recordDate = new Date(record.date); // Parse the date
    return moment.utc(recordDate).isSame(selectedMoment, timeUnit);
  });

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const paginatedRecords = filteredRecords.slice(startIndex, endIndex);

  const summary = aggregateSummary(paginatedRecords, (date) => {
    if (timeUnit === 'day') {
      return date.toISOString().split('T')[0];
    } else if (timeUnit === 'week') {
      const weekNumber = moment(date).isoWeek();
      const yearNumber = moment(date).year();
      return `${yearNumber}-W${weekNumber}`;
    } else if (timeUnit === 'month') {
      const yearNumber = moment(date).year();
      const monthNumber = moment(date).month() + 1;
      return `${yearNumber}-${monthNumber}`;
    } else if (timeUnit === 'year') {
      return moment(date).year();
    }
  });

  const responsePayload = {
    [`${timeUnit}lySummary`]: summary,
    currentPage: page,
    totalPages: Math.ceil(filteredRecords.length / limit),
  };

  return res.status(200).json(responsePayload);
};

exports.getUserSummary = catchAsync(async (req, res) => {
  const { email } = req.body;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;

  // Find the GPS data for the specific user
  const userGPS = await GPSModel.findOne({ email });

  if (!userGPS) {
    return res.status(404).json({ message: '해당 유저로 저장된 GPS 데이터가 없습니다.' });
  }

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  // 유저의 모든 GPS summary 데이터 추출
  const userData = userGPS.records.slice(startIndex, endIndex);

  // to_dist, to_time 데이터도 포함하여 응답으로 보냄
  const responsePayload = {
    to_dist: userGPS.to_dist,
    to_time: userGPS.to_time,
    userData: userData,
    currentPage: page,
    totalPages: Math.ceil(userGPS.records.length / limit),
  };

  return res.status(200).json(responsePayload);
});

exports.getOneSummary = catchAsync(async (req, res) => {
  const oneSummary = await findOneSummary(req, res);

  if (!oneSummary) {
    return res.status(404).json({ message: 'There is no saved GPS data for that date.' });
  }

  const responsePayload = {
    oneSummary,
  };

  return res.status(200).json(responsePayload);
});

exports.deleteOneSummary = catchAsync(async (req, res) => {
  const { email, date } = req.body; // Extract the information contained in the URL

  // Find the GPS data for the specific user
  const userGPS = await GPSModel.findOne({ email });

  if (!userGPS) {
    return res.status(404).json({ message: 'There is no saved GPS data for that user.' });
  }

  const oneSummary = await findOneSummary(req, res);

  if (!oneSummary) {
    return res.status(404).json({ message: 'There is no saved GPS data for that date.' });
  }

  userGPS.records = userGPS.records.filter((record) => {
    const recordDate = record.date.toISOString().replace('Z', '+00:00');
    return recordDate !== date;
  });

  userGPS.to_dist -= oneSummary.dist;
  userGPS.to_time -= oneSummary.time;

  await userGPS.save();

  const deletionResult = await gpsController.deleteUserGPS(email, date);

  if (deletionResult.success) {
    const responsePayload = {
      message: 'Successfully deleted the GPS data for the specific date.',
    };

    return res.status(200).json(responsePayload);
  }
  return res.status(500).json({
    message: 'Failed to delete GPS data from S3.',
  });
});

exports.updateSummary = catchAsync(async (req, res) => {
  const { email, date, title, content, isPublic } = req.body; // Extract the information contained in the URL

  // Find the GPS data for the specific user
  const userGPS = await GPSModel.findOne({ email });

  if (!userGPS) {
    return res.status(404).json({ message: 'There is no saved GPS data for that user.' });
  }

  const oneSummary = await findOneSummary(req, res);

  if (!oneSummary) {
    return res.status(404).json({ message: 'There is no saved GPS data for that date.' });
  }

  // Update the GPS data for the specific date
  const updatedRecords = userGPS.records.map((record) => {
    const recordDate = record.date.toISOString().replace('Z', '+00:00');
    if (recordDate === date) {
      record.title = title;
      record.content = content;
      record.isPublic = isPublic;
    }
    return record;
  });
  userGPS.records = updatedRecords;
  await userGPS.save();

  const responsePayload = {
    message: 'Successfully updated the GPS data for the specific date.',
    data: updatedRecords,
  };

  return res.status(200).json(responsePayload);
});

exports.getDailySummary = catchAsync(async (req, res) => {
  return getSummaryByTime(req, res, 'day');
});

exports.getWeeklySummary = catchAsync(async (req, res) => {
  return getSummaryByTime(req, res, 'week');
});

exports.getMonthlySummary = catchAsync(async (req, res) => {
  return getSummaryByTime(req, res, 'month');
});

exports.getYearlySummary = catchAsync(async (req, res) => {
  return getSummaryByTime(req, res, 'year');
});
