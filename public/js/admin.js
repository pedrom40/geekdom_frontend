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

      // if on login page
      else {

        // make for active by listening for submit
        listenForAdminLoginSubmit();

      }

    });

}

// called when login form submitted
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

// find out what view the user wants
function getViewRequested (viewRequested) {

  // if dashboard view requested
  if (viewRequested === '/admin/dashboard') {

    // load dashboard
    loadAdminDashboard();

  }

  // if admin users list view requested
  else if (viewRequested === '/admin/users') {

    // load admin users view
    loadAdminUsers();

  }

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
      .then( userResponse => {

        // send user to dashboard
        window.location.assign('/admin/dashboard');

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

/* admin views */

// dashboard
function loadAdminDashboard () {

  // setup order display
  let orderRowsHtml = '';
  callOrderService({method: 'getOrders'})
    .then( orders => {

      // markup order rows
      orders.map( order => {
        orderRowsHtml = `${orderRowsHtml}
          <tr>
            <td>${order[0]}</td>
            <td>${order[2]}</td>
            <td>${order[1]}</td>
            <td>${order[3]}</td>
            <td>${order[4]}</td>
          </tr>`;
      });

      // start fresh
      $('.js-admin-placeholder').empty();

      // markup search form
      const searchForm = `
        <div class="row">
          <div class="column">
            <label for="fromDate">From:</label>
            <input type="date" id="fromDate" placeholder="mm/dd/yyyy">
          </div>
          <div class="column">
            <label for="toDate">To:</label>
            <input type="date" id="toDate" placeholder="mm/dd/yyyy">
          </div>
          <div class="column">
            <label for="orderStatus">Status:</label>
            <select id="orderStatus">
              <option value="">All</option>
            </select>
          </div>
          <div class="column">
            <label for="orderNumber">Order #:</label>
            <input type="text" id="orderNumber" placeholder="XXX-XXXXXX">
          </div>
          <div class="column">
            <label for="products">Products:</label>
            <select id="products">
              <option value="">All</option>
            </select>
          </div>
        </div>
      `;

      // markup display
      const recentOrderList = `
        <div class="row">
          <div class="column">

            <h4>Orders</h4>

            ${searchForm}
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Order</th>
                  <th>Email</th>
                  <th>Phone</th>
                </tr>
              </thead>
              <tbody>
                ${orderRowsHtml}
              </tbody>
            </table>

          </div>
        </div>
      `;

      // start fresh
      $('.js-admin-placeholder').html(recentOrderList);

    });

}

// users
function loadAdminUsers () {

  // setup member display
  callUserService({method: 'getMembers'})
    .then( members => {

      // markup order rows
      let memberRowsHtml = '';
      members.map( member => {
        memberRowsHtml = `${memberRowsHtml}
          <tr>
            <td>${member[0]}</td>
            <td>${member[1]}</td>
            <td>${member[2]}</td>
            <td>${member[3]}</td>
          </tr>
        `;
      });

      // markup admin rows
      let adminRowsHtml = '';
      callUserService({method: 'getAdminUsers'})
        .then( adminUsers => {

          adminUsers.map( adminUser => {
            adminRowsHtml = `${adminRowsHtml}
              <tr>
                <td>${adminUser[1]}</td>
                <td class="admin-users-options">
                  <a href="#" title="Edit User"><i id="admin-edit-btn_${adminUser[0]}" class="fa fa-pencil" aria-hidden="true"></i></a> |
                  <a href="#" title="Delete User"><i id="admin-delete-btn_${adminUser[0]}" class="fa fa-trash" aria-hidden="true"></i></a>
                </td>
              </tr>
            `;
          });

          // start fresh
          $('.js-admin-placeholder').empty();

          // markup search form
          const memberSearchForm = `
            <div class="row">
              <div class="column">
                <label for="memberSearchTerm" class="sr-only">Member Search Term</label>
                <input type="text" id="memberSearchTerm" placeholder="Search by Name, Email or Phone">
              </div>
            </div>
          `;

          // markup admin form
          const adminForm = `
            <form class="js-admin-user-form">

              <label for="adminName">Name:</label>
              <input type="text" id="adminName" placeholder="New Guy" required>

              <label for="adminEmail">Email:</label>
              <input type="email" id="adminEmail" placeholder="new@guy.com" required>

              <label for="adminPassword">Password:</label>
              <input type="password" id="adminPassword" placeholder="******" required>

              <input type="submit" id="adminSubmit" value="Add">
              <input type="hidden" id="adminId">

            </form>
          `;

          // markup display
          const displayHtml = `
            <div class="row">
              <div class="column">
                <h4>Members</h4>

                ${memberSearchForm}
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
                    ${memberRowsHtml}
                  </tbody>
                </table>
              </div>
              <div class="column column-10"></div>
              <div class="column">
                <h4>Admin</h4>
                <table class="js-admin-table">
                  <tbody>
                    ${adminRowsHtml}
                  </tbody>
                </table>

                <br><h4 class="js-admin-form-title">Add Admin</h4>
                ${adminForm}
              </div>
            </div>
          `;

          // load markup to page
          $('.js-admin-placeholder').html(displayHtml);

        });

    });

  // setup listeners
  listenForAdminActions();

}

// listens for admin user edit/delete btn clicks and admin form submits
function listenForAdminActions () {

  $('.js-admin-placeholder').click( event => {
    event.preventDefault();

    // for admin user edit click
    if (event.target.id.search('admin-edit-btn') !== -1) {
      const adminUserId = event.target.id.toString().split('_');
      editAdminUser(adminUserId[1]);
    }

    // if admin user delete click
    else if (event.target.id.search('admin-delete-btn') !== -1) {
      const adminUserId = event.target.id.toString().split('_');
      deleteAdminUser(adminUserId[1]);
    }

    // for admin form submits
    else if (event.target.id === 'adminSubmit') {
      handleAdminUserFormSubmit();
    }

  });

}

// edit admin user
function editAdminUser (adminUserId) {

  // get user info
  callUserService({
    method: 'getAdminUser',
    adminUserId: adminUserId
  })
    .then( adminUser => {

      // update form content
      $('#adminId').val(adminUser[0]);
      $('#adminName').val(adminUser[1]);
      $('#adminEmail').val(adminUser[2]);

      // change for title and submit text
      $('.js-admin-form-title').html('Edit Admin');
      $('#adminSubmit').val('EDIT');

    });

}

// delete admin user
function deleteAdminUser (adminUserId) {

  // confirm delete
  const confirmDelete = confirm('Delete this Admin User?');

  // on confirm
  if (confirmDelete) {

    // get user info
    callUserService({
      method: 'deleteAdminUser',
      adminUserId: adminUserId
    })
      .then( response => {

        // if successful
        if (response === 'success') {
          window.location.assign('/admin/users');
        }

        // if not
        else {
          showErrorMsg(response);
        }

      });
  }

}

// handle admin user form submit
function handleAdminUserFormSubmit () {

  const formAction = $('#adminSubmit').val();

  // add admin user
  if (formAction === 'Add') {

    // send info to service
    callUserService({
      method: 'addAdminUser',
      adminName: $('#adminName').val(),
      adminEmail: $('#adminEmail').val(),
      adminPassword: $('#adminPassword').val()
    })
      .then( response => {

        // if successful, reload page
        if (response === 'success') {
          window.location.assign('/admin/users');
        }

        // if not
        else {

          // display error
          showErrorMsg(response);

        }

      });

  }

  // edit admin user
  else {

    // send info to service
    callUserService({
      method: 'editAdminUser',
      adminId: $('#adminId').val(),
      adminName: $('#adminName').val(),
      adminEmail: $('#adminEmail').val(),
      adminPassword: $('#adminPassword').val()
    })
      .then( response => {

        // if successful, reload page
        if (response === 'success') {
          window.location.assign('/admin/users');
        }

        // if not
        else {

          // display error
          showErrorMsg(response);

        }

      });
  }

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
