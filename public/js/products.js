'use strict';

// main products function that calls everything
function initProducts () {

  // figure out what content we need
  checkUrlForContent();

}

// checks URL for category, or product
function checkUrlForContent () {

  // get info from URL
  let urlArray = splitUrlIntoArray();

  // if this is a products page
  if (urlArray[0] == 'products') {

    // if there's a product category
    if (urlArray.length === 3) {

      // check for category match
      checkForCategoryMatch(urlArray);

    }

    // if there's a product name
    else if (urlArray.length === 4) {

      // check for product match
      checkForProductMatch();

    }

    // if it's the products page with no other parameters
    else {

      // get all categories
      getProductCategories();

    }

  }

}

// check url for category name
function checkForCategoryMatch (catName) {

  const qData = {
    categoryName: catName[1].toString().replace(/-/g, ' '),
    method:'getCategoryFromUrl'
  }
  callProductsService(qData)
    .then( data => {
      categoryResult(data);
    });

}
function categoryResult (categoryId) {

  // if a match is found
  if (categoryId !== 0) {

    // load products from category
    getProductsFromCategory(categoryId);

  }
  else {

    // check for product name and id
    checkForProductMatch();

  }

}

// get and load products from a category
function getProductsFromCategory (catId) {
  const qData = {
    categoryId: catId,
    method:'getProductsFromCategory'
  }
  callProductsService(qData)
    .then( data => {
      loadCategoryProducts(data);
    });
}
function loadCategoryProducts (categories) {

  // get category name from id
  getCategoryName(categories[0][4]);

  // hide root product page banners
  $('.js-banners').hide();

  // go through each category in the array
  categories.map( (category, index) => {

    const template = `
      <div class="product-box">
        <a href="/products/${category[5].toString().replace(/ /g, '-')}/${category[1].toString().replace(/ /g, '-')}/">
          <div class="product-img" style="background-image:url('https://static.bannerstack.com/img/products/${category[2]}');"></div>
          <div class="product-name">${category[1]}</div>
          <div class="product-short-desc">${category[3]}</div>
          <div class="product-details-btn">
            <i class="fa fa-eye" aria-hidden="true"></i>
            VIEW DETAILS
            <i class="fa fa-caret-right" aria-hidden="true"></i>
          </div>
        </a>
      </div>
    `;

    // add category HTML
    $('.js-category-list').append(template);

  });

}

// gets product category name from ID
function getCategoryName (catID) {

  const qData = {
    categoryId: catID,
    method:'getCategoryName'
  }
  callProductsService(qData, loadCategoryName);

}

// send category name to title update function
function loadCategoryName (data) {
  updatePageTitle(data);
}

// init check for product name and id
function checkForProductMatch () {

  // get info from URL
  let urlArray = splitUrlIntoArray();

  // check for product match
  lookForProductMatch(urlArray);

}

// send info to products service
function lookForProductMatch (productName) {

  const qData = {
    productName: productName[2].toString().replace(/-/g, ' '),
    method:'getProductFromUrl'
  }
  callProductsService(qData)
    .then( data => {
      productResult(data);
    });

}

// see if there was a product match
function productResult (productId) {

  // if a match is found
  if (productId !== 0) {

    // load products from category
    getProductDetails(productId);

  }
  else {

    // send product not found message
    showErrorMsg('Product Not Found');

    // load product categories
    getProductCategories();

  }

}

// load product details
function getProductDetails (prodId) {

  const qData = {
    productId: prodId,
    method:'getProductDetails'
  }
  callProductsService(qData)
    .then( data => {
      loadProductDetails(data);
    });

}

