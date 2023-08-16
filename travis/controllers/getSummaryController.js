const GPSModel = require('../models/GPSModel');
const catchAsync = require('../utils/catchAsync');
const findOneSummary = require('../utils/findOneSummary');
const gpsController = require('./getGPSController');
const moment = require('moment');

exports.getUserSummary = catchAsync(async (req, res) => {
  const { email } = req.body; //url에 포함된 정보 추츨

  // Find the GPS data for the specific user
  const userGPS = await GPSModel.findOne({ email });

  if (!userGPS) {
    return res.status(404).json({ message: '해당 유저로 저장된 GPS 데이터가 없습니다.' });
  }

  // 유저의 모든 GPS summary 데이터 추출
  const userData = userGPS.records.map(({ date, dist, time, title, content }) => ({
    date,
    dist,
    time,
    title,
    content,
  }));

  // to_dist, to_time 데이터도 포함하여 응답으로 보냄
  const responsePayload = {
    to_dist: userGPS.to_dist,
    to_time: userGPS.to_time,
    userData: userData,
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

  // Delete the GPS data for the specific date
  const updatedRecords = userGPS.records.filter((record) => {
    const recordDate = record.date.toISOString().replace('Z', '+00:00');
    return recordDate !== date;
  });

  userGPS.records = updatedRecords;
  await userGPS.save();

  // Delete the GPS data for the specific date from S3
  const deletionResult = await gpsController.deleteUserGPS(email, date);

  if (deletionResult.success) {
    const responsePayload = {
      message: 'Successfully deleted the GPS data for the specific date.',
    };

    return res.status(200).json(responsePayload);
  } else {
    // Handle the case where the S3 deletion failed
    return res.status(500).json({
      message: 'Failed to delete GPS data from S3.',
    });
  }
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
  };

  return res.status(200).json(responsePayload);
});

exports.getDailySummary = catchAsync(async (req, res) => {
  const { email } = req.body; // Extract the information contained in the URL

  // Find the GPS data for the specific user
  const userGPS = await GPSModel.findOne({ email });

  if (!userGPS) {
    return res.status(404).json({ message: 'There is no saved GPS data for that user.' });
  }

  // Aggregate daily summary data of the user
  const dailySummary = {};

  for (const record of userGPS.records) {
    const dateKey = record.date.toISOString().split('T')[0];
    if (!dailySummary[dateKey]) {
      dailySummary[dateKey] = {
        totalDist: 0,
        totalTime: 0,
        records: [],
      };
    }
    dailySummary[dateKey].totalDist += record.dist;
    dailySummary[dateKey].totalTime += record.time;
    dailySummary[dateKey].records.push({
      date: record.date,
      dist: record.dist,
      time: record.time,
      title: record.title,
      content: record.content,
    });
  }

  const responsePayload = {
    dailySummary,
  };

  return res.status(200).json(responsePayload);
});

exports.getWeeklySummary = catchAsync(async (req, res) => {
  const { email } = req.body; // Extract the information contained in the URL

  // Find the GPS data for the specific user
  const userGPS = await GPSModel.findOne({ email });

  if (!userGPS) {
    return res.status(404).json({ message: 'There is no saved GPS data for that user.' });
  }

  // Aggregate weekly summary data of the user
  const weeklySummary = {};

  for (const record of userGPS.records) {
    const week = moment(record.date).isoWeek();
    const year = record.date.getFullYear();
    const weekKey = `${year}-W${week}`;
    if (!weeklySummary[weekKey]) {
      weeklySummary[weekKey] = {
        totalDist: 0,
        totalTime: 0,
        records: [],
      };
    }
    weeklySummary[weekKey].totalDist += record.dist;
    weeklySummary[weekKey].totalTime += record.time;
    weeklySummary[weekKey].records.push({
      date: record.date,
      dist: record.dist,
      time: record.time,
      title: record.title,
      content: record.content,
    });
  }

  const responsePayload = {
    weeklySummary,
  };

  return res.status(200).json(responsePayload);
});

exports.getMonthlySummary = catchAsync(async (req, res) => {
  const { email } = req.body; // Extract the information contained in the URL

  // Find the GPS data for the specific user
  const userGPS = await GPSModel.findOne({ email });

  if (!userGPS) {
    return res.status(404).json({ message: 'There is no saved GPS data for that user.' });
  }

  // Aggregate monthly summary data of the user
  const monthlySummary = {};

  for (const record of userGPS.records) {
    const year = record.date.getFullYear();
    const month = record.date.getMonth() + 1;
    const monthKey = `${year}-${month}`;
    if (!monthlySummary[monthKey]) {
      monthlySummary[monthKey] = {
        totalDist: 0,
        totalTime: 0,
        records: [],
      };
    }
    monthlySummary[monthKey].totalDist += record.dist;
    monthlySummary[monthKey].totalTime += record.time;
    monthlySummary[monthKey].records.push({
      date: record.date,
      dist: record.dist,
      time: record.time,
      title: record.title,
      content: record.content,
    });
  }

  const responsePayload = {
    monthlySummary,
  };

  return res.status(200).json(responsePayload);
});

exports.getYearlySummary = catchAsync(async (req, res) => {
  const { email } = req.body; // Extract the information contained in the URL

  // Find the GPS data for the specific user
  const userGPS = await GPSModel.findOne({ email });

  if (!userGPS) {
    return res.status(404).json({ message: 'There is no saved GPS data for that user.' });
  }

  // Aggregate yearly summary data of the user
  const yearlySummary = {};

  for (const record of userGPS.records) {
    const year = record.date.getFullYear();
    if (!yearlySummary[year]) {
      yearlySummary[year] = {
        totalDist: 0,
        totalTime: 0,
        records: [],
      };
    }
    yearlySummary[year].totalDist += record.dist;
    yearlySummary[year].totalTime += record.time;
    yearlySummary[year].records.push({
      date: record.date,
      dist: record.dist,
      time: record.time,
      title: record.title,
      content: record.content,
    });
  }

  const responsePayload = {
    yearlySummary,
  };

  return res.status(200).json(responsePayload);
});
