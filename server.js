// includes
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// mount express
const app = express();

// setup CORS
app.use(cors());

// log the http layer
app.use(morgan('common'));

// setup static assets
app.use(express.static('public'));

// handle root GET call
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// handle products GET call
app.get('/products', (req, res) => {
  res.sendFile(__dirname + '/views/products.html');
});

// setup server
app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});
