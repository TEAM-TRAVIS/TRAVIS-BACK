const UserModel = require('../models/userModel');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const catchAsync = require('../utils/catchAsync');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URI,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user already exists in the database
        let user = await UserModel.findOne({ email: profile.emails[0].value });

        if (!user) {
          // If the user doesn't exist, create a new one
          user = await UserModel.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            joinDate: Date.now(),
          });
        } else {
          // If the user already exists, update the user's name
          return done(null, user);
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

// 로그인 인증
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password', // 생략 가능
    },
    catchAsync(async (email, password, done) => {
      const user = await UserModel.findOne({ email }).select('+password');
      if (!user) {
        return done(null, false, { message: 'Invalid email or password' });
      }

      const isPasswordMatch = await user.comparePassword(password, user.password);
      if (!isPasswordMatch) {
        return done(null, false, { message: 'Invalid email or password' });
      }

      return done(null, user);
    }),
  ),
);

// JWT 토큰 읽어서 사용자 인증 (API 접근 인증)
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    catchAsync(async (jwtPayload, done) => {
      const user = await UserModel.findById(jwtPayload.id);
      if (!user) {
        return done(null, false, { message: 'Invalid token' });
      }
      return done(null, user);
    }),
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
