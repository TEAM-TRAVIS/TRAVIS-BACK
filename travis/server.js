#!/usr/bin/env node

const mongoose = require('mongoose');
const dotenv = require('dotenv');

// uncaughtException: Node.js 프로세스에서 발생하지 않은 예외 처리
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message, err.stack);
  process.exit(1);
});

dotenv.config({ path: './.env' });
const app = require('./app');
const debug = require('debug')('travis:server');
const http = require('http');

// userModel.js 불러옴

// .env 에서 PORT 환경 변수 가져오고, 없으면 디폴트로 3000번
const port = process.env.PORT || 3000;
app.set('port', port);

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

// Use the correct version of mongoose.connect
mongoose.connect(DB).then(() => {
  console.log('DB connection successful!');
});

/*mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((err) => {
      console.error('Error connecting to MongoDB:', err.message);
    });*/

// HTTP server 만듬
const server = http.createServer(app);

// listen
server.listen(port);

// unhandledRejection: 프로미스가 rejected 되었지만 처리되지 않은 경우
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message, err.stack);
  server.close(() => {
    process.exit(1);
  });
});
