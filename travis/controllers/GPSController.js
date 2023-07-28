const GPSModel = require('../models/GPSModel');

exports.saveGPS = async (req, res) => {
  try {
    const requestContent = req.body;
    // req가 summary 라면,
    if (Object.prototype.toString.call(requestContent) === '[object Object]') {
      console.log('summary 입니다.');
      console.log(requestContent);
      //몽고 DB에 저장.
    }
    // gzip 파일인 경우,
    else {
      console.log('gzip 파일입니다.');
      console.log(requestContent);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'GPSController saveGPS error 발생' });
  }
}