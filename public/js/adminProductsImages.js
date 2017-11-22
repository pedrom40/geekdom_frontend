// product images
function loadImages () {

  // setup member display
  callProductsService({method: 'getImages'})
    .then( images => {

      // markup rows
      let imageRowsHtml = '';
      images.map( image => {

        // set in use
        let inUse = '';
        if (image[2]) {
          inUse = '<i class="fa fa-check-circle-o" aria-hidden="true"></i> In Use';
        }
        else {
          inUse = `
            <div class="use-btn"><i class="fa fa-circle-o" aria-hidden="true"></i> Not In Use</div>
            <a href="#" title="Delete"><i id="image-delete-btn_${image[0]}" class="fa fa-trash" aria-hidden="true"></i></a>
          `;
        }
        // add the rows to the HTML placeholder
        imageRowsHtml = `${imageRowsHtml}
          <div class="img-thumb" style="background-image: url('https://static.bannerstack.com/img/products/${image[1]}');">
            <div class="column admin-options grey-bg">
              ${inUse}
            </div>
          </div>
        `;

      });

      // start fresh
      $('.js-admin-placeholder').empty();

      // load markup to page
      $('.js-admin-placeholder').html(imageRowsHtml);

    });

  dragAndDropUploads();
  listenForAdminActions();

}

// get all unclaimed images
function getNewImages () {

  callProductsService({method: 'getNewImages'})
    .then( images => {

      images.map( img => {
        $('#imgHolder').append(`
          <div class="product-images">
            <img id="productImg_${img[0]}" src="https://static.bannerstack.com/img/products/${img[1]}">
          </div>
        `);
      });

    });

  // setup listeners
  listenForAdminActions();

}

// get products current images
function getProductImages (imgList) {
  callProductsService({
    method: 'getProductImages',
    imgList: imgList
  })
    .then( images => {

      images.map( img => {
        $('#currentImgHolder').append(`
          <div class="product-images img-selected">
            <img id="productImg_${img[0]}" src="https://static.bannerstack.com/img/products/${img[1]}">
          </div>
        `);
      });

    });

  // setup listeners
  listenForAdminActions();
}

// toggle "img-selected" class on click
function toggleImageSelection (imageId) {

  // get the initial value of the image list
  let currentValue = $('#imgList').val();
  let imgObj = $(`#productImg_${imageId}`).closest('div');

  // if image being deselected
  if (imgObj.attr('class') === 'product-images img-selected') {

    // update class
    imgObj.removeClass('img-selected');

    // if it's the last value in the list
    if (currentValue.search(`,${imageId}`) !== -1) {
      currentValue = currentValue.toString().replace(`,${imageId}`, '');
    }

    // if it's the first selection
    else if (currentValue.search(`${imageId},`) !== -1) {
      currentValue = currentValue.toString().replace(`${imageId},`, '');
    }

    // if it's the only value
    else {
      currentValue = currentValue.toString().replace(`${imageId}`, '');
    }

  }

  // if selecting image
  else {

    // update class
    imgObj.addClass('img-selected');

    // if it's empty
    if  (currentValue.length === 0) {
      currentValue = `${imageId}`;
    }

    // if there's at least one value already
    else {
      currentValue = `${currentValue},${imageId}`;
    }

  }

  // update the img list value
  $('#imgList').val(currentValue);

}

function deleteImage (imageId) {

  // confirm delete
  const confirmDelete = confirm('Delete this Image?');

  // on confirm
  if (confirmDelete) {

    // get user info
    callProductsService({
      method: 'deleteImage',
      imageId: imageId
    })
      .then( response => {

        // if successful
        if (response === 'success') {
          loadImages();
        }

        // if not
        else {
          showErrorMsg(response);
        }

      });

  }

}
