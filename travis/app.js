const logger = require('morgan');
const express = require('express');
const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
// 회원가입: bodyParser
const bodyParser = require('body-parser');

// 로그인: session, passport
const session = require('express-session');
const passport = require('passport');
const passportConfig = require('./config/passport');
const swaggerFile = require('./public/common/swagger-output.json');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Router 미들웨어 추가
const indexRouter = require('./routes/index');
const userRouter = require('./routes/userRouter');
const mainRouter = require('./routes/mainRouter');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json()); // body-parser
app.use(express.urlencoded({ extended: false })); // body-parser
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile, { explorer: true }));

// 회원가입: bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// 로그인: session, passport
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.initialize()); // passport 초기화
app.use(passport.session()); // passport 세션 사용

// Router 미들웨어 연결
app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/main', mainRouter);

// Routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication, redirect to the desired page
    res.redirect('/'); // Change '/' to the desired page after successful login
  },
);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
