// start all things user
function initUser () {

  // check for existing info
  checkForCurrentSession();

}

// look at session for existing info
function checkForCurrentSession () {
  const qData = {
    method:'checkForExistingSession'
  }
  callUserService(qData, sessionResponse);
}
function sessionResponse (data) {

  // if data exists
  if (data === 1) {

    if (window.location.pathname === '/cart/' || window.location.pathname === '/review/') {

      // load session info to cart form
      loadUserSessionInfo();

    }

  }

}

// call service to get session info and display it
function loadUserSessionInfo () {
  const qData = {
    method:'getUserSession'
  }
  callUserService(qData, displayUserSession);
}
function displayUserSession (data) {

  if (window.location.pathname === '/cart/') {

    $('#user-name').val(`${data.name}`);
    $('#user-phone').val(`${data.phone}`);
    $('#user-email').val(`${data.email}`);

    $('#shipping-name').val(`${data.shipping_name}`);
    $('#shipping-address').val(`${data.shipping_address}`);
    $('#shipping-city').val(`${data.shipping_city}`);
    $('#shipping-state').val(`${data.shipping_state}`);
    $('#shipping-zip').val(`${data.shipping_zip}`);

    $('#billing-name').val(`${data.billing_name}`);
    $('#billing-address').val(`${data.billing_address}`);
    $('#billing-city').val(`${data.billing_city}`);
    $('#billing-state').val(`${data.billing_state}`);
    $('#billing-zip').val(`${data.billing_zip}`);

  }
  else if (window.location.pathname === '/review/') {

    $('#user-name').html(`${data.name}`);
    $('#user-phone').html(`${data.phone}`);
    $('#user-email').html(`${data.email}`);

    $('#shipping-name').html(`${data.shipping_name}`);
    $('#shipping-address').html(`${data.shipping_address}`);
    $('#shipping-city').html(`${data.shipping_city}`);
    $('#shipping-state').html(`${data.shipping_state}`);
    $('#shipping-zip').html(`${data.shipping_zip}`);

    $('#billing-name').html(`${data.billing_name}`);
    $('#billing-address').html(`${data.billing_address}`);
    $('#billing-city').html(`${data.billing_city}`);
    $('#billing-state').html(`${data.billing_state}`);
    $('#billing-zip').html(`${data.billing_zip}`);
    $('#billing-last4').html(`${data.card_last_four}`);

  }

}

// update user session from cart form submit
function updateUserSession (stripeTokenObject) {

  const qData = {
    method:'updateUserSession',
    userName: $('#user-name').val(),
    userPhone: $('#user-phone').val(),
    userEmail: $('#user-email').val(),
    billingName: $('#billing-name').val(),
    billingAddress: $('#billing-address').val(),
    billingCity: $('#billing-city').val(),
    billingState: $('#billing-state').val(),
    billingZip: $('#billing-zip').val(),

    cardToken: stripeTokenObject.id,
    cardLastFour: stripeTokenObject.card.last4
  }
  callUserService(qData, goToReviewPage);
}
function goToReviewPage (data) {
  window.location.assign('/review');
}

// makes all calls to user.cfc
function callUserService (data, callback) {

  var settings = {
    url: 'https://services.bannerstack.com/user.cfc',
    data: data,
    dataType: 'json',
    type: 'GET',
    success: callback,
    fail: showAjaxError
  }

  $.ajax(settings);

}

$(initUser)
