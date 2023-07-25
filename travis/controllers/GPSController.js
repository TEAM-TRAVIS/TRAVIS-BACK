const GPSModel = require('../models/GPSModel');

//state: start
exports.startGPS = async (req, res) => {
  try {
    const { email, longitude, latitude, height, time } = req.body.content;
    //새 recordId 발급 받아야함. (해당 userId의 record 개수를 확인해서 개수 +1 로 발급)
    const userRecords = await GPSModel.findOne({ email });

    //첫 기록의 user의 경우
    if (!userRecords) {
      const records = [];
      const GPS = [];
      GPS.push({
        longitude: longitude,
        latitude: latitude,
        height: height,
        time: time,
      });
      records.push({
        recordId: 0,
        date: time.날짜,
        GPS: GPS,
      });
      GPSModel.
      await GPSModel.create({ email, records }); //저장
      return res.status(201).json({ error: 'Records saved successfully', recordId: 0 });
    }

    //다른 기록이 있는 user의 경우
    const recordId = userRecords.records.length;
    const currentGPS = {
      longitude: longitude,
      latitude: latitude,
      height: height,
      time: time,
    }
    userRecords.records.push(currentGPS);









    const GPS = userRecords.records;
    const count = GPS.count(); //몇개 있는지 세기
    const recordId = count + 1; //recordId 발급



    // 이미 사용 중인 이메일인지 확인
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const user = await UserModel.create({ name, email, password });

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};



exports.getGPS = (req, res) => {
  res.render('signup'); // GET 요청 들어오면 signup 함수 실행하도록 설정
};

//GPS 데이터 저장
exports.saveGPS = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // 이미 사용 중인 이메일인지 확인
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const user = await UserModel.create({ name, email, password });

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
