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

  // if product categories list view requested
  else if (viewRequested === '/admin/categories') {

    // load admin users view
    loadCategories();

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
function handleLoginResponse (loginResponse) {

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
    showErrorMsg(loginResponse.msg);

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


/** admin views **/

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
                <td class="admin-options">
                  <a href="#" title="Edit User"><i id="admin-edit-btn_${adminUser[0]}" class="fa fa-pencil" aria-hidden="true"></i></a>
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

// product categories
function loadCategories () {

  // setup member display
  callProductsService({method: 'getCategories'})
    .then( categories => {

      // markup category rows
      let categorRowsHtml = '';
      categories.map( category => {

        // setup value for featured
        let categoryFeaturedStatus = '';
        if (category[3] === 1) {
          categoryFeaturedStatus = 'Yes';
        }
        else {
          categoryFeaturedStatus = 'No';
        }

        // setup value for active
        let categoryActiveStatus = '';
        if (category[4] === 1) {
          categoryActiveStatus = 'Yes';
        }
        else {
          categoryActiveStatus = 'No';
        }

        // add the rows to the HTML placeholder
        categorRowsHtml = `${categorRowsHtml}
          <tr>
            <td><img src="https://static.bannerstack.com/img/categories/${category[2]}"></td>
            <td>${category[1]}</td>
            <td>${categoryFeaturedStatus}</td>
            <td>${categoryActiveStatus}</td>
            <td class="admin-options">
              <a href="#" title="Edit"><i id="category-edit-btn_${category[0]}" class="fa fa-pencil" aria-hidden="true"></i></a>
              <a href="#" title="Delete"><i id="category-delete-btn_${category[0]}" class="fa fa-trash" aria-hidden="true"></i></a>
            </td>
          </tr>
        `;
      });

      // start fresh
      $('.js-admin-placeholder').empty();

      // markup search form
      const categorySearchForm = `
        <div class="row">
          <div class="column">
            <label for="categorySearchTerm" class="sr-only">Category Search Term</label>
            <input type="text" id="categorySearchTerm" placeholder="Search by Name">
          </div>
        </div>
      `;

      // markup category form
      const categoryForm = `
        <form class="js-admin-category-form" enctype="multipart/form-data">

          <label for="categoryName">Name:</label>
          <input type="text" id="categoryName" placeholder="New Category" required>

          <div id="categoryImgHolder"></div>
          <label for="categoryThumb">Thumbnail:</label>
          <input type="file" id="fileupload" name="file" placeholder="jpg, gif and png files (RGB only)">
          <div id="progress">
            <div id="bar"></div>
          </div>

          <label for="categoryShortDesc">Short Description:</label>
          <input type="text" id="categoryShortDesc" placeholder="Short description" required>

          <label for="categoryLongDesc">Long Description:</label>
          <textarea id="categoryLongDesc" placeholder="Detailed category description"></textarea>

          <label for="categoryFeatured">Featured:</label>
          <select id="categoryFeatured">
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>

          <label for="categoryActive">Active:</label>
          <select id="categoryActive">
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>

          <input type="submit" id="categorySubmit" value="Add">
          <input type="hidden" id="categoryId">
          <input type="hidden" id="categoryThumb">

        </form>
      `;

      // markup display
      const displayHtml = `
        <div class="row">
          <div class="column">
            <h4>Categories</h4>

            ${categorySearchForm}
            <table>
              <thead>
                <tr>
                  <th>Thumb</th>
                  <th>Name</th>
                  <th>Featured</th>
                  <th>Active</th>
                  <th>Options</th>
                </tr>
              </thead>
              <tbody>
                ${categorRowsHtml}
              </tbody>
            </table>
          </div>
          <div class="column column-10"></div>
          <div class="column column-33">
            <h4 class="js-form-title">Add Category</h4>
            ${categoryForm}
          </div>
        </div>
      `;

      // load markup to page
      $('.js-admin-placeholder').html(displayHtml);

      // setup listeners
      listenForAdminActions();

      // init file upload listener
      const uploadData = {
        methodUrl: 'products.cfc?method=uploadCategoryPic',
        imgNamePlaceholder: '#categoryThumb',
        imgPreviewContainer: '#categoryImgHolder',
        imgUrl: 'https://static.bannerstack.com/img/categories'
      }
      listenForFileUploads(uploadData);

    });

}

// listens for admin user edit/delete btn clicks and admin form submits
function listenForAdminActions () {

  $('.js-admin-placeholder').click( event => {

    // if this is not a file input
    if (event.target.id !== 'fileupload') {

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


      // if category edit click
      else if (event.target.id.search('category-edit-btn') !== -1) {
        const categoryId = event.target.id.toString().split('_');
        editCategory(categoryId[1]);
      }

      // if category delete click
      else if (event.target.id.search('category-delete-btn') !== -1) {
        const categoryId = event.target.id.toString().split('_');
        deleteCategory(categoryId[1]);
      }

      // for category form submits
      else if (event.target.id === 'categorySubmit') {
        handleCategoryFormSubmit();
      }

    }

  });

}

// add/edit/delete admin user
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
          loadAdminUsers();
        }

        // if not
        else {
          showErrorMsg(response);
        }

      });

  }
  else {
    return false;
  }

}
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
          loadAdminUsers();
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
          loadAdminUsers();
        }

        // if not
        else {

          // display error
          showErrorMsg(response);

        }

      });
  }

}