// load product
function loadProductDetails (product) {

  // handle images
  let imgHTML = '';
  product[4].map( img => imgHTML = `${imgHTML} <img src="https://static.bannerstack.com/img/products/${img}" alt="${product[1]}" class="thumb js-thumb">` );

  // calc flat charges total
  let flatChargeTotal = 0;
  product[8].map( charge => flatChargeTotal = flatChargeTotal + charge[2] );

  // handle product details
  const template = `
    <div class="product-details">
      <div class="container">
        <div class="row">
          <div class="column">
            <h1>${product[1]}</h1>
          </div>
        </div>
        <div class="row">
          <div class="column">
            <div class="main-img">
              <a href="https://static.bannerstack.com/img/products/${product[4][0]}" target="_blank" class="js-main-img-btn">
                <img src="https://static.bannerstack.com/img/products/${product[4][0]}" alt="${product[1]}" class="js-main-img">
              </a>
            </div>
            <div class="thumbnails">
              ${imgHTML}
            </div>
            <div class="product-description">${product[3]}</div>
          </div>
          <div class="column">
            <form class="js-add-to-cart-form" enctype="multipart/form-data">

              <div class="js-product-detail-form-elements">
                <label for="productSize">Select Size</label>
                <select id="productSize"></select>

                <div class="js-product-options"></div>

                <label for="artworkFile">Design</label>
                <select id="artworkFile"></select>

                <div class="js-file-upload-container" style="display:none;">
                  <div id="artworkThumbHolder" style="display:none;"></div>
                  <label for="fileupload">Artwork:</label>
                  <input type="file" id="fileupload" name="file" placeholder="PDF, AI, PSD, INDD, JPG, PNG, TIFF, EPS and ZIP files">
                  <div id="progress">
                    <div id="bar"></div>
                  </div>
                </div>

                <label for="productQty">Quantity</label>
                <input type="number" id="productQty" value="1">

                <a href="#" class="product-details-btn js-shipping-btn">
                  <i class="fa fa-truck" aria-hidden="true"></i>
                  SETUP PRODUCTION &amp; SHIPPING
                  <i class="fa fa-caret-right" aria-hidden="true"></i>
                </a>

                <hr>
              </div>

              <h4 align="right" class="order-total">
                <strong>SUB TOTAL:</strong> $<span class="js-order-total"></span>
              </h4>

              <div class="hide js-shipping-options">
                <div class="row">
                  <div class="column">

                    <hr>

                    <label for="turnaroundTime">Turnaround Time</label>
                    <select id="turnaroundTime"></select>

                    <label for="shippingName">Ship to Name</label>
                    <input type="text" id="shippingName" maxlength="75" required placeholder="Home, Office">

                    <label for="shippingAddress">Address</label>
                    <input type="text" id="shippingAddress" maxlength="75" required placeholder="Address">

                    <div class="row">
                      <div class="column">
                        <label for="shippingCity">City</label>
                        <input type="text" id="shippingCity" maxlength="75" required placeholder="City">
                      </div>
                      <div class="column">
                        <label for="shippingState">State</label>
                        <select id="shippingState" class="js-states-select"></select>
                      </div>
                      <div class="column">
                        <label for="shippingZip">Zip</label>
                        <input type="text" id="shippingZip" maxlength="10" required placeholder="Zip">
                      </div>
                    </div>

                    <div id="shippingSelectContainer" style="display:none;">
                      <label for="shippingService">Shipping Service</label>
                      <select id="shippingService" class="js-shipping-cart">
                        <option value="" data-price="0">Waiting for rates...</option>
                      </select>
                    </div>

                    <div class="row">
                      <div class="column">
                        <a href="#" class="product-details-btn js-open-details-btn">
                          <i class="fa fa-caret-left" aria-hidden="true"></i>
                          BACK TO DETAILS
                        </a>
                      </div>
                      <div class="column">
                        <a href="#" class="product-details-btn js-add-to-cart-btn">
                          <i class="fa fa-shopping-cart" aria-hidden="true"></i>
                          ADD TO CART
                          <i class="fa fa-caret-right" aria-hidden="true"></i>
                        </a>
                      </div>
                    </div>

                    <div class="address-suggestions"></div>

                  </div>
                </div>
              </div>

              <input type="hidden" id="productId" value="${product[0]}">
              <input type="hidden" id="productName" value="${product[1]}">
              <input type="hidden" id="productThumb" value="${product[4][1]}">
              <input type="hidden" id="pricePerSqFt" value="${product[7]}">
              <input type="hidden" id="productFlatCharges" value="${flatChargeTotal}">
              <input type="hidden" id="productWidth">
              <input type="hidden" id="productHeight">
              <input type="hidden" id="productWeight">
              <input type="hidden" id="productLength">
              <input type="hidden" id="productSpecs">
              <input type="hidden" id="productPrice">
              <input type="hidden" id="artworkFileName">

            </form>
          </div>
        </div>
      </div>
    </div>
  `;

  // add it to page
  $('.js-category-list').append(template);

  // populate product sizes select menu
  loadProductSizes(product[6]);

  // populate product finishing select menu
  populateProductFinishing(product[5]);

  // populate state select menu
  populateStateSelect('.js-states-select');

  // populate production times select
  populateTurnaroundsSelect();

  // populate artwork options select
  populateArtworkOptions();

  // listen for add to cart clicks
  listenForCartClicks();

  // listen for shipping setup clicks
  listenForShippingStepClicks();

  // listen for back to details btn clicks
  listenForBackToDetailsClicks();

  // init file upload listener
  const uploadData = {
    methodUrl: 'orders.cfc?method=uploadArtwork',
    imgNamePlaceholder: '#artworkFileName',
    imgPreviewContainer: '#artworkThumbHolder',
    imgUrl: 'https://artwork.bannerstack.com'
  }
  listenForFileUploads(uploadData);

}

