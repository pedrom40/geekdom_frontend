// check to see what page we're on
function initCart () {

  // if on cart or review page, call function to display cart contents
  if (window.location.pathname === '/cart/' || window.location.pathname === '/review/') {
    getCartContents();
  }

  // listen for cart form submit
  listenForCartFormSubmit();

  // listen for shipping/billing copy click
  listenForBillingCopyClick();

  // listen for "place order" clicks
  listenForOrderPlacement();

}

// show what's in the cart because we're on the cart page
function getCartContents () {
  const qData = {
    method:'getCartContents'
  }
  callCartService(qData)

    // reload cart contents
    .then( (data) => {
      displayCartContents(data);
    })

    // listen for changes in cart
    .then( () => {

      listenForQtyChangesInCart();
      listenForShippingChangesInCart();
      listenForDeleteChangesInCart();

    });
}
function displayCartContents (data) {

  $('.js-cart-display').empty();

  // if cart empty
  if (data.length === 0) {

    $('.js-cart-display').html(`<br><h4>Your cart is empty, keep shopping</h4><br>`);
    $('.js-order-total').html(`0`);

  }

  // if at least one item
  else {

    // start order total calc
    let orderTotal = 0;

    // loop thru items
    data.map( (cartItem, index) => {

      let specs = '';
      if (cartItem.product_specs !== '') {
        specs = `| ${cartItem.product_specs}`;
      }

      const template = `
        <div class="row cart-contents">
          <div class="column product-name">
            <img src="/img/products/${cartItem.product_thumb}" alt="${cartItem.product_name}">
            <h4>${cartItem.product_name}</h4>
            <p>${cartItem.product_width}"W X ${cartItem.product_height}"H ${specs}</p>
            <div class="row">
              <div class="column">
                <label for="${index}-product-qty">Quantity</label>
                <input type="number" id="${index}-product-qty" class="js-qty-cart" maxlength="10" required value="${cartItem.product_qty}">
              </div>
              <div class="column">
                <label for="${index}-product-price">Price ($)</label>
                <input type="number" id="${index}-product-price" readonly value="${cartItem.product_price}">
              </div>
              <div class="column">
                <label for="${index}-shipping-service">Shipping Service</label>
                <select id="${index}-shipping-service" class="js-shipping-cart">
                  <option data-cost="5.99" value="Ground">Ground ($5.99)</option>
                  <option data-cost="15.99" value="2-Day">2-Day ($15.99)</option>
                  <option data-cost="35.99" value="Next Day Air">Next Day Air ($35.99)</option>
                </select>
              </div>
            </div>
            <div class="row">
              <div class="column">
                <a href="#" id="${index}-delete" class="product-details-btn js-delete-cart">
                  <i class="fa fa-ban" aria-hidden="true"></i>
                  REMOVE FROM CART
                  <i class="fa fa-caret-right" aria-hidden="true"></i>
                </a>
              </div>
            </div>
          </div>
          <div class="column column-10"></div>

        </div>
      `;

      $('.js-cart-display').append(template);

      // previous total + item price + shipping cost
      orderTotal = orderTotal + cartItem.product_price + 5.99;

    });

    // display order total
    setOrderTotal(orderTotal);

  }

}

// listen for cart qty changes
function listenForQtyChangesInCart () {

  $('.js-qty-cart').change( event => {
    recalculateOrderTotal();
  });

}
// listen for cart shipping changes
function listenForShippingChangesInCart () {

  $('.js-shipping-cart').change( event => {
    recalculateOrderTotal();
  });

}
// listen for cart deletions
function listenForDeleteChangesInCart () {

  $('.js-delete-cart').click( event => {
    event.preventDefault();

    deleteItemFromCart(event.target.id);

  });

}

// delete item from cart, triggered by cart delete btn click
function deleteItemFromCart (itemId) {

  // get index of cart item to delete
  let itemIndex = itemId.split('-');

  // call cart service to handle delete
  const qData = {
    method:'deleteCartItem',
    indexToDelete: itemIndex[0]
  }
  callCartService(qData).then(function() {
    getCartContents();
  });

}

// recalculate order total triggered by cart change
function recalculateOrderTotal () {

  // init total
  let currentTotal  = 0;

  // loop through each cart item
  $('.cart-contents').each( item => {

    const currentQty = Number($(`#${item}-product-qty`).val());
    const currentPrice = Number($(`#${item}-product-price`).val());
    const currentShipping = Number($(`#${item}-shipping-service`).find(':selected').attr('data-cost'));

    currentTotal = currentTotal + (currentQty *  currentPrice) + currentShipping;

  });

  // display order total
  setOrderTotal(currentTotal);

}

// displays current order total
function setOrderTotal (totalAmount) {

  // display order total
  $('.js-order-total').html(`${totalAmount.toFixed(2)}`);
  $('#billing-total').val(totalAmount.toFixed(2));

}

