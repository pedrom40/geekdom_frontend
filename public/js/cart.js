// check to see what page we're on
function initCart () {

  // if on cart or review page, call function to display cart contents
  const pageUrlList = ['/cart', '/cart/', '/review', '/review/', '/checkout', '/checkout/'];
  pageUrlList.map( (url) => {
    if (window.location.pathname === url) {
      getCartContents();
    }
  });

  // listen for cart form submit
  listenForCartFormSubmit();

  // listen for shipping/billing copy click
  listenForBillingCopyClick();

  // listen for "place order" clicks
  listenForOrderPlacement();

}

// show what's in the cart because we're on the cart page
function getCartContents () {

  getExpressCartContents()

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
      if (cartItem.productSpecs !== '') {
        specs = `<br>${cartItem.productSpecs.replace(/; /g, '<br>')}`;
      }

      let removeBtn = '';
      if (window.location.pathname !== '/review' && window.location.pathname !== '/review/') {
        removeBtn = `
          <a href="#" id="${index}-delete" class="product-details-btn js-delete-cart">
            <i class="fa fa-ban" aria-hidden="true"></i>
            REMOVE
            <i class="fa fa-caret-right" aria-hidden="true"></i>
          </a>
        `;
      }

      let productImgSrc = `https://static.bannerstack.com/img/products/${cartItem.productThumb}`;
      if (cartItem.template.preview !== '') {
        productImgSrc = cartItem.template.preview;
      }

      const template = `
        <div class="row cart-contents">
          <div class="column product-name">
            <img src="${productImgSrc}" alt="${cartItem.productName}">
          </div>
          <div class="column">
            <h4>${cartItem.productName}</h4>
            <p>${cartItem.productWidth}"W X ${cartItem.productHeight}"H ${specs}</p>
            <label>Ship to</label>
            <p>
              <em>${cartItem.shippingName}</em><br>
              ${cartItem.shippingAddress}<br>
              ${cartItem.shippingCity}, ${cartItem.shippingState} ${cartItem.shippingZip}
            </p>
          </div>
          <div class="column">

            <div class="row">
              <div class="column">
                <label for="${index}-product-qty">Quantity</label>
                <input type="number" id="${index}-product-qty" class="js-qty-cart" maxlength="10" required value="${cartItem.productQty}">
              </div>
              <div class="column">
                <label for="${index}-product-price">Price ($)</label>
                <input type="number" id="${index}-product-price" readonly value="${cartItem.productPrice}">
              </div>
            </div>

            <label for="${index}-shipping-service">Shipping Service</label>
            <select id="${index}-shipping-service" class="js-shipping-cart">
              <option data-cost="5.99" value="Ground">Ground ($5.99)</option>
              <option data-cost="15.99" value="2-Day">2-Day ($15.99)</option>
              <option data-cost="35.99" value="Next Day Air">Next Day Air ($35.99)</option>
            </select>

            ${removeBtn}
          </div>
        </div>
      `;

      $('.js-cart-display').append(template);

      // previous total + item price + shipping cost
      orderTotal = orderTotal + Number(cartItem.productPrice) + 5.99;

    });

    if (window.location.pathname !== '/checkout' && window.location.pathname !== '/checkout/' && window.location.pathname !== '/review' && window.location.pathname !== '/review/') {
      $('.js-cart-display').append(`
        <hr>
        <div class="row">
          <div class="column">
            <a href="/products" class="product-details-btn">
              <i class="fa fa-shopping-cart" aria-hidden="true"></i>
              KEEP SHOPPING
              <i class="fa fa-caret-right" aria-hidden="true"></i>
            </a>
          </div>
          <div class="column">
            <a href="/checkout" class="product-details-btn">
              <i class="fa fa-credit-card" aria-hidden="true"></i>
              CHECKOUT
              <i class="fa fa-caret-right" aria-hidden="true"></i>
            </a>
          </div>
        </div>

      `);
    }

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
  itemIndex = itemIndex[0];

  $.get(`/deleteCartItem/${itemIndex}`, data => {
    window.location.assign('/cart');
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

  // var to hold options
  let productOptionsArray = [];

  // get all options
  const productOptions = $("select[name='productOptions']");

  // loop over each option
  productOptions.each( function() {

    // get the name of the option
    const labelName = $(this).attr('id') +'_label';

    // if this option has a value
    if ($(this).val() !== '') {

      // combine them in one string
      const valuePair = $('#'+labelName).text() +': '+ $(this).val();

      // save to the options array
      productOptionsArray.push(valuePair);

    }

  });

  // gather cart item info
  const productInfo = {
    productId: $('#productId').val(),
    productName: $('#productName').val(),
    productThumb: $('#productThumb').val(),
    productQty: $('#productQty').val(),
    productPrice: $('#productPrice').val(),
    productSpecs: productOptionsArray.join('; '),
    productWidth: $('#productWidth').val(),
    productHeight: $('#productHeight').val(),
    productWeight: $('#productWeight').val(),
    productLength: $('#productLength').val(),
    turnaroundTime: $('#turnaroundTime').val(),
    template: {
      designId: '',
      preview: '',
      projectId: ''
    },
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
  addItemToCart(productInfo)
    .then( data => {
      window.location.assign(data.nextStep);
    });

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

      // call stripe to verify card and get token - stripeCode.js
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

  // get user info for cart token
  getUserSessionInfo()
    .then( (data) => {

      // pass to DB for processing
      const qData = {
        method:'chargeCard',
        amountToCharge: amountToCharge,
        cardToken: data.cardToken
      }
      callCartService(qData).then( (data) => {
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
  getUserSessionInfo().then( (data) => {

    // pass to service to save to DB
    qData = {
      method: 'saveOrderToDb',
      chargeDesc: chargeInfo.description,
      userName: data.name,
      userEmail: data.email,
      userPhone: data.phone
    }
    callCartService(qData).then( (data) => {

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
        getExpressCartContents().then( (cartItems) => {

          // convert to string for CF
          const newCartArray = rebuildArrayOfObjectsForColdfusion(cartItems);

          // pass to service to save order items
          qData = {
            method:'saveOrderItemsToDb',
            orderId: orderId,
            cartItems: newCartArray
          }
          callCartService(qData).then( (data) => {

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

// makes all calls to cart.cfc
function callCartService (data) {

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

// get cart contents from express session
function getExpressCartContents () {

  const settings = {
    url: '/getCart/',
    type: 'GET',
    fail: showAjaxError
  };

  return $.ajax(settings);
}

$(initCart)
