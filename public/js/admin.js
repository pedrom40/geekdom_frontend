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

  // if products view requested
  else if (viewRequested === '/admin/products') {

    // load view
    loadProducts();

  }

  // if categories list view requested
  else if (viewRequested === '/admin/categories') {

    // load admin users view
    loadCategories();

  }

  // if printer list view requested
  else if (viewRequested === '/admin/printers') {

    // load printers view
    loadPrinters();

  }

  // if media list view requested
  else if (viewRequested === '/admin/media') {

    // load media view
    loadMedias();

  }

  // if flat charge list view requested
  else if (viewRequested === '/admin/flat-charges') {

    // load flat charges view
    loadFlatCharges();

  }

  // if turnaround list view requested
  else if (viewRequested === '/admin/turnarounds') {

    // load turnarounds view
    loadTurnarounds();

  }

  // if finishing list view requested
  else if (viewRequested === '/admin/finishing') {

    // load finishings view
    loadFinishings();

  }

  // if artwork option list view requested
  else if (viewRequested === '/admin/artwork-options') {

    // load artwork options view
    loadArtworkOptions();

  }

  // if size list view requested
  else if (viewRequested === '/admin/sizes') {

    // load size view
    loadSizes();

  }

  // if image list view requested
  else if (viewRequested === '/admin/images') {

    // load size view
    loadImages();

  }

}

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

// listens for admin user edit/delete btn clicks and admin form submits
function listenForAdminActions () {

  // remove any existing listeners for this
  $('.js-admin-placeholder').off();

  // create new click listener
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
        $('#adminSubmit').attr('disabled', 'disabled');
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

      // if printer edit click
      else if (event.target.id.search('printer-edit-btn') !== -1) {
        const printerId = event.target.id.toString().split('_');
        editPrinter(printerId[1]);
      }

      // if printer delete click
      else if (event.target.id.search('printer-delete-btn') !== -1) {
        const printerId = event.target.id.toString().split('_');
        deletePrinter(printerId[1]);
      }

      // if media edit click
      else if (event.target.id.search('media-edit-btn') !== -1) {
        const mediaId = event.target.id.toString().split('_');
        editMedia(mediaId[1]);
      }

      // if media delete click
      else if (event.target.id.search('media-delete-btn') !== -1) {
        const mediaId = event.target.id.toString().split('_');
        deleteMedia(mediaId[1]);
      }

      // if flat charge edit click
      else if (event.target.id.search('flatCharge-edit-btn') !== -1) {
        const flatChargeId = event.target.id.toString().split('_');
        editFlatCharge(flatChargeId[1]);
      }

      // if flat charge delete click
      else if (event.target.id.search('flatCharge-delete-btn') !== -1) {
        const flatChargeId = event.target.id.toString().split('_');
        deleteFlatCharge(flatChargeId[1]);
      }

      // if turnaround edit click
      else if (event.target.id.search('turnaround-edit-btn') !== -1) {
        const turnaroundId = event.target.id.toString().split('_');
        editTurnaround(turnaroundId[1]);
      }

      // if turnaround delete click
      else if (event.target.id.search('turnaround-delete-btn') !== -1) {
        const turnaroundId = event.target.id.toString().split('_');
        deleteTurnaround(turnaroundId[1]);
      }

      // if finishing edit click
      else if (event.target.id.search('finishing-edit-btn') !== -1) {
        const finishingId = event.target.id.toString().split('_');
        editFinishing(finishingId[1]);
      }

      // if finishing delete click
      else if (event.target.id.search('finishing-delete-btn') !== -1) {
        const finishingId = event.target.id.toString().split('_');
        deleteFinishing(finishingId[1]);
      }

      // if artwork options edit click
      else if (event.target.id.search('artworkOption-edit-btn') !== -1) {
        const artworkOptionId = event.target.id.toString().split('_');
        editArtworkOption(artworkOptionId[1]);
      }

      // if artwork options delete click
      else if (event.target.id.search('artworkOption-delete-btn') !== -1) {
        const artworkOptionId = event.target.id.toString().split('_');
        deleteArtworkOption(artworkOptionId[1]);
      }

      // if size edit click
      else if (event.target.id.search('size-edit-btn') !== -1) {
        const sizeId = event.target.id.toString().split('_');
        editSize(sizeId[1]);
      }

      // if size delete click
      else if (event.target.id.search('size-delete-btn') !== -1) {
        const sizeId = event.target.id.toString().split('_');
        deleteSize(sizeId[1]);
      }

      // add new product click
      else if (event.target.id === 'js-product-add-btn') {
        addProduct();
      }

      // if product edit click
      else if (event.target.id.search('product-edit-btn') !== -1) {
        const productId = event.target.id.toString().split('_');
        editProduct(productId[1]);
      }

      // if product delete click
      else if (event.target.id.search('product-delete-btn') !== -1) {
        const productId = event.target.id.toString().split('_');
        deleteProduct(productId[1]);
      }

      // if image delete click
      else if (event.target.id.search('image-delete-btn') !== -1) {
        const imageId = event.target.id.toString().split('_');
        deleteImage(imageId[1]);
      }

      // if "claiming" an image delete click
      else if (event.target.id.search('productImg_') !== -1) {

        const imageId = event.target.id.toString().split('_');
        toggleImageSelection(imageId[1]);

      }

      // for category form submits
      else if (event.target.id === 'categorySubmit') {
        $('#categorySubmit').attr('disabled', 'disabled');
        handleCategoryFormSubmit();
      }

      // for printer form submits
      else if (event.target.id === 'printerSubmit') {
        $('#printerSubmit').attr('disabled', 'disabled');
        handlePrinterFormSubmit();
      }

      // for media form submits
      else if (event.target.id === 'mediaSubmit') {
        $('#mediaSubmit').attr('disabled', 'disabled');
        handleMediaFormSubmit();
      }

      // for flat charge form submits
      else if (event.target.id === 'flatChargeSubmit') {
        $('#flatChargeSubmit').attr('disabled', 'disabled');
        handleFlatChargeFormSubmit();
      }

      // for turnaround form submits
      else if (event.target.id === 'turnaroundSubmit') {
        $('#turnaroundSubmit').attr('disabled', 'disabled');
        handleTurnaroundFormSubmit();
      }

      // for finishing form submits
      else if (event.target.id === 'finishingSubmit') {
        $('#finishingSubmit').attr('disabled', 'disabled');
        handleFinishingFormSubmit();
      }

      // for artwork options form submits
      else if (event.target.id === 'artworkOptionSubmit') {
        $('#artworkOptionSubmit').attr('disabled', 'disabled');
        handleArtworkOptionFormSubmit();
      }

      // for size form submits
      else if (event.target.id === 'sizeSubmit') {
        $('#sizeSubmit').attr('disabled', 'disabled');
        handleSizeFormSubmit();
      }

      // for product form submits
      else if (event.target.id === 'productSubmit') {
        $('#productSubmit').attr('disabled', 'disabled');
        handleProductFormSubmit();
      }

    }

  });

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