// edit/delete category
function editCategory (categoryId) {

  // get user info
  callProductsService({
    method: 'getCategory',
    categoryId: categoryId
  })
    .then( category => {

      // update form content
      $('#categoryId').val(category[0]);
      $('#categoryName').val(category[1]);
      $('#categoryImgHolder').html(`<img src="https://static.bannerstack.com/img/categories/${category[2]}">`);
      $('#categoryShortDesc').val(category[3]);
      $('#categoryLongDesc').val(category[4]);
      $('#categoryFeatured').val(category[5]);
      $('#categoryActive').val(category[6]);

      // change for title and submit text
      $('.js-form-title').html('Edit Category');
      $('#categorySubmit').val('EDIT');

    });

}
function deleteCategory (categoryId) {

  // confirm delete
  const confirmDelete = confirm('Delete this Category?');

  // on confirm
  if (confirmDelete) {

    // get user info
    callProductsService({
      method: 'deleteCategory',
      categoryId: categoryId
    })
      .then( response => {

        // if successful
        if (response === 'success') {
          loadCategories();
        }

        // if not
        else {
          showErrorMsg(response);
        }

      });

  }
  else {
    return false;
  }

}
function handleCategoryFormSubmit () {

  const formAction = $('#categorySubmit').val();

  // add category
  if (formAction === 'Add') {

    // send info to service
    callProductsService({
      method: 'addCategory',
      categoryName: $('#categoryName').val(),
      categoryThumb: $('#categoryThumb').val(),
      categoryShortDesc: $('#categoryShortDesc').val(),
      categoryLongDesc: $('#categoryLongDesc').val(),
      categoryFeatured: $('#categoryFeatured').val(),
      categoryActive: $('#categoryActive').val()
    })
      .then( response => {

        // if successful, reload page
        if (response === 'success') {
          loadCategories();
        }

        // if not
        else {

          // display error
          showErrorMsg(response);

        }

      });

  }

  // edit category
  else {

    // send info to service
    callProductsService({
      method: 'editCategory',
      categoryId: $('#categoryId').val(),
      categoryName: $('#categoryName').val(),
      categoryThumb: $('#categoryThumb').val(),
      categoryShortDesc: $('#categoryShortDesc').val(),
      categoryLongDesc: $('#categoryLongDesc').val(),
      categoryFeatured: $('#categoryFeatured').val(),
      categoryActive: $('#categoryActive').val()
    })
      .then( response => {

        // if successful, reload page
        if (response === 'success') {
          loadCategories();
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
