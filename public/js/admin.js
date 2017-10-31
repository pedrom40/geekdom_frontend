'use strict';

// main function that calls everything
function initAdmin () {

  // check for admin login
  checkForAdminSession();

}

// looks for active admin session
function checkForAdminSession () {

  // get page requested
  const viewRequested = window.location.pathname;

  // get admin user info
  getAdminSessionInfo()
    .then(adminUser => {

      // if admin user is not validated
      if (adminUser.validated === false && viewRequested !== '/admin/login') {

        // send to login page
        window.location.assign('/admin/login');

      }

      // if user is already validated
      else if (adminUser.validated) {

        // get view requested
        getViewRequested(viewRequested);

      }

      // if you need to login
      else {

        // load login form
        loadLoginForm();

      }

    });

}

// find out what view the user wants
function getViewRequested (viewRequested) {

  // load admin menu
  loadAdminMenu();

  // if dashboard view requested
  if (viewRequested === '/admin/dashboard') {

    // load dashboard
    loadAdminDashboard();

  }

  // if admin users list view requested
  else if (viewRequested === '/admin/users') {

    // load admin users view
    console.log('load admin users list');

  }

}

// loads admin nav menu after valid session verified
function loadAdminMenu () {

  // start fresh
  $('.js-admin-menu').empty();

  // markup menu
  const adminMenu = `
    <div class="column column-20">
      <ul>
        <li><a href="/admin/dashboard">Orders</a></li>
        <li>
          <a href="/admin/products">Products</a>
          <ul>
            <li><a href="/admin/printers">Printers</a></li>
            <li><a href="/admin/media">Media</a></li>
            <li><a href="/admin/categories">Categories</a></li>
            <li><a href="/admin/images">Images</a></li>
            <li><a href="/admin/sizes">Sizes</a></li>
            <li><a href="/admin/finishing">Finishing</a></li>
            <li><a href="/admin/turnaround">Turnaround</a></li>
            <li><a href="/admin/flat-charges">Flat Charges</a></li>
          </ul>
        </li>
        <li><a href="/admin/users">Users</a></li>
      </ul>
    </div>
  `;

  // send HTML to placeholder
  $('.js-admin-menu').html(adminMenu);

}

// loads dashboard
function loadAdminDashboard () {

  // gets recent orders
  let memberRows = ``;
  const recentOrders = getRecentOrders();

  // start fresh
  $('.js-admin-placeholder').empty();

  // markup display
  const recentOrderList = `
    <div class="row">
      <div class="column">

        <label for="memberSearchTerm">Member Search</label>
        <input type="text" id="memberSearchTerm" placeholder="Search by Name, Email or Phone">

        <div class="row">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Orders</th>
              </tr>
            </thead>
            <tbody>
              ${memberRows}
            </tbody>
          </table>
        </div>

      </div>
      <div class="column column-20">
        <h4>Admin Users</h4>
      </div>
    </div>
  `;

}

// load login form
function loadLoginForm () {

  // update page title
  $('.js-page-title').html('ADMIN LOGIN');

  // make sure the placeholder is emtpy
  $('.js-admin-placeholder').empty();

  // markup form
  const template = `
    <form class="adminLoginForm">
      <div class="row">
        <div class="column">

          <label for="adminEmail">Email</label>
          <input type="email" id="adminEmail" placeholder="admin@email.com" required>

          <label for="adminPassword">Password</label>
          <input type="password" id="adminPassword" placeholder="******" required>

          <input type="submit" id="adminLoginSubmitBtn" value="Login">

          <div class="error-msg" style="display:none;"></div>

        </div>
      </div>
    </form>
  `;

  // add to HTML
  $('.js-admin-placeholder').html(template);

  // make for active by listening for submit
  listenForAdminLoginSubmit();

}
function listenForAdminLoginSubmit () {

  $('.adminLoginForm').submit( event => {
    event.preventDefault();

    // send msg and disable login btn
    $('#adminLoginSubmitBtn').prop('value', 'Validating...');
    $('#adminLoginSubmitBtn').prop('disabled', true);

    // send to login function
    loginAdminUser();

  });

}

// attempt to login admin user
function loginAdminUser () {

  // create login obj
  const loginValues = {
    method: 'loginUser',
    email: $('#adminEmail').val(),
    password: $('#adminPassword').val()
  }

  // send to service for validation
  callAdminService(loginValues)
    .then( loginResponse => {

      // figure out how to handle the result
      handleLoginResponse(loginResponse);

    });

}
function handleLoginResponse (loginResponse) {console.log(loginResponse);

  // if login successfull
  if (loginResponse.validated) {

    // update admin user session
    updateAdminUserSession(loginResponse)
      .then( userResponse => {console.log(userResponse);

        // send user to dashboard
        //window.location.assign('/admin/dashboard');

      });

  }

  // if not
  else {

    // send failed msg
    $('.error-msg').html(loginResponse.msg);
    $('.error-msg').show();

    // reinstate login btn
    $('#adminLoginSubmitBtn').prop('value', 'LOGIN');
    $('#adminLoginSubmitBtn').prop('disabled', false);

  }

}

// updates admin user session
function updateAdminUserSession (adminUser) {

  // get user session info from express route
  const settings = {
    url: '/updateAdminUser/',
    data: adminUser,
    type: 'GET',
    fail: showAjaxError
  };

  return $.ajax(settings);

}

// get user session info from express route
function getAdminSessionInfo () {
  const settings = {
    url: '/getAdminUser/',
    type: 'GET',
    fail: showAjaxError
  };

  return $.ajax(settings);
}

// makes all calls to admin service
function callAdminService (data) {

  const settings = {
    url: 'https://services.bannerstack.com/admin.cfc',
    data: data,
    dataType: 'json',
    type: 'GET',
    fail: showAjaxError
  }

  return $.ajax(settings);

}

$(initAdmin)
