// includes
const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

// mount express
const app = express();

// log the http layer
app.use(morgan('common'));

// setup session
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
  })
);
app.use( (req, res, next) => {

  // if cart is not setup yet
  if (!req.session.cart) {

    // init cart session var
    req.session.cart = [];

    // init user session var
    req.session.user = {

      name: '',
      phone: '',
      email: '',

      billingName: '',
      billingAddress: '',
      billingCity: '',
      billingState: '',
      billingZip: '',
      cardToken: '',
      cardLastFour: '',

    }

  }

  next();

});

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
  res.sendFile(__dirname + '/views/products.html');
});

// handle product call
app.get('/products/:category/:product', (req, res) => {
  res.sendFile(__dirname + '/views/products.html');
});

// handle cart POST (adding an item to the cart)
app.post('/cart', jsonParser, (req, res) => {

  // add item to cart array
  req.session.cart.push(req.body);

  // send to cart page
  res.json({
    "itemAdded": "yes"
  });

});

// handle cart GET
app.get('/cart', (req, res) => {
  res.sendFile(__dirname + '/views/cart.html');
});

// pass cart contents
app.get('/getCart', (req, res) => {
  res.json(req.session.cart);
});

// pass user contents
app.get('/getUser', (req, res) => {
  res.json(req.session.user);
});

// pass user contents
app.get('/getUser', (req, res) => {
  res.json(req.session.user);
});

// update cart info
app.post('/updateCart', jsonParser, (req, res) => {

  // update user session var
  req.session.user = {

    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,

    billingName: req.body.billingName,
    billingAddress: req.body.billingAddress,
    billingCity: req.body.billingCity,
    billingState: req.body.billingState,
    billingZip: req.body.billingZip,
    cardToken: req.body.cardToken,
    cardLastFour: req.body.cardLastFour

  }

  // send success
  res.json({
    "userUpdated": "yes"
  });

});

// checkout
app.get('/checkout', (req, res) => {
  res.sendFile(__dirname + '/views/checkout.html');
});

// review order
app.get('/review', (req, res) => {
  res.sendFile(__dirname + '/views/review.html');
});

// order confirmation page
app.get('/confirmation', (req, res) => {
  res.sendFile(__dirname + '/views/confirmation.html');
});

// setup server
app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});
