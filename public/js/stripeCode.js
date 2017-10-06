// Create a Stripe client
var stripe = Stripe('pk_test_k6IRu8VQHfY0LXK4OPK3otFJ');

// Create an instance of Elements
var elements = stripe.elements();

// Custom styling can be passed to options when creating an Element. (Note that this demo uses a wider set of styles than the guide below.)
var style = {
  base: {
    color: '#32325d',
    lineHeight: '24px',
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: 'antialiased',
    fontSize: '16px',
    '::placeholder': {
      color: '#aab7c4'
    }
  },
  invalid: {
    color: '#fa755a',
    iconColor: '#fa755a'
  }
};

if (window.location.pathname === '/cart/') {

  // Create an instance of the card Element
  var card = elements.create('card', {style: style});

  // Add an instance of the card Element into the `card-element` <div>
  card.mount('#card-element');

  // Handle real-time validation errors from the card Element.
  card.addEventListener('change', function(event) {
    var displayError = document.getElementById('card-errors');
    if (event.error) {
      displayError.textContent = event.error.message;
    } else {
      displayError.textContent = '';
    }
  });

}

// Handle form submission
function callStripe () {

  // send all details in for verification
  var extraDetails = {
    name: $('#billing-name').val(),
    address_line1: $('#billing-address').val(),
    address_city: $('#billing-city').val(),
    address_state: $('#billing-state').val(),
    address_zip: $('#billing-zip').val()
  };

  stripe.createToken(card, extraDetails).then(function(result) {
    if (result.error) {

      // Inform the user if there was an error
      var errorElement = document.getElementById('card-errors');
      errorElement.textContent = result.error.message;

      return 'failed';

    }
    else {

      // save all info to user session
      updateUserSession(result.token);

    }
  });

}
