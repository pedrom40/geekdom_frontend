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
          inUse = '<i class="fa fa-circle-o" aria-hidden="true"></i> Not In Use';
        }
        // add the rows to the HTML placeholder
        imageRowsHtml = `${imageRowsHtml}
          <div class="column">
            <img src="https://static.bannerstack.com/img/products/${image[1]}">
            <div class="column admin-options grey-bg">
              <div class="use-btn">${inUse}</div>
              <a href="#" title="Edit"><i id="category-edit-btn_${image[0]}" class="fa fa-pencil" aria-hidden="true"></i></a> &nbsp;
              <a href="#" title="Delete"><i id="category-delete-btn_${image[0]}" class="fa fa-trash" aria-hidden="true"></i></a>
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

}
