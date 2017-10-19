// includes
const express     = require('express');
const morgan      = require('morgan');
const session     = require('express-session');
const bodyParser  = require('body-parser');
const jsonParser  = bodyParser.json();
const upsAPI      = require('shipping-ups');
const util        = require('util');
const fs          = require('fs');

// setup ups
const ups = new upsAPI({
  environment: 'live', // or sandbox
  username: 'mikemorgan6603',
  password: 'N@tPr1nT',
  access_key: '5D34F61318AFE568',
  imperial: true // set to false for metric
});


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

    // init admin session
    req.session.adminId = 0;

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

  // get newest item
  const newItemIndex = req.session.cart.length-1;
  const artworkSetting = req.session.cart[newItemIndex].artworkFile;

  // object to return
  let jsonResponse = {
    nextStep: '/cart'
  }

  // if user wants to use the designer interface
  if (artworkSetting === 'create') {

    // send back url with design template id
    jsonResponse = {
      nextStep: `/designs/?height=${req.session.cart[newItemIndex].productHeight}&width=${req.session.cart[newItemIndex].productWidth}&cartItemIndex=${newItemIndex}`
    }

  }

  // if user is uploading a file
  else if (artworkSetting === 'upload') {

    jsonResponse = {
      nextStep: `/upload/?cartItemIndex=${newItemIndex}`
    }

  }

  // send to cart page
  res.json(jsonResponse);

});

// update session info
app.put('/updateTemplateItemInfo', jsonParser, (req, res) => {

  req.session.cart[req.body.cartItemIndex].template.designId = req.body.designId;
  req.session.cart[req.body.cartItemIndex].template.preview = req.body.previewImg;
  req.session.cart[req.body.cartItemIndex].template.projectId = req.body.projectId;

  res.json({"updated": 1});

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

// delete cart itme
app.get('/deleteCartItem/:itemIndex', (req, res) => {

  // remove item at the passed index
  req.session.cart.splice(req.params.itemIndex, 1);

  // pass back the cart
  res.json(req.session.cart);

});

// update user info
app.post('/updateUser', jsonParser, (req, res) => {

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

  // clear cart session var
  req.session.cart = [];

  // send to confirmation page
  res.sendFile(__dirname + '/views/confirmation.html');

});

// get design templates
app.get('/designs', (req, res) => {
  res.sendFile(__dirname + '/views/designTemplates.html');
});

// get designer plugin
app.get('/createDesign', (req, res) => {
  res.sendFile(__dirname + '/views/design.html');
});

// validate address
app.get('/validateAddress', (req, res) => {

  // pass to ups api
  ups.address_validation({
      name: req.query.customerName,
      address_line_1: req.query.address,
      city: req.query.city,
      state_code: req.query.state,
      postal_code: req.query.zip,
      country_code: req.query.countryCode
    }, function(err, response) {

      // handle errors
      if(err) {console.log(err);}

      // send it back
      res.json(response);

  });

});

// get shipping rate
app.get('/getShippingRates', (req, res) => {

  // pass to ups api
  ups.rates({
    shipper: {
      name: 'BannerStack',
      address: {
        address_line_1: '53 Camellia Way',
        city: 'San Antonio',
        state_code: 'TX',
        country_code: 'US',
        postal_code: '78209'
      }
    },
    ship_to: {
      name: req.query.customerName,
      address: {
        address_line_1: req.query.address,
        city: req.query.city,
        state_code: req.query.state,
        postal_code: req.query.zip,
        country_code: req.query.countryCode
      }
    },
    packages: [
      {
        description: 'My Package',
        weight: req.query.pkgWeight
      }
    ]
  }, function(err, response) {

    // handle errors
    if(err) {return console.log(err);}

    // send response
    res.json(response);

  });

});


// setup server
app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});
