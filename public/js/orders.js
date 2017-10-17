// get the order ID to start the process
function initOrder () {

  getOrderId();

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

    const template = `
      <div class="row cart-contents">
        <div class="column column-25 product-name">
          <img src="https://static.bannerstack.com/img/products/${cartItem.product_thumb}" alt="${cartItem.product_name}">
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
