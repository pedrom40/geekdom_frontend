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
