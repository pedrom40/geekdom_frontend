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
function populateShippingOptions (rates) {console.log(rates);

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

// get service name
function getServiceName (code) {

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
