// includes
const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
//var shippo = require('shippo')('shippo_test_1b5eb8be60175e318626100b8d271fce90f6cb34');

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
  console.log(req.session.cart);

  // get newest item
  const artworkSetting = req.session.cart[req.session.cart.length-1].artworkFile;

  // object to return
  let jsonResponse = {
    nextStep: '/cart'
  }

  // if user wants to use the designer interface
  if (artworkSetting === 'create') {
    jsonResponse = {
      nextStep: '/design'
    }
  }

  // if user is uploading a file
  else if (artworkSetting === 'upload') {
    jsonResponse = {
      nextStep: '/upload'
    }
  }

  // send to cart page
  res.json(jsonResponse);

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

// get designer plugin
app.get('/design', (req, res) => {
  res.sendFile(__dirname + '/views/design.html');
});

// get shipping rates
/*app.get('/getShippingRates', (req, res) => {

  var addressFrom  = {
    "company":"BannerStack.com",
    "street1":"53 Camellia Way",
    "city":"San Antonio",
    "state":"TX",
    "zip":"78209",
    "country":"US", //iso2 country code
    "phone":"+1 361 816 0461",
    "email":"support@bannerstack.com",
  };

  // example address_to object dict
  var addressTo = {
    "name":"Pedro Morin",
    "street1":"7426 Vaquero Drive",
    "city":"Corpus Christi",
    "state":"TX",
    "zip":"78414",
    "country":"US", //iso2 country code
    "phone":"+1 361 903 0942",
    "email":"pedro@121texas.com",
  };

  // parcel object dict
  var parcelOne = {
    "length":"5",
    "width":"5",
    "height":"5",
    "distance_unit":"in",
    "weight":"2",
    "mass_unit":"lb"
  };

  var parcelTwo = {
    "length":"5",
    "width":"5",
    "height":"5",
    "distance_unit":"in",
    "weight":"2",
    "mass_unit":"lb"
  };

  var shipment = {
    "address_from": addressFrom,
    "address_to": addressTo,
    "parcels": [parcelOne, parcelTwo],
  };

  shippo.transaction.create({
    "shipment": shipment,
    "servicelevel_token": "ups_ground",
    "carrier_account": "mik_288615soap",
    "label_file_type": "png"
  })
  .then(function(transaction) {
      shippo.transaction.list({
        "rate": transaction.rate
      })
      .then(function(mpsTransactions) {
          mpsTransactions.results.forEach(function(mpsTransaction){
              if(mpsTransaction.status == "SUCCESS") {
                console.log("Label URL: %s", mpsTransaction.label_url);
                console.log("Tracking Number: %s", mpsTransaction.tracking_number);
              }
              else {
                // hanlde error transactions
                console.log("Message: %s", mpsTransactions.messages);
              }
          });
      })
  }, function(err) {
    // Deal with an error
    console.log("There was an error creating transaction : %s", err.detail);
  });

});*/

// setup server
app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});
