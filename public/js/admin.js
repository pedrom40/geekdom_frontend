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

        // if on login page
        if (window.location.pathname === '/admin/login') {
          window.location.assign('/admin/dashboard');
        }

        else {

          // show nav
          $('#admin-menu-container').show();

          // get view requested
          getViewRequested(viewRequested);

        }

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

  // if order statuses view requested
  else if (viewRequested === '/admin/orderStatuses') {

    // load view
    loadOrderStatuses();

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

        // init order total
        let orderTotal = 0;

        // loop over order items
        let orderItems = '';
        order[6].map( item => {

          orderTotal = Number(orderTotal) + Number(item[6]);

          // setup tracking number
          let trackingNumber = item[5];
          if (item[5] === ''){
            trackingNumber = 'N/A';
          }

          orderItems = `${orderItems}
            <tr>
              <td>${item[1]}</td>
              <td>${item[2]}</td>
              <td>${item[3]}</td>
              <td>${item[4]}</td>
              <td>${trackingNumber}</td>
              <td>$${Number(item[6]).toFixed(2)}</td>
            </tr>
          `;
        });

        orderRowsHtml = `${orderRowsHtml}
          <tr>
            <td>${order[1]}</td>
            <td>${order[2].toUpperCase()}</td>
            <td>${order[3]}</td>
            <td>
              ${order[4]}<br>
              ${order[5]}
            </td>
            <td class="admin-options">
              <a href="#" title="View Items" id="order_${order[0]}" class="js-order-row"><i id="order-view-btn_${order[0]}" class="fa fa-eye" aria-hidden="true"></i></a>
              <a href="#" title="Edit" style="padding-right:15px"><i id="order-edit-btn_${order[0]}" class="fa fa-pencil" aria-hidden="true"></i></a>
              <a href="#" title="Delete"><i id="order-delete-btn_${order[0]}" class="fa fa-trash" aria-hidden="true"></i></a>
            </td>
          </tr>
          <tr class="js-item-row_${order[0]}" style="display:none;">
            <td colspan="5" class="item-row">
              <table>
                <thead>
                  <th>Product</th>
                  <th>Qty.</th>
                  <th>Ship To</th>
                  <th>Service</th>
                  <th>Tracking No.</th>
                  <th>Price</th>
                </thead>
                <tbody>
                  ${orderItems}
                </tbody>
              </table>
            <td>
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
            <table class="member-orders">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Email/Phone</th>
                  <th style="width:100px;">Options</th>
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

      // listen for order row clicks
      listenForAdminActions();

    });

}
function editOrder (orderId) {

  // reset main content
  $('.js-admin-placeholder').empty();

  // get order details
  const data = {
    method: 'getOrderDetails',
    orderId: orderId
  }
  callOrderService(data)
    .then( order => {console.log(order);

      // convert cents to dollars
      const totalCharge = Number(order[2].total_charge) / 100;

      // setup comments
      let comments = '';
      if (order[0].comments !== '') {
        comments = `<p><strong>Comments:</strong> ${order[0].comments}</p>`;
      }

      // markup main order data
      const mainOrderData = `
        <div class="row">
          <div class="column">
            <strong>Order:</strong><br>
            ${order[0].order_number.toString().toUpperCase()}<br>
            ${order[0].purchase_date}
            ${comments}
          </div>
          <div class="column">
            <strong>Customer:</strong><br>
            <em>${order[0].customer_name}</em><br>
            ${order[0].email}<br>
            ${order[0].phone}
          </div>
          <div class="column">
            <strong>Payment Info:</strong><br>
            <em>${order[2].card_name}</em><br>
            <em>Card:</em> ${order[2].card_type} (${order[2].card_last_four})<br>
            <em>Total Charge:</em> $${totalCharge}
          </div>
        </div>
      `;

      // loop over order items
      let orderItems = '';
      let selectedOrderStatus = [];
      let selectedOrderStatusId = [];
      order[1].map( item => {

        // setup tracking number
        let trackingNumber = '';
        if (item.tracking_number !== ''){
          trackingNumber = `: ${item.tracking_number}`;
        }

        // setup selected status
        selectedOrderStatus.push(item.order_status);
        selectedOrderStatusId.push(item.item_id);

        // markup order item row
        orderItems = `${orderItems}
          <tr>
            <td>
              ${item.product_name}
              <input type="hidden" name="itemId" value="${item.item_id}">
            </td>
            <td><input type="number" id="productQty_${item.item_id}" name="productQuantity" value="${item.product_quantity}" class="orderQty"></td>
            <td><select id="orderStatus_${item.item_id}" name="orderStatus" class="orderStatus"></select></td>
            <td>
              <div id="shippingInfo_${item.item_id}" class="shipping-info-container js-shipping-info-block">
                <span id="shippingName_${item.item_id}">${item.shipping_name}</span><br>
                <span id="shippingAddress_${item.item_id}">${item.shipping_address}</span><br>
                <span id="shippingCity_${item.item_id}">${item.shipping_city}</span>,
                <span id="shippingState_${item.item_id}">${item.shipping_state}</span>
                <span id="shippingZip_${item.item_id}">${item.shipping_zip}</span><br>
                <em>(${item.shipping_service}${trackingNumber})</em>
              </div>
              <div id="shippingInfoForm_${item.item_id}" style="display:none;">
                <input type="text" id="shipping_name_${item.item_id}" name="shippingName">
                <input type="text" id="shipping_address_${item.item_id}" name="shippingAddress">
                <div class="row">
                  <div class="column column-40"><input type="text" id="shipping_city_${item.item_id}" name="shippingCity"></div>
                  <div class="column"><input type="text" id="shipping_state_${item.item_id}" name="shippingState"></div>
                  <div class="column"><input type="text" id="shipping_zip_${item.item_id}" name="shippingZip"></div>
                </div>
                <a href="#" id="shippingInfoCancel_${item.item_id}" class="button button-outline js-shipping-info-cancel-btn">Cancel</a>
              </div>
            </td>
            <td>$${Number(item.product_price).toFixed(2)}</td>
          </tr>
        `;

      });

      // setup form
      const orderForm = `
        <form name="orderForm" class="js-admin-order-form">
          <table>
            <thead>
              <th style="width:175px;">Product</th>
              <th>Qty.</th>
              <th>Status</th>
              <th>Ship To</th>
              <th>Price</th>
            </thead>
            <tbody>
              ${orderItems}
            </tbody>
          </table>
          <div class="row">
            <div class="column">
              <input type="submit" id="orderUpdateSubmit" value="Submit">
            </div>
            <div class="column">
              <button onclick="loadAdminDashboard()">Cancel</button>
            </div>
          </div>

          <input type="hidden" id="orderId" value="${order[0].id}">
          <input type="hidden" id="orderItems" value="${order[1].length}">
        </form>
      `;

      // main container
      const template = `
        <h2>Order Info</h3>

        ${mainOrderData}
        <hr>
        ${orderForm}
      `;

      // send HTML to view
      $('.js-admin-placeholder').append(template);

      // setup status select
      setupOrderStatusSelect(selectedOrderStatusId, selectedOrderStatus);

      // listen for shipping update clicks
      listenForShippingUpdateClicks();

      // listen for shipping update cancel clicks
      listenForShippingUpdateCancelClicks();

      // setup listeners
      listenForAdminActions();

    })
    .fail( err => console.log(err));

}
function setupOrderStatusSelect (objId, selectedValue) {

  for (let i=0; i < objId.length; i++) {

    const data = {
      method: 'getActiveOrderStatuses'
    }
    callOrderService(data)
      .then( orderStatuses => {

        orderStatuses.map( status => {

          if (status[1] === selectedValue[i]) {
            $(`#orderStatus_${objId[i]}`).append(`
              <option value="${status[1]}" selected>${status[1]}</option>
            `);
          }
          else {
            $(`#orderStatus_${objId[i]}`).append(`
              <option value="${status[1]}">${status[1]}</option>
            `);
          }

        });

      })
      .fail( err => {
        console.log(err);
      });

  }

}
function listenForShippingUpdateClicks () {

  $('.js-shipping-info-block').click( event => {
    event.preventDefault();

    // isolate id
    const blockId = event.target.id.split('_');

    // copy values over
    $(`#shipping_name_${blockId[1]}`).val( $(`#shippingName_${blockId[1]}`).html() );
    $(`#shipping_address_${blockId[1]}`).val( $(`#shippingAddress_${blockId[1]}`).html() );
    $(`#shipping_city_${blockId[1]}`).val( $(`#shippingCity_${blockId[1]}`).html() );
    $(`#shipping_state_${blockId[1]}`).val( $(`#shippingState_${blockId[1]}`).html() );
    $(`#shipping_zip_${blockId[1]}`).val( $(`#shippingZip_${blockId[1]}`).html() );

    // show form
    $(`#shippingInfo_${blockId[1]}`).hide();
    $(`#shippingInfoForm_${blockId[1]}`).show();

  });

}
function listenForShippingUpdateCancelClicks () {

  $('.js-shipping-info-cancel-btn').click( event => {
    event.preventDefault();

    // isolate id
    const blockId = event.target.id.split('_');

    // empty out form values
    $(`#shipping_name_${blockId[1]}`).val('');
    $(`#shipping_address_${blockId[1]}`).val('');
    $(`#shipping_city_${blockId[1]}`).val('');
    $(`#shipping_state_${blockId[1]}`).val('');
    $(`#shipping_zip_${blockId[1]}`).val('');

    $(`#shippingInfo_${blockId[1]}`).show();
    $(`#shippingInfoForm_${blockId[1]}`).hide();

  });

}
function deleteOrder (orderId) {

  // confirm delete
  const confirmDelete = confirm('Delete this Order?');

  // on confirm
  if (confirmDelete) {

    // get user info
    callOrderService({
      method: 'deleteOrder',
      orderId: orderId
    })
      .then( response => {

        // if successful
        if (response === 'success') {
          loadAdminDashboard();
        }

        // if not
        else {
          showErrorMsg(response);
        }

      });

  }
}
function handleOrderUpdateFormSubmit () {

  // number of loops to run
  const orderItems = Number($('#orderItems').val());

  // init item loop
  let items = []

  // if only 1 item
  if (orderItems === 1) {

    const item = {
      itemId: document.orderForm.itemId.value,
      productQty: document.orderForm.productQuantity.value,
      orderStatus: document.orderForm.orderStatus.value,
      shippingName: document.orderForm.shippingName.value,
      shippingAddress: document.orderForm.shippingAddress.value,
      shippingCity: document.orderForm.shippingCity.value,
      shippingState: document.orderForm.shippingState.value,
      shippingZip: document.orderForm.shippingZip.value
    }

    items.push(item);

  }

  else {

    // go thru the loop
    for (let i=0; i < orderItems; i++) {

      const item = {
        itemId: document.orderForm.itemId[i].value,
        productQty: document.orderForm.productQuantity[i].value,
        orderStatus: document.orderForm.orderStatus[i].value,
        shippingName: document.orderForm.shippingName[i].value,
        shippingAddress: document.orderForm.shippingAddress[i].value,
        shippingCity: document.orderForm.shippingCity[i].value,
        shippingState: document.orderForm.shippingState[i].value,
        shippingZip: document.orderForm.shippingZip[i].value
      }

      items.push(item);

    }

  }

  // setup form data collection
  const orderData = {
    method: 'editOrder',
    orderId: $('#orderId').val(),
    items: JSON.stringify(items)
  }
  callOrderService(orderData)
    .then( response => {

      // if successful, reload page
      if (response === 'success') {
        loadAdminDashboard();
      }

      // if not
      else {

        // display error
        showErrorMsg(response);

      }

    })
    .fail( err => console.log(err));

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

      // if order status edit click
      else if (event.target.id.search('orderStatus-edit-btn') !== -1) {
        const orderStatusId = event.target.id.toString().split('_');
        editOrderStatus(orderStatusId[1]);
      }

      // if order status delete click
      else if (event.target.id.search('orderStatus-delete-btn') !== -1) {
        const orderStatusId = event.target.id.toString().split('_');
        deleteOrderStatus(orderStatusId[1]);
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

      // if order view click
      else if (event.target.id.search('order-view-btn') !== -1) {
        const orderId = event.target.id.toString().split('_');
        $(`.js-item-row_${orderId[1]}`).toggle();
      }

      // if order edit click
      else if (event.target.id.search('order-edit-btn') !== -1) {
        const orderId = event.target.id.toString().split('_');
        editOrder(orderId[1]);
      }

      // if order delete click
      else if (event.target.id.search('order-delete-btn') !== -1) {
        const orderId = event.target.id.toString().split('_');
        deleteOrder(orderId[1]);
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

      // for order status form submits
      else if (event.target.id === 'orderStatusSubmit') {
        $('#orderStatusSubmit').attr('disabled', 'disabled');
        handleOrderStatusFormSubmit();
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

      // for order form submits
      else if (event.target.id === 'orderSubmit') {
        $('#orderSubmit').attr('disabled', 'disabled');
        handleOrderFormSubmit();
      }

      // for order update form submits
      else if (event.target.id === 'orderUpdateSubmit') {
        $('#orderUpdateSubmit').attr('disabled', 'disabled');
        handleOrderUpdateFormSubmit();
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
