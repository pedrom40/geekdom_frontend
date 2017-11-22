// check to see what page we're on
function initCart () {

  // if on cart or review page, call function to display cart contents
  const pageUrlList = ['/cart', '/cart/', '/review', '/review/'];
  pageUrlList.map( (url) => {
    if (window.location.pathname === url) {
      getCartContents();
    }
  });

  // listen for cart form submit
  listenForCartFormSubmit();

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
      listenForDeleteChangesInCart();

    });
}
function displayCartContents (cart) {

  $('.js-cart-display').empty();

  // if cart empty
  if (cart.length === 0) {

    $('.js-cart-display').html(`<br><h4>Your cart is empty, keep shopping</h4><br>`);
    $('.js-order-total').html(`0`);

  }

  // if at least one item
  else {

    // start order total calc
    let orderTotal = 0;

    // loop thru items
    cart.map( (cartItem, index) => {

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

      let shippingServiceInfo = '';
      if (cartItem.shippingService !== '') {
        shippingServiceInfo = `(${cartItem.shippingService}: $${Number(cartItem.shippingCost).toFixed(2)})`;
      }

      const template = `
        <div class="row cart-contents">
          <div class="column column-25 product-name">
            <img src="${productImgSrc}" alt="${cartItem.productName}">
            ${removeBtn}
          </div>
          <div class="column">
            <h4>${cartItem.productName}</h4>
            <div class="row">
              <div class="column">
                <p>
                  <strong>Size:</strong> ${cartItem.productWidth}"W X ${cartItem.productHeight}"H<br>
                  <strong>Quantity:</strong> ${cartItem.productQty}<br>
                  <strong>Price:</strong> $${Number(cartItem.productPrice).toFixed(2)}
                </p>
                <p>${specs}</p>
              </div>
              <div class="column">
                <p>
                  <label>Ship to:</label>
                  <em>${cartItem.shippingName}</em><br>
                  ${cartItem.shippingAddress}<br>
                  ${cartItem.shippingCity}, ${cartItem.shippingState} ${cartItem.shippingZip}
                  ${shippingServiceInfo}
                </p>
              </div>
            </div>
          </div>
        </div>
      `;

      // add to cart HTML
      $('.js-cart-display').append(template);

      // previous total + item price + shipping cost
      orderTotal = orderTotal + Number(cartItem.productPrice) + Number(cartItem.shippingCost);

    });

    // only load the checkout buttons on certain pages
    if (window.location.pathname !== '/cart' && window.location.pathname !== '/cart/' && window.location.pathname !== '/checkout' && window.location.pathname !== '/checkout/' && window.location.pathname !== '/review' && window.location.pathname !== '/review/') {
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
    if ($(this).val() !== '' && $(this).val() !== null) {

      // combine them in one string
      const valuePair = '<strong>'+$('#'+labelName).text() +'</strong>: '+ $(this).val();

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
    shippingCost: 0,
    shippingService: ''
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

// listen for submitted orders
function listenForOrderPlacement () {

  $('.js-place-order-btn').click( event => {
    event.preventDefault();

    placeOrder($('.js-order-total').text());

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