// get and load product sizes
function loadProductSizes (productSizes) {

  // go thru all sizes
  productSizes.map( (size, index) => {

    // set initial width x height
    if (index === 0) {
      $('#productWidth').val(productSizes[index][1]);
      $('#productHeight').val(productSizes[index][2]);
      $('#productWeight').val(productSizes[index][3]);
    }

    // add options
    const template = `
      <option value="${productSizes[index][0]}" data-width="${productSizes[index][1]}" data-height="${productSizes[index][2]}"  data-weight="${productSizes[index][3]}">
        ${productSizes[index][1]}" x ${productSizes[index][2]}"
      </option>
    `;

    // add to select menu
    $('#productSize').append(template);

  });

  // listen for size changes
  listenForSizeChanges();

  // listen for qty changes
  listenForQtyChanges();

}
function listenForSizeChanges () {

  $('#productSize').change( event => {

    // update width x height values
    $('#productWidth').val($('#productSize').find(':selected').attr('data-width'));
    $('#productHeight').val($('#productSize').find(':selected').attr('data-height'));

    // set price based on size selected
    calculatePrice();

  });

}
function listenForQtyChanges () {

  $('#productQty').change( event => {

    // set price based on size selected
    calculatePrice();

  });

}

// load product options and listen for changes
function populateProductFinishing (options) {

  options.map( (option, index) => {

    // form element safe option name
    const optionEditedName = option[0].replace(/ /g, '_');

    // set label and select menu
    const optionSelect = `
      <label id="productOptions_${optionEditedName}_label" for="productOptions_${optionEditedName}">${option[0]}</label>
      <select id="productOptions_${optionEditedName}" name="productOptions" class="js-finishing-select">
        <option value='' data-price="0" data-costtype="single">No ${option[0]}</option>
      </select>
    `;

    $('.js-product-options').append(`${optionSelect}`);

    // populate select options
    option[2].map( item => {
      $(`#productOptions_${optionEditedName}`).append(`
        <option value="${item[0]}" data-price="${item[1]}" data-costType="${option[1]}">
          ${item[0]}
        </option>
      `);
    });

  });

  // activate listener for changes
  listenForFinishingChanges();

}
function listenForFinishingChanges () {

  $('.js-finishing-select').change( event => {
    event.preventDefault();

    finishingsHack(event.target);
    calculatePrice();

  });

}
function finishingsHack (selectMenuId) {

  // if grommets selected
  if (selectMenuId.id === 'productOptions_Grommets' && selectMenuId.id.value !== '') {

    // set pole pockets to null
    $('#productOptions_Pole_Pockets').val('');

  }

  // if pole pockets being selected
  else if (selectMenuId.id === 'productOptions_Pole_Pockets' && selectMenuId.id.value !== '') {

    // set grommets to null
    $('#productOptions_Grommets').val('');

  }

}

// populate production times select
function populateTurnaroundsSelect () {

  const qData = {
    method:'getTurnarounds'
  }
  callProductsService(qData)
    .then( data => {
      loadTurnarounds(data);
    });
}
function loadTurnarounds (turnarounds) {

  // loop thru each option
  turnarounds.map( turnaround => {

    // create options
    const template = `<option value="${turnaround[0]}" data-price="${turnaround[2]}">${turnaround[1]}</option>`;

    // add to select menu
    $('#turnaroundTime').append(template);

  });

  // listen for turnaround select changes
  listenForTurnaroundChanges();

}
function listenForTurnaroundChanges () {

  $('#turnaroundTime').change( event => {

    // set price based on size selected
    calculatePrice();

  });

}

// populate artwork options select
function populateArtworkOptions () {

  const qData = {
    method:'getArtworkOptions'
  }
  callProductsService(qData)
    .then( data => {
      loadArtworkOptions(data);
    });
}
function loadArtworkOptions (options) {

  // loop thru each option
  options.map( option => {

    // setup option description
    let optionDesc = `${option[1]}`;
    if (option[2] > 0) {
      optionDesc = `${option[1]} ($${option[2]})`;
    }

    // create options
    const template = `<option value="${option[0]}" data-price="${option[2]}">${optionDesc}</option>`;

    // add to select menu
    $('#artworkFile').append(template);

  });

  // listen for artowrk select menu changes
  listenForArtworkChanges();

  // get initial cost
  calculatePrice();

}
function listenForArtworkChanges () {

  $('#artworkFile').change( event => {

    // set price based on size selected
    calculatePrice();

    // toggle file upload input
    if ($('#artworkFile').val() === '1') {
      $('.js-file-upload-container').show();
    }
    else {
      $('.js-file-upload-container').hide();
    }

  });

}

