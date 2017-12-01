'use strict';

// main function that calls everything
function initApp () {

  // mobile listener for menu icon click
  listenForMenuToggle();

  // look for state select menus to populate
  populateStateSelect('.js-states-select');

  // handle contact forms
  if (window.location.pathname === '/contact') {
    listenForContactFormSubmissions();
  }

}

// opens/closes mobile menu
function listenForMenuToggle () {

  $('.js-nav-toggle').click( event => {

    // show nav
    $('nav ul').toggle();

    // remove bars
    $('.js-nav-toggle i').toggleClass('fa-bars fa-times');

  });

}

// listen for contact form submissions
function listenForContactFormSubmissions () {

  $('.js-contact-form').submit( event => {
    event.preventDefault();

    console.log('contact form submitted');

  });

}

$(initApp)
