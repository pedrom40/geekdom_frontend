// includes
const express = require('express');
const morgan = require('morgan');

// mount express
const app = express();

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

// handle product category call
app.get('/products/:category/', (req, res) => {
  const {category} = req.params;
  console.log(category);
  res.send(`you asked to see ${category} products`);
});

// setup server
app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});
