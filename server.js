'use strict';

// includes
const express     = require('express');
const morgan      = require('morgan');
const session     = require('express-session');
const bodyParser  = require('body-parser');
const jsonParser  = bodyParser.json();
const util        = require('util');
const fs          = require('fs');
const ejs         = require('ejs');

// mount express
const app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

// log the http layer
app.use(morgan('common'));

// setup session
app.use(session({secret:'keyboard cat', resave:false, saveUninitialized:true}));
app.use( (req, res, next) => {

  // if cart is not setup yet
  if (!req.session.cart) {

    // init cart session var
    req.session.cart = [];

    // init user session var
    req.session.user = {

      id: 0,
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

      loggedIn: false

    }

  }

  // if adminUser is not setup yet
  if (!req.session.adminUser) {

    // init admin session
    req.session.adminUser = {
      id: 0,
      email: '',
      name: '',
      validated: false
    }

  }

  next();

});

// setup routers
const {router: adminRouter} = require('./admin/router');
app.use('/admin/', adminRouter);

// setup static assets
app.use(express.static('public'));


// handle root GET call
app.get('/', (req, res) => {
  res.render('pages/index');
});

// handle products GET call
app.get('/products', (req, res) => {
  res.render('pages/products');
});

// handle contacts GET call
app.get('/contact', (req, res) => {
  res.render('pages/contact');
});

// handle product category call
app.get('/products/:category/', (req, res) => {
  res.render('pages/products');
});

// handle product call
app.get('/products/:category/:product', (req, res) => {
  res.render('pages/products');
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
      nextStep: '/createDesign'
      //`/designs/?height=${req.session.cart[newItemIndex].productHeight}&width=${req.session.cart[newItemIndex].productWidth}&cartItemIndex=${newItemIndex}`
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
  res.render('pages/cart');
});

// pass cart contents
app.get('/getCart', (req, res) => {
  res.json(req.session.cart);
});

// update cart item shipping cost
app.post('/updateCart', jsonParser, (req, res) => {
  req.session.cart[req.body.cartIndex].shippingCost = Number(req.body.shippingCost).toFixed(2);
  req.session.cart[req.body.cartIndex].shippingService = req.body.shippingMethod;
  res.json(req.session.cart);
});

// pass user contents
app.get('/getUser', (req, res) => {
  res.json(req.session.user);
});

// update cart item shipping cost
app.post('/updateUserStatus', jsonParser, (req, res) => {
  req.session.user.id = req.body.userId;
  req.session.user.loggedIn = req.body.loggedIn;
  res.json(req.session.user);
});

// member home
app.get('/member', (req, res) => {

  // check if user is logged in
  if (req.session.user.loggedIn) {
    res.render('pages/member');
  }
  else {
    res.redirect('/login');
  }

});

// member login
app.get('/login', (req, res) => {
  res.render('pages/login');
});

// update user info after successful login
app.post('/updateUserFromLogin', jsonParser, (req, res) => {
  req.session.user = {
    id: req.body.id,
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    loggedIn: true
  }
  res.json(req.session.user);
});

// delete cart item
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
  res.json({"userUpdated": "yes"});

});

// checkout
app.get('/checkout', (req, res) => {
  res.render('pages/checkout');
});

// review order
app.get('/review', (req, res) => {
  res.render('pages/review');
});

// order confirmation page
app.get('/confirmation', (req, res) => {

  // clear cart session var
  req.session.cart = [];

  // send to confirmation page
  res.render('pages/confirmation');

});

// get design templates
app.get('/designs', (req, res) => {
  res.render('pages/designTemplates');
});

// get designer plugin
app.get('/createDesign', (req, res) => {
  res.render('pages/design');
});


// setup server
app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});
