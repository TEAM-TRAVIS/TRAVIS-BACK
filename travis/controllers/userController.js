const jwt = require('jsonwebtoken');
const passport = require('passport');
const UserModel = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/sendEmail');

function verifyToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        reject(err);
      } else {
        resolve(decodedToken);
      }
    });
  });
}

// 회원가입
exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  const existingUser = await UserModel.findOne({ email }); // 이미 사용 중인 이메일인지 확인
  console.log('회원가입 성공 테스트');
  if (existingUser) {
    return res.status(400).json({ error: 'Email already exists' });
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' }); // 이메일 인증용 토큰 발급

  const user = await UserModel.create({
    name,
    email,
    password,
    joinDate: Date.now(),
    emailVerificationToken: token,
  });

  // 인증 이메일 내용
  const emailTemplate =
    '<h1>Verify your email</h1><p>Please click the button below to verify your email.</p><a href="http://localhost:3000//verify-email/${token}">Verify My Email</a>';

  await sendEmail(email, 'Travis: Email Verification', emailTemplate);
  res.status(201).json({ message: 'User created successfully', user });
});

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const decodedToken = await verifyToken(token);
    if (decodedToken) {
      const user = await UserModel.findOneAndUpdate(
        { emailVerificationToken: token },
        { isEmailVerified: true },
      );
    }
    res.redirect('/');
  } catch (error) {
    console.error('이메일 인증 오류:', error);
    res.redirect('/email-verification-failure');
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
exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      console.error('Error logging out:', err);
      return res.status(500).send('Error logging out');
    }
    res.redirect('/'); // 로그아웃 성공 시 홈으로 리다이렉트합니다.
  });
};
