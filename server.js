const mongoose = require('mongoose');
const dotenv = require('dotenv');
const express = require('express');

dotenv.config({ path: './config.env' });

const app = express();
const port = 8000;

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB).then(() => {
  console.log('DB connection successful!');
});

app.listen(port, () => {
  console.log(`server running, port: ${port}`);
});

app.get('/', (req, res) => {
  res.send('Hello');
});
