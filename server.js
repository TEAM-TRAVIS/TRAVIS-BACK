const express = require('express');
const app = express();
const port = 8000;

app.listen(port, () => {
  console.log(`server running, port: ${port}`);
});

app.get('/', (req, res) => {
  res.send('Hello');
});