// add product to cart
function addProductToCart () {

  // gather cart item info
  const productInfo = {
    productId: $('#productId').val(),
    productName: $('#productName').val(),
    productThumb: $('#productThumb').val(),
    productQty: $('#productQty').val(),
    productPrice: $('#productPrice').val(),
    productSpecs: $('#productSpecs').val(),
    productWidth: $('#productWidth').val(),
    productHeight: $('#productHeight').val(),
    productWeight: $('#productWeight').val(),
    productLength: $('#productLength').val(),
    turnaroundTime: $('#turnaroundTime').val(),
    artworkFile: $('#artworkFile').val(),
    shippingName: $('#shippingName').val(),
    shippingAddress: $('#shippingAddress').val(),
    shippingCity: $('#shippingCity').val(),
    shippingState: $('#shippingState').val(),
    shippingZip: $('#shippingZip').val(),
    shippingCost: $('#shippingCost').val(),
    shippingService: $('#shippingService').val()
  };

  // add it to cart, then show cart page
  addItemToCart(productInfo);

}

// listen for cart checkout submissions
function listenForCartFormSubmit () {

  $('.cart-form').submit( event => {

    // stop submit
    event.preventDefault();

    // make sure I have everything expected
    const formError = validateCartForm();

    // if no errors
    if (!formError) {

      // call stripe to verify card and get token
      callStripe();

    }

  });

}
function validateCartForm () {

  // init vars
  let error = false;
  let msg = '';

  // check for all required fields
  if ($('#user-name').val() === '') {
    error = true;
    msg = `${msg} <li>Please enter Your Name</li>`;
  }

  if ($('#user-phone').val() === '') {
    error = true;
    msg = `${msg} <li>Please enter Your Phone Number</li>`;
  }

  if ($('#user-email').val() === '') {
    error = true;
    msg = `${msg} <li>Please enter Your Email Address</li>`;
  }

  if ($('#user-email-confirm').val() === '') {
    error = true;
    msg = `${msg} <li>Please enter Confirm Your Email Address</li>`;
  }

  if ($('#user-email').val() !== $('#user-email-confirm').val()) {
    error = true;
    msg = `${msg} <li>Email Addresses do not match</li>`;
  }

  if ($('#shipping-name').val() === '') {
    error = true;
    msg = `${msg} <li>Please enter a name for the Ship to Location</li>`;
  }

  if ($('#shipping-address').val() === '') {
    error = true;
    msg = `${msg} <li>Please enter the Shipping Address</li>`;
  }

  if ($('#shipping-city').val() === '') {
    error = true;
    msg = `${msg} <li>Please enter the Shipping City</li>`;
  }

  if ($('#shipping-state').val() === '') {
    error = true;
    msg = `${msg} <li>Please enter the Shipping State</li>`;
  }

  if ($('#shipping-zip').val() === '') {
    error = true;
    msg = `${msg} <li>Please enter the Shipping Zip</li>`;
  }

  if ($('#billing-name').val() === '') {
    error = true;
    msg = `${msg} <li>Please enter the Name on the Credit Card</li>`;
  }

  if ($('#billing-address').val() === '') {
    error = true;
    msg = `${msg} <li>Please enter the Credit Card Address</li>`;
  }

  if ($('#billing-city').val() === '') {
    error = true;
    msg = `${msg} <li>Please enter the Credit Card City</li>`;
  }

  if ($('#billing-state').val() === '') {
    error = true;
    msg = `${msg} <li>Please enter the Credit Card State</li>`;
  }

  if ($('#billing-zip').val() === '') {
    error = true;
    msg = `${msg} <li>Please enter the Credit Card Zip Code</li>`;
  }

  // if error recorded, show msg(s)
  if (error) {
    $('#card-errors').html(`
      <ul>
        ${msg}
      </ul>
    `);
  }

  return error;
}

// copies the shipping info into billing info
function listenForBillingCopyClick () {

  $('#billing-copy').click( event => {

    $('#billing-address').val($('#shipping-address').val());
    $('#billing-city').val($('#shipping-city').val());
    $('#billing-state').val($('#shipping-state').val());
    $('#billing-zip').val($('#shipping-zip').val());

  });

}

// listen for submitted orders
function listenForOrderPlacement () {

  $('.js-place-order-btn').click( event => {
    event.preventDefault();

    placeOrder($('.js-order-total').text());

  });

}

// runs when user clicks "Place Order" btn
function placeOrder (amountToCharge) {
  const qData = {
    method:'chargeCard',
    amountToCharge: amountToCharge
  }
  callCartService(qData).then( (data) => {
    handleChargeResult(data);
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

// runs when charge to card was successful
function saveOrder (chargeInfo) {
  const qData = {
    method:'saveOrder',
    chargeData: chargeInfo
  }
  callCartService(qData).then( (data) => {
    orderResponse(data);
  });
}
function orderResponse (data) {
  console.log(data);
}

// makes all calls to user.cfc
function callCartService (data, callback) {

  var settings = {
    url: 'https://services.bannerstack.com/cart.cfc',
    data: data,
    dataType: 'json',
    type: 'GET',
    fail: showAjaxError
  }

  return $.ajax(settings);

}

// add product info to cart
function addItemToCart(productInfo) {

  const settings = {
    url: '/cart/',
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify(productInfo),
    type: 'POST',
    fail: showAjaxError
  };

  return $.ajax(settings);

}

$(initCart)
