const UserModel = require('../models/userModel');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

// for 회원가입
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password', // 생략 가능
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

// for 로그인
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (jwtPayload, done) => {
      try {
        const user = await UserModel.findById(jwtPayload.id);
        if (!user) {
          return done(null, false, { message: 'Invalid token' });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

// 로그인 성공 -> 사용자 정보 session 에 저장
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// 사용자 정보 session 에서 삭제
passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.findById(id);
    done(null, user || false);
  } catch (error) {
    done(error);
  }
});
