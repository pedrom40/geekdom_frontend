// includes
const express = require('express');
const morgan = require('morgan');

// mount express
const app = express();

// log the http layer
app.use(morgan('common'));

// handle root GET call
app.get('/', function (req, res) {
  res.send('Hello World!')
});

// setup server
app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});
