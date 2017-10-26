// get cart contents from express session
function validateShippingAddress (addressObj) {

  const settings = {
    url: '/validateAddress',
    type: 'GET',
    data: addressObj,
    fail: showAjaxError
  };

  return $.ajax(settings);
}

// load address verification suggestions
function loadAddressAlternatives (upsSuggestions) {

  // empty out HTML
  $('.address-suggestions').empty();

  // add response desc
  $('.address-suggestions').append(`<h4>The address above is not valid. Following are some suggestions to correct it:</h4>`);

  // if there is more than one suggestion
  if (Array.isArray(upsSuggestions.AddressKeyFormat)) {

    upsSuggestions.AddressKeyFormat.map( addr => {

      const addressSuggestion = `
        <p>
          ${addr.AddressLine}<br>
          ${addr.Region}
        </p>
      `;

      // add suggestion info
      $('.address-suggestions').append(addressSuggestion);

    });

  }

  // if just one response
  else {

    const addressSuggestion = `
      <p>
        ${upsSuggestions.AddressKeyFormat.AddressLine}<br>
        ${upsSuggestions.AddressKeyFormat.Region}
      </p>
    `;

    // add suggestion info
    $('.address-suggestions').append(addressSuggestion);

  }

}

// get shipping rates
function getShippingRates (shipTo) {

  const settings = {
    url: '/getShippingRates',
    data: shipTo,
    type: 'GET',
    fail: showAjaxError
  }

  return $.ajax(settings);

}

// populate shipping select menus
function populateShippingOptions (rates) {

  $('#shippingService').empty();

  // loop thru rates
  rates.RatedShipment.map( (rate, index) => {

    // get service name, "UPS Ground"
    const serviceName = getServiceName(rate.Service.Code);

    // setup select options tag
    const template =`
      <option value="${rate.Service.Code}" data-price="${rate.TotalCharges.MonetaryValue}">
        ${serviceName} ($${rate.TotalCharges.MonetaryValue})
      </option>
    `;

    // add it to shipping select menu
    $('#shippingService').append(template);

    // calculate cost
    if (index === 0) {
      calculatePrice();
    }

  });

  $('#shippingSelectContainer').show();

}

// update shipping options for cart item
function populateCartItemShippingOptions (rates, itemIndex) {

  $(`#${itemIndex}-shipping-service`).empty();

  // add pickup option
  $(`#${itemIndex}-shipping-service`).append(`
    <option value="pickup" data-price="0">
      I'll Pick Up My Order (Free)
    </option>
  `);

  // loop thru rates
  rates.RatedShipment.map( rate => {

    // get service name, "UPS Ground"
    const serviceName = getShippingServiceName(rate.Service.Code);

    // setup select options tag
    const template = `
      <option value="${rate.Service.Code}" data-price="${rate.TotalCharges.MonetaryValue}">
        ${serviceName} ($${rate.TotalCharges.MonetaryValue})
      </option>
    `;

    // add it to shipping select menu
    $(`#${itemIndex}-shipping-service`).append(template);

  });

}

// listen for shipping changes
function listenForShippingServiceChanges () {

  $('.js-shipping-cart').change( event => {
    event.preventDefault();

    // init shipping cost
    let shippingCost = 0;

    // go through each shipping item
    $('.js-shipping-cart').each( function(index) {

      // calc shipping cost
      shippingCost = shippingCost + Number($(`#${index}-shipping-service`).find(':selected').attr('data-price'));

    });

    // add to order total
    const orderTotal = Number($('#products-total').val()) + Number(shippingCost);
    setOrderTotal(orderTotal);

  });

}

// get service name
function getShippingServiceName (code) {

  const services = {
    "01": "UPS Next Day Air",
		"02": "UPS 2nd Day Air",
		"03": "UPS Ground",
		"07": "UPS Worldwide Express",
		"08": "UPS Worldwide Express Expedited",
		"11": "UPS Standard",
		"12": "UPS 3 Day Select",
		"13": "UPS Next Day Air Saver",
		"14": "UPS Next Day Air Early A.M.",
		"54": "UPS Worldwide Express Plus",
		"59": "UPS 2nd Day Air A.M.",
		"65": "UPS Saver"
  }

  let serviceName = '';

  $.each(services, function(key, value) {
    if (key.toString() === code.toString()) {
      serviceName = value.toString();
    }
  });

  return serviceName;

}
