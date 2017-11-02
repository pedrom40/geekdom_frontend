// get the order ID to start the process
function initOrder () {

  // get current view
  const currentPath = window.location.pathname;

  // if this is not an admin page
  if (currentPath.search('admin') === -1) {
    getOrderId();
  }

}

// isolate order id, then send to display function
function getOrderId () {

  // turn url params into array
  const urlData = window.location.search.toString().split('=');

  // get order
  qData = {
    method: 'getNewOrderDetails',
    orderId: urlData[1]
  }
  callOrderService(qData).then( (data) => {
    displayOrderInfo(data);
  });

}

// displays all order info
function displayOrderInfo (order) {

  // display order info
  displayMainOrderInfo(order[0]);

  // display cart items
  displayCartItems(order[1]);

  // display payment info
  displayPaymentInfo(order[2]);

}
function displayMainOrderInfo (mainOrderInfo) {

  // send info to html
  $('#order-date').html(`${mainOrderInfo.purchase_date}`);
  $('#order-number').html(`${mainOrderInfo.order_number}`);
  $('#user-name').html(`${mainOrderInfo.customer_name}`);
  $('#user-email').html(`${mainOrderInfo.email}`);
  $('#user-phone').html(`${mainOrderInfo.phone}`);
  $('#order-comments').html(`${mainOrderInfo.comments}`);

}
function displayCartItems (cartInfo) {

  // loop thru items
  cartInfo.map( (cartItem, index) => {

    let specs = '';
    if (cartItem.product_specs !== '') {
      specs = `<p>${cartItem.product_specs.replace(/; /g, '<br>')}</p>`;
    }

    let productImgSrc = `https://static.bannerstack.com/img/products/${cartItem.product_thumb}`;
    if (cartItem.template_preview !== '') {
      productImgSrc = cartItem.template_preview;
    }

    const template = `
      <div class="row cart-contents">
        <div class="column column-25 product-name">
          <img src="${productImgSrc}" alt="${cartItem.product_name}">
        </div>
        <div class="column column-75">
          <h5>${cartItem.product_name}</h5>
          <div class="row">
            <div class="column">
              ${specs}
              <label>Quantity: ${cartItem.product_quantity}</label>
              <label>Price: $${cartItem.product_price}</label>
            </div>
            <div class="column">
              <label>Ship to</label>
              <p>
                <em>${cartItem.shipping_name}</em><br>
                ${cartItem.shipping_address}<br>
                ${cartItem.shipping_city}, ${cartItem.shipping_state} ${cartItem.shipping_zip}<br>
                <em>(${cartItem.shipping_service})</em>
              </p>
            </div>
          </div>
        </div>
      </div>
      <hr>
    `;

    $('.js-cart-display').append(template);

  });
}
function displayPaymentInfo (customerInfo) {

  // send info to html
  $('#transation-id').html(`${customerInfo.charge_id}`);
  $('#card-name').html(`${customerInfo.card_name}`);
  $('#card-info').html(`${customerInfo.card_type} (${customerInfo.card_last_four})`);

  const dollarAmt = customerInfo.total_charge / 100;
  $('#card-charge').html(`$${dollarAmt}`);

}

// runs when user clicks "Place Order" btn
function placeOrder (amountToCharge) {

  // get user info for cart token
  getUserSessionInfo()
    .then( (data) => {

      // pass to DB for processing
      const qData = {
        method:'chargeCard',
        amountToCharge: amountToCharge,
        cardToken: data.cardToken
      }
      callCartService(qData).then( data => {
        handleChargeResult(data);
      });

    });

}
function handleChargeResult (data) {
  const jsonResponse = JSON.parse(data);

  // if error
  if (jsonResponse.hasOwnProperty("error")) {

    // display error msg
    $('.js-error-msg').html(`${jsonResponse.error.message}`);
    $('.js-error-msg').show();

  }

  // no errors
  else {

    // save order details
    saveOrder(jsonResponse);

  }

}

// runs when charge to card was successful, saves main order info, order items and payment info to Db
function saveOrder (chargeInfo) {

  // var to hold order ID
  let orderId = 0;
  let qData = {};

  // get user session info
  getUserSessionInfo().then( data => {

    // pass to service to save to DB
    qData = {
      method: 'saveOrderToDb',
      chargeDesc: chargeInfo.description,
      userName: data.name,
      userEmail: data.email,
      userPhone: data.phone
    }
    callCartService(qData).then( data => {

      // parse JSON string from CF service
      data = JSON.parse(data);

      // if error
      if (data.orderId === 0) {

        // display error msg
        showErrorMsg(data.errorMsg);

      }

      // no errors
      else {

        // save new order ID
        orderId = data.orderId;

        // get cart items
        getExpressCartContents().then( cartItems => {

          // convert to string for CF
          const newCartArray = rebuildArrayOfObjectsForColdfusion(cartItems);

          // pass to service to save order items
          qData = {
            method:'saveOrderItemsToDb',
            orderId: orderId,
            cartItems: newCartArray
          }
          callCartService(qData).then( data => {

            // if error
            if (data !== 'success') {

              // display error msg
              showErrorMsg(data);

            }

            // no errors
            else {

              // take out items we're saving
              let chargeInfoToSend = {
                order_id: orderId,
                total_charge: chargeInfo.amount,
                balance_transaction: chargeInfo.balance_transaction,
                created: chargeInfo.created,
                description: chargeInfo.description,
                charge_id: chargeInfo.id,
                card_id: chargeInfo.source.id,
                card_type: chargeInfo.source.brand,
                card_name: chargeInfo.source.name,
                card_address: chargeInfo.source.address_line1,
                card_city: chargeInfo.source.address_city,
                card_state: chargeInfo.source.address_state,
                card_zip: chargeInfo.source.address_zip,
                card_country: chargeInfo.source.country,
                card_exp_month: chargeInfo.source.exp_month,
                card_exp_year: chargeInfo.source.exp_year,
                card_last_four: chargeInfo.source.last4,
                fingerprint: chargeInfo.source.fingerprint
              }

              // save payment info to Db
              qData = {
                method: 'saveOrderPaymentInfoToDb',
                chargeInfo: JSON.stringify(chargeInfoToSend)
              }
              callCartService(qData).then( (data) => {

                // if error
                if (data !== 'success') {

                  // display error msg
                  showErrorMsg(data);

                }

                // no errors
                else {

                  // go to confirmation page
                  window.location.assign(`/confirmation/?orderId=${orderId}`);

                }

              });

            }

          });

        });

      }

    });

  });

}

// makes all calls to orders.cfc
function callOrderService (data) {

  var settings = {
    url: 'https://services.bannerstack.com/orders.cfc',
    data: data,
    dataType: 'json',
    type: 'GET',
    fail: showAjaxError
  }

  return $.ajax(settings);

}

$(initOrder)
