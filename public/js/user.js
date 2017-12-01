// start all things user
function initUser () {

  const currentUrl = window.location.pathname;

  // if on login page, listen for logins
  if (currentUrl === '/login') {
    listenForUserLogin();
  }

  // check for existing info
  getUserSessionInfo()
    .then( data => {

      // setup member link
      if (data.loggedIn) {
        $('.js-member-link').html('<a href="/member">Member Home</a>');
      }
      else {
        $('.js-member-link').html('<a href="/login">Login</a>');
      }

      // if member logged in
      if (currentUrl === '/member' && data.loggedIn) {

        // display member's home content
        showMemberHomeInfo(data.id);

      }

      // if data exists
      else if (data.name !== '') {

        // load session info to cart form
        displayUserSession(data);

      }

    });

}

// handle user logins
function listenForUserLogin () {

  $('.js-member-login-form').submit( event => {
    event.preventDefault();

    // if required values are sent
    if ($('#userEmail').val() !== '' && $('#userPassword').val() !== '') {

      const data = {
        method: 'loginUser',
        email: $('#userEmail').val(),
        password: $('#userPassword').val()
      }
      callUserService(data)
        .then( result => {

          if (result[0] === 'success') {

            // update user session
            const userInfo = {id: result[1], name: result[2], email: result[3], phone: result[4]}
            updateUserSessionInfoFromLogin(userInfo)
              .then( result =>  window.location.assign(`/member`))
              .fail( err =>  console.log(err));

          }
          else {
            showErrorMsg('The email/password combination you entered was not found, please try again.');
          }

        })
        .fail( err => {
          console.log(err);
          showErrorMsg('An unexpected error occurred. We have been notified and will resolve the issue immediately.');
        });

    }

    // if required values not entered
    else {
      showErrorMsg('Enter your email and password before logging in.');
    }

  });

}
function updateUserSessionInfoFromLogin (userInfo) {

  const settings = {
    url: '/updateUserFromLogin',
    type: 'POST',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(userInfo)
  }

  return $.ajax(settings);
}

// checks if we need this user to add a password to their account
function checkUserStatus (status, memberId) {

  if (status === 'New') {

    const template = `
      <h4>Account Update</h4>
      <p>
        We've created an account for you so you can login and check your order status.
        To complete this process, please enter a password below.
      </p>

      <div class="row">
        <div class="column">
          <label for="userPassword" class="sr-only">Enter a Password</label>
          <input type="password" id="userPassword" placeholder="Minimum of 6 characters">
        </div>
        <div class="column">
          <div id="js-add-user-password-btn" class="product-details-btn cut-top">
            SUBMIT
            <i class="fa fa-caret-right" aria-hidden="true"></i>
          </div>
        </div>
        <div class="column column-50"></div>
      </div>
    `;

    $('.js-user-actions').html(template);

    listenForUserPasswordUpdates(memberId);

  }

}
function listenForUserPasswordUpdates (memberId) {

  $('.js-user-actions').click( event => {console.log(event.target.id);
    event.preventDefault();

    if (
        event.target.id === 'js-add-user-password-btn' &&
        $('#userPassword').val().length >= 6
      ) {

      const data = {
        method: 'addUserPassword',
        userId: memberId,
        userPassword: $('#userPassword').val()
      }
      callUserService(data)
        .then( result => {

          // show user as logged in
          updateUserLoggedInStatus(true, memberId)

            // take to member's home page
            .then( res => window.location.assign('/member') );

        })
        .fail( err => {
          console.log(err);
        });

    }

    else if (
      event.target.id === 'js-add-user-password-btn' &&
      $('#userPassword').val().length < 6
    ) {
      showErrorMsg('Please enter a valid password');
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

// update user logged in status
function updateUserLoggedInStatus (loggedIn, userId) {

  const data = {
    loggedIn: loggedIn,
    userId: userId
  }
  const settings = {
    url: '/updateUserStatus',
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify(data),
    type: 'POST'
  };

  return $.ajax(settings);

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
