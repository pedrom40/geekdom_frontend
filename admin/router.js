const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const router = express.Router();
const jsonParser = bodyParser.json();

// import session
router.use(session({secret:'keyboard cat', resave:false, saveUninitialized:true}));

// login
router.get('/login', jsonParser, (req, res) => {
  res.render('admin/login');
});

// get admin session info
router.get('/getAdminUser', jsonParser, (req, res) => {
  res.json(req.session.adminUser);
});

// update admin session info
router.get('/updateAdminUser', jsonParser, (req, res) => {

  // update admin session
  req.session.adminUser = {
    id: req.query.id,
    email: req.query.email,
    name: req.query.name,
    validated: req.query.validated
  }

  res.json(req.session.adminUser);

});

// dashboard
router.get('/dashboard', jsonParser, (req, res) => {
  res.render('admin/main');
});

// products
router.get('/products', jsonParser, (req, res) => {
  res.render('admin/main');
});
router.get('/products/add', jsonParser, (req, res) => {
  res.render('admin/main');
});

// categories
router.get('/categories', jsonParser, (req, res) => {
  res.render('admin/main');
});

// printers
router.get('/printers', jsonParser, (req, res) => {
  res.render('admin/main');
});

// media
router.get('/media', jsonParser, (req, res) => {
  res.render('admin/main');
});

// flat charges
router.get('/flat-charges', jsonParser, (req, res) => {
  res.render('admin/main');
});

// artwork options
router.get('/artwork-options', jsonParser, (req, res) => {
  res.render('admin/main');
});

// turnarounds
router.get('/turnarounds', jsonParser, (req, res) => {
  res.render('admin/main');
});

// order statuses
router.get('/orderStatuses', jsonParser, (req, res) => {
  res.render('admin/main');
});

// finishing
router.get('/finishing', jsonParser, (req, res) => {
  res.render('admin/main');
});

// admin users
router.get('/users', jsonParser, (req, res) => {
  res.render('admin/main');
});

// list sizes
router.get('/sizes', jsonParser, (req, res) => {
  res.render('admin/main');
});

// list images
router.get('/images', jsonParser, (req, res) => {
  res.render('admin/images');
});


module.exports = {router};