// listen for image thumbnail clicks, add to cart button clicks
function listenForCartClicks () {

  $('.js-category-list').click( event => {

    if (event.target.id !== 'fileupload')  {

      event.preventDefault();

      // if img thumbnail clicked
      if ($(event.target).attr('class') === 'thumb js-thumb') {
        updateMainImage(event.target.src);
      }

      // if add to cart button was clicked
      else if ($(event.target).attr('class') === 'product-details-btn js-add-to-cart-btn') {

        // setup ship to address
        const shipTo = {
          customerName: $('#shippingName').val(),
          address: $('#shippingAddress').val(),
          city: $('#shippingCity').val(),
          state: $('#shippingState').val(),
          zip: $('#shippingZip').val(),
          countryCode: 'US',
          pkgWeight: $('#productWeight').val()
        }

        // validate address
        validateShippingAddress(shipTo)
          .then( addressResponse => {

            // if address unknown
            if (addressResponse.AddressClassification.Code === "0") {

              // load ups suggestions
              loadAddressAlternatives(addressResponse);

            }

            // if address good, then add item to cart
            else {

              // add product to cart
              addProductToCart();

            }

          });

      }

    }

  });

}

// listen for shipping/production setup
function listenForShippingStepClicks () {

  $('.js-shipping-btn').click( event => {
    event.preventDefault();

    $('.js-product-detail-form-elements').hide();
    $('.js-shipping-options').show();
  });

}

// listen for back to product details btn clicks
function listenForBackToDetailsClicks () {

  $('.js-open-details-btn').click( event => {
    event.preventDefault();

    $('.js-shipping-options').hide();
    $('.js-product-detail-form-elements').show();

  });

}

// updates main img in product carousel
function updateMainImage (imgSrc) {
  $('.js-main-img').attr('src', imgSrc);
  $('.js-main-img-btn').attr('href', imgSrc);
}

// get all active product categories
function getProductCategories () {
  const qData = {
    method:'getProductCategories'
  }
  callProductsService(qData)
    .then( data => {
      loadProductCategories(data);
    });
}
// handle all categories
function loadProductCategories (data) {

  // set page title
  updatePageTitle('ALL PRODUCTS');

  // show root product page banners
  $('.js-banners').show();

  // go through each category in the array
  data.map( (category, index) => {

    const template = `
      <div class="product-box">
        <a href="/products/${category[1].toString().replace(/ /g, '-')}/">
          <div class="product-img" style="background-image:url('https://static.bannerstack.com/img/categories/${category[2]}');"></div>
          <div class="product-name">${category[1]}</div>
          <div class="product-short-desc">${category[3]}</div>
          <div class="product-details-btn">
            <i class="fa fa-eye" aria-hidden="true"></i>
            VIEW PRODUCTS
            <i class="fa fa-caret-right" aria-hidden="true"></i>
          </div>
        </a>
      </div>
    `;

    // add category HTML
    $('.js-category-list').append(template);

  });

}

// calculate product price
function calculatePrice () {

  // get all the values that attribute to cost
  const productWidth = Number($('#productWidth').val()) / 12;
  const productHeight = Number($('#productHeight').val()) / 12;
  const pricePerSqFt = Number($('#pricePerSqFt').val());
  const flatCharges = Number($('#productFlatCharges').val());
  const artworkCharge = Number($('#artworkFile').find(':selected').attr('data-price'));
  const turnaroundMarkup = Number($('#turnaroundTime').find(':selected').attr('data-price'));
  const qty = Number($('#productQty').val());

  // loop through finishing selects and calc added cost
  let finishingTotal = 0;
  $('.js-finishing-select').each( (index, data) => {

    // get name
    let finishingName = data.id.replace('productOptions_', '');
    finishingName = finishingName.replace('_label', '');
    finishingName = finishingName.replace(/_/g, ' ');

    // get cost type
    const finishingCostType = $(`#${data.id}`).find(':selected').attr('data-costtype');

    // get cost
    const finishingCost = Number($(`#${data.id}`).find(':selected').attr('data-price'));

    // if adds cost to job
    if (finishingCost > 0) {
      finishingTotal = finishingTotal + finishingCost;
    }

  });

  // calculate price
  const sizeCharge = (productWidth * productHeight) * pricePerSqFt;
  let productPrice = (artworkCharge + sizeCharge) * qty + flatCharges + finishingTotal;
  const turnaroundMarkupTotal = productPrice * turnaroundMarkup;
  productPrice = productPrice + turnaroundMarkupTotal;

  // update price
  $('#productPrice').val(productPrice);
  $('.js-order-total').html(`${Number(productPrice).toFixed(2)}`);

}

// updates page main title
function updatePageTitle (title) {
  $('.js-page-title').html(title);
}

// makes all calls to products service
function callProductsService (data) {

  const settings = {
    url: 'https://services.bannerstack.com/products.cfc',
    data: data,
    dataType: 'json',
    type: 'GET',
    fail: showAjaxError
  }

  return $.ajax(settings);

}

$(initProducts)
