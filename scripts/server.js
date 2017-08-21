const express = require('express');
const path = require('path');
const app = express();
const port = 7000;

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

app.use(express.static(path.join(__dirname, '.')));

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }

  console.log(`server is listening on ${port}`);
});
