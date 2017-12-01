// check to see what page we're on
function initCheckout () {

  getExpressCartContents()
    .then( (cart) => {
      showCartItems(cart);
    });

}

// display cart contents
function showCartItems (cart) {

  $('.js-cart-display').empty();

  // start order total calc
  let orderTotal = 0;

  // loop thru items
  cart.map( (cartItem, index) => {

    let specs = '';
    if (cartItem.productSpecs !== '') {
      specs = `<br>${cartItem.productSpecs.replace(/; /g, '<br>')}`;
    }

    let productImgSrc = `https://static.bannerstack.com/img/products/${cartItem.productThumb}`;
    if (cartItem.template.preview !== '') {
      productImgSrc = cartItem.template.preview;
    }

    const template = `
      <h4>${cartItem.productName}</h4>
      <div class="row cart-contents">
        <div class="column product-name">
          <img src="${productImgSrc}" alt="${cartItem.productName}">
        </div>
        <div class="column">
          <p>
            <strong>Quantity:</strong> ${cartItem.productQty}<br>
            <strong>Price:</strong> $${Number(cartItem.productPrice).toFixed(2)}
          </p>
          <p>${specs}</p>
          <p>
            <em>${cartItem.shippingName}</em><br>
            ${cartItem.shippingAddress}<br>
            ${cartItem.shippingCity}, ${cartItem.shippingState} ${cartItem.shippingZip}
          </p>
          <p>
            <label for="${index}-shipping-service">Shipping Service</label>
            <select id="${index}-shipping-service" class="js-shipping-cart"></select>
          </p>
        </div>
      </div>
    `;

    // add to cart HTML
    $('.js-cart-display').append(template);

    // previous total + item price + shipping cost
    orderTotal = orderTotal + Number(cartItem.productPrice);

    // setup ship to
    const shipTo = {
      customerName: cartItem.shippingName,
      address: cartItem.shippingAddress,
      city: cartItem.shippingCity,
      state: cartItem.shippingState,
      zip: cartItem.shippingZip,
      countryCode: 'US',
      pkgWeight: cartItem.productWeight
    }

    // send to ups shipping rates service
    getShippingRates(shipTo)
      .then( rates => {

        // send rates to function for updating
        populateCartItemShippingOptions(rates, index);

      });

  });

  // display order total
  setOrderTotal(orderTotal);
  $('#products-total').val(orderTotal);

  // listen for shipping updates
  listenForShippingServiceChanges();

}

$(initCheckout)
