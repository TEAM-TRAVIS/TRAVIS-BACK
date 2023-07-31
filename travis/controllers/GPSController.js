const GPSModel = require('../models/GPSModel');

exports.saveGPS = async (req, res) => {
  console.log('GPSController 의 saveGPS 까진 들어왔다.');
  try {
    const requestContent = req.body;
    // return res.status(200).json({ message: 'save server에서 request 받기 성공!', content: requestContent });

    // req가 summary 라면,
    if (Object.prototype.toString.call(requestContent) === '[object Object]') {
      console.log('summary임이 확인 됨', requestContent);
      return res.status(201).json({ message: '이 request는 summary 입니다.' });
      //몽고 DB에 저장.
    }
    // gzip 파일인 경우,
    return res.status(201).json({ message: '이 request는 gzip 입니다.' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'GPSController saveGPS error 발생' });
  }
};