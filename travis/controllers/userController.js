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
  const emailTemplate = `<h1>Verify your email</h1><p>Please click the button below to verify your email.</p><a href="http://localhost:3000/user/verify-email/${token}">Verify My Email</a>`;

  await sendEmail(email, 'Travis: Email Verification', emailTemplate);
  res.status(201).json({ message: 'User created successfully', user });
});

exports.verifyEmail = catchAsync(async (req, res) => {
  try {
    const { token } = req.params;
    console.log('heyyy');

    // 토큰을 디코딩하고 유효성을 검사합니다.
    const decodedToken = await verifyToken(token);

    // 토큰이 유효하다면, decodedToken에 디코딩된 정보가 들어있습니다.
    // 이 정보를 활용하여 사용자를 인증하고, 인증 상태를 변경합니다.
    const user = await UserModel.findOneAndUpdate(
      { email: decodedToken.email },
      { isEmailVerified: true },
    );

    if (!user) {
      console.error('사용자를 찾을 수 없음');
      return res.redirect('/email-verification-failure');
    }

    res.redirect('/emailSuccess');
    console.log('userController');
  } catch (error) {
    console.error('이메일 인증 오류:', error);
    res.redirect('/email-verification-failure');
  }
});

exports.emailVerificationSuccess = (req, res) => {
  // 인증이 성공적으로 완료되면 사용자를 인증이 완료된 상태로 변경하거나, 이후 로그인 절차를 진행하도록 합니다.
  // 여기서는 인증이 성공적으로 완료되었다는 메시지를 보여줍니다.
  res.send('이메일 인증이 성공적으로 완료되었습니다.');
};

exports.emailVerificationFailure = (req, res) => {
  // 인증이 실패한 경우 실패 메시지를 보여줍니다.
  res.send('이메일 인증에 실패했습니다. 올바른 인증 링크를 클릭해주세요.');
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
