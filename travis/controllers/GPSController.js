exports.saveGPS = async (req, res) => {
  try {
    return res.status(201).json({ message: 'GPSController.js의 saveGPS()의 response 입니다.', reqheader: req.headers, reqbody: req.body});
  } catch (error) {
    res.status(500).json({ error: 'GPSController.js saveGPS의 error 발생', ' error내용': error });
  }
};
