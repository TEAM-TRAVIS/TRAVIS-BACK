const jwt = require('jsonwebtoken');
const passport = require('passport');
const UserModel = require('../models/userModel');

// 사용자 로그인 성공 시 토큰을 생성하는 함수
const generateToken = (user) => {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
  return token;
};

// 회원가입
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // 이미 사용 중인 이메일인지 확인
    const existingUser = await UserModel.findOne({ email });

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
exports.login = async (req, res) => {
  try {
    const { user } = req;
    const token = generateToken(user);
    console.log('메러러러러러러엉 (userController.js) 성공');
    res.json({ user, token });
  } catch (error) {
    console.log('메렁 (userController.js)');
    res.status(500).json({ error: 'Internal server error' });
  }
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
