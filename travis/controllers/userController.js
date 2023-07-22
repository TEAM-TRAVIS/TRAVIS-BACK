const UserModel = require('../models/userModel');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

exports.signup = async (req, res) => {
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

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email', // 사용자가 이메일로 로그인하는 경우, 'email' 필드를 사용
    },
    async (email, password, done) => {
      try {
        const user = await UserModel.findOne({ email });

        if (!user) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        const isPasswordMatch = await user.comparePassword(password);

        if (!isPasswordMatch) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

// 세션 관리를 위한 serialize, deserialize 설정
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
