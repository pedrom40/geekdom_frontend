// start all things user
function initUser () {

  // check for existing info
  getUserSessionInfo()
    .then( (data) => {

      // if data exists
      if (data.name !== '') {

        // load session info to cart form
        displayUserSession(data);

      }

    });

}

// load the data to the dom
function displayUserSession (data) {

  // if it's going into inputs
  if (window.location.pathname === '/checkout' || window.location.pathname === '/checkout/') {

    $('#user-name').val(`${data.name}`);
    $('#user-phone').val(`${data.phone}`);
    $('#user-email').val(`${data.email}`);

    $('#billing-name').val(`${data.billingName}`);
    $('#billing-address').val(`${data.billingAddress}`);
    $('#billing-city').val(`${data.billingCity}`);
    $('#billing-state').val(`${data.billingState}`);
    $('#billing-zip').val(`${data.billingZip}`);

  }

  // if it's going into spans
  else if (window.location.pathname === '/review' || window.location.pathname === '/review/') {

    $('#user-name').html(`${data.name}`);
    $('#user-phone').html(`${data.phone}`);
    $('#user-email').html(`${data.email}`);

    $('#billing-name').html(`${data.billingName}`);
    $('#billing-address').html(`${data.billingAddress}`);
    $('#billing-city').html(`${data.billingCity}`);
    $('#billing-state').html(`${data.billingState}`);
    $('#billing-zip').html(`${data.billingZip}`);
    $('#billing-last4').html(`${data.cardLastFour}`);

  }

}

// update user session from cart form submit
function updateUserSession (stripeTokenObject) {

  const userData = {

    name: $('#user-name').val(),
    phone: $('#user-phone').val(),
    email: $('#user-email').val(),

    billingName: $('#billing-name').val(),
    billingAddress: $('#billing-address').val(),
    billingCity: $('#billing-city').val(),
    billingState: $('#billing-state').val(),
    billingZip: $('#billing-zip').val(),
    cardToken: stripeTokenObject.id,
    cardLastFour: stripeTokenObject.card.last4

  }
  updateUserSessionInfo(userData)
    .then( () => {
      window.location.assign('/review');
    });

}

// make call to cart post route
function updateUserSessionInfo (userData) {

  const settings = {
    url: '/updateUser',
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify(userData),
    type: 'POST',
    fail: showAjaxError
  };

  return $.ajax(settings);

}

// get user session info from express route
function getUserSessionInfo () {
  const settings = {
    url: '/getUser/',
    type: 'GET',
    fail: showAjaxError
  };

  return $.ajax(settings);
}

// call user web service
function callUserService (data) {

  const settings = {
    url: 'https://services.bannerstack.com/user.cfc',
    data: data,
    dataType: 'json',
    type: 'GET',
    fail: showAjaxError
  }

  return $.ajax(settings);

}

$(initUser)
