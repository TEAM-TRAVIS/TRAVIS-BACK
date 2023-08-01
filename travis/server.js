#!/usr/bin/env node

const mongoose = require('mongoose');
const dotenv = require('dotenv');

// uncaughtException 이벤트 리스너를 등록함
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

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message, err.stack);
  process.exit(1);
});
