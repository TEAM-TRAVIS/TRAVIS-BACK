const GPSModel = require('../models/GPSModel');
const catchAsync = require('../utils/catchAsync');
const moment = require('moment');

//AWS S3에서 특정 날짜의 gzip 파일 GET
exports.getUserSummary = async (req, res) => {
  try {
    const { email } = req.body; //url에 포함된 정보 추츨

    // Find the GPS data for the specific user
    const userGPS = await GPSModel.findOne({ email });

    if (!userGPS) {
      return res.status(404).json({ message: '해당 유저로 저장된 GPS 데이터가 없습니다.' });
    }

    // 유저의 모든 GPS summary 데이터 추출
    const userData = userGPS.records.map(({ date, dist, time }) => ({ date, dist, time }));

    // to_dist, to_time 데이터도 포함하여 응답으로 보냄
    const responsePayload = {
      to_dist: userGPS.to_dist,
      to_time: userGPS.to_time,
      userData: userData,
    };

    return res.status(200).json(responsePayload);
  } catch (error) {
    res
      .status(500)
      .json({ error: '유저의 GPS summary 데이터 가져오기 실패.', 'error 내용': error });
  }
};

exports.getDailySummary = async (req, res) => {
  try {
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
      });
    }

    const responsePayload = {
      dailySummary,
    };

    return res.status(200).json(responsePayload);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to get user's daily GPS summary data.", 'error content': error });
  }
};

exports.getWeeklySummary = async (req, res) => {
  try {
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
      });
    }

    const responsePayload = {
      weeklySummary,
    };

    return res.status(200).json(responsePayload);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to get user's weekly GPS summary data.", 'error content': error });
  }
};

exports.getMonthlySummary = async (req, res) => {
  try {
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
      });
    }

    const responsePayload = {
      monthlySummary,
    };

    return res.status(200).json(responsePayload);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to get user's monthly GPS summary data.", 'error content': error });
  }
};

exports.getYearlySummary = async (req, res) => {
  try {
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
      yearlySummary[year].records.push({ date: record.date, dist: record.dist, time: record.time });
    }

    const responsePayload = {
      yearlySummary,
    };

    return res.status(200).json(responsePayload);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to get user's yearly GPS summary data.", 'error content': error });
  }
};
