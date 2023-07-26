const jwt = require('jsonwebtoken');
const passport = require('passport');
const UserModel = require('../models/userModel');

// 회원가입
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // 이미 사용 중인 이메일인지 확인
    const existingUser = await UserModel.findOne({ email });
    console.log('회원가입 성공 테스트');
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const user = await UserModel.create({ name, email, password, joinDate: Date.now() });

    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 로그인
exports.login = (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: 'Login failed' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.json({ user: user, token });
  })(req, res, next);
};

// 로그아웃
exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Error logging out:', err);
      return res.status(500).send('Error logging out');
    }
    res.redirect('/'); // 로그아웃 성공 시 홈으로 리다이렉트합니다.
  });
};
