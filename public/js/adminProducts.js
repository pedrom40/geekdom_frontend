// load all products
function loadProducts () {

  // start fresh
  $('.js-admin-placeholder').empty();

  // setup member display
  callProductsService({method: 'getProducts'})
    .then( products => {

      // markup rows
      let productRowsHtml = '';
      products.map( product => {

        // setup value for featured
        let productFeaturedStatus = '';
        if (product[4] === 1) {
          productFeaturedStatus = 'Yes';
        }
        else {
          productFeaturedStatus = 'No';
        }

        // setup value for active
        let productActiveStatus = '';
        if (product[5] === 1) {
          productActiveStatus = 'Yes';
        }
        else {
          productActiveStatus = 'No';
        }

        // add the rows to the HTML placeholder
        productRowsHtml = `${productRowsHtml}
          <tr>
            <td><img src="https://static.bannerstack.com/img/products/${product[3]}"></td>
            <td>${product[1]}</td>
            <td>${product[2]}</td>
            <td>${productFeaturedStatus}</td>
            <td>${productActiveStatus}</td>
            <td class="admin-options">
              <a href="#" title="Edit"><i id="product-edit-btn_${product[0]}" class="fa fa-pencil" aria-hidden="true"></i></a>
              <a href="#" title="Delete"><i id="product-delete-btn_${product[0]}" class="fa fa-trash" aria-hidden="true"></i></a>
            </td>
          </tr>
        `;

      });

      // markup search form
      const productSearchForm = `
        <div class="row">
          <div class="column">
            <label for="productSearchTerm" class="sr-only">Product Search Term</label>
            <input type="text" id="productSearchTerm" placeholder="Search by Name, SKU or Description">
          </div>
        </div>
      `;

      // markup display
      const displayHtml = `
        <div class="row">
          <div class="column">

            <div id="js-product-add-btn" class="product-details-btn float-right">
              <i class="fa fa-plus" aria-hidden="true"></i>
              NEW PRODUCT
              <i class="fa fa-caret-right" aria-hidden="true"></i>
            </div>

            <h4>Products</h4>

            ${productSearchForm}
            <table>
              <thead>
                <tr>
                  <th width="85">Thumb</th>
                  <th>Name</th>
                  <th>SKU</th>
                  <th>Featured</th>
                  <th>Active</th>
                  <th>Options</th>
                </tr>
              </thead>
              <tbody>
                ${productRowsHtml}
              </tbody>
            </table>
          </div>
        </div>
      `;

      // load markup to page
      $('.js-admin-placeholder').html(displayHtml);

    });

  // setup listeners
  listenForAdminActions();

}

// load product add/edit form
function addProduct () {

  // send HTML to view
  $('.js-admin-placeholder').empty();

  // create main form
  const addProductForm = `
    <h4 class="js-form-title">New Product</h4>
    <form class="js-admin-product-form">
      <div class="row">
        <div class="column">
          <label for="name">Name:</label>
          <input type="text" id="name" placeholder="Product Name" required>

          <label for="sku">SKU:</label>
          <input type="text" id="sku" placeholder="XXXXXX" required>

          <label for="shortDesc">Short Description:</label>
          <input type="text" id="shortDesc" placeholder="Short description, shows on list page" required>

          <label for="featured">Featured:</label>
          <select id="featured">
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>

          <label for="active">Active:</label>
          <select id="active">
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>
        </div>
        <div class="column">
          <label for="longDesc">Detailed Description</label>
          <textarea id="longDesc" placeholder="Description that shows on product details page only" style="height:370px;"></textarea>
        </div>
      </div>

      <hr>

      <div class="row">
        <div class="column">
          <div id="imgHolder"></div>
          <label for="imgThumb">Thumbnail:</label>
          <input type="file" id="fileupload" name="file" placeholder="jpg, gif and png files (RGB only)">
          <div id="progress">
            <div id="bar"></div>
          </div>
        </div>
      </div>

      <hr>

      <div class="row">
        <div class="column">
          <label for="categoryId">Category:</label>
          <select id="categoryId"></select>
        </div>
        <div class="column">
          <label for="printerIdList">Printer:</label>
          <select id="printerId"></select>
        </div>
        <div class="column">
          <label for="mediaId">Media:</label>
          <select id="mediaId"></select>
        </div>
      </div>

      <hr>

      <div class="row">
        <div class="column">
          <label for="sizeIdList">Sizes:</label>
          <select id="sizeIdList" multiple></select>
        </div>
        <div class="column">
          <label for="finishingIdList">Finishing:</label>
          <select id="finishingIdList" multiple></select>
        </div>
      </div>

      <hr>

      <div class="row">
        <div class="column">
          <label for="flatChargeIdList">Flat Charges:</label>
          <select id="flatChargeIdList" multiple></select>
        </div>
        <div class="column">
          <label for="artworkOptionsIdList">Artwork Options:</label>
          <select id="artworkOptionsIdList" multiple></select>
        </div>
        <div class="column">
          <label for="turnaroundIdList">Turnarounds:</label>
          <select id="turnaroundIdList" multiple></select>
        </div>
      </div>

      <hr>

      <div class="row">
        <div class="column">
          <input type="submit" id="productSubmit" value="Add">
        </div>
        <div class="column">
          <button onclick="loadProducts()">Cancel</button>
        </div>
      </div>

      <input type="hidden" id="productId">
      <input type="hidden" id="imgList">
    </form>
  `;

  // send HTML to view
  $('.js-admin-placeholder').append(addProductForm);

  // setup select menus
  const selectsToSetup = [
    {service: 'getCategories',            selectId: 'categoryId'},
    {service: 'getActivePrinters',        selectId: 'printerId'},
    {service: 'getActiveMedias',          selectId: 'mediaId'},
    {service: 'getActiveSizes',           selectId: 'sizeIdList'},
    {service: 'getActiveFinishings',      selectId: 'finishingIdList'},
    {service: 'getActiveFlatCharges',     selectId: 'flatChargeIdList'},
    {service: 'getActiveArtworkOptions',  selectId: 'artworkOptionsIdList'},
    {service: 'getActiveTurnarounds',     selectId: 'turnaroundIdList'}
  ]
  selectsToSetup.map( selectSettings => {
    setupProductSelects(selectSettings.service, selectSettings.selectId);
  });

  // setup listeners
  listenForAdminActions();

}

// adds options to select menus
function setupProductSelects (service, selectId) {

  // clear out select so we start fresh
  $(`#${selectId}`).html('');

  // get records and add them as options
  callProductsService({method: service})
    .then( records => {
      records.map( record => $(`#${selectId}`).append(`<option value="${record[0]}">${record[1]}</option>`) );
    });

}

// loads add form and current values
function editProduct (productId) {

  // load form
  addProduct();

  // get user info
  callProductsService({
    method: 'getProduct',
    productId: productId
  })
    .then( product => {

      // update form content
      $('#productId').val(product[0]);
      $('#name').val(product[1]);
      $('#sku').val(product[2]);
      $('#shortDesc').val(product[3]);
      $('#longDesc').val(product[4]);
      $('#imgList').val(product[5]);
      $('#categoryId').val(product[6]);
      $('#printerId').val(product[9]);
      $('#mediaId').val(product[7]);
      $('#sizeIdList').val(product[8]);
      $('#finishingIdList').val(product[10]);
      $('#flatChargeIdList').val(product[11]);
      $('#artworkOptionsIdList').val(product[13]);
      $('#turnaroundIdList').val(product[12]);
      $('#featured').val(product[14]);
      $('#active').val(product[15]);

      // change for title and submit text
      $('.js-form-title').html('Edit Product');
      $('#productSubmit').val('EDIT');

    });

}

// deletes product by Id
function deleteProduct (productId) {

  // confirm delete
  const confirmDelete = confirm('Delete this Product?');

  // on confirm
  if (confirmDelete) {

    // get user info
    callProductsService({
      method: 'deleteProduct',
      productId: productId
    })
      .then( response => {

        // if successful
        if (response === 'success') {
          loadProducts();
        }

        // if not
        else {
          showErrorMsg(response);
        }

      });

  }

}

// called when user submits add/edit form
function handleProductFormSubmit () {

  const formAction = $('#productSubmit').val();

  // add category
  if (formAction === 'Add') {

    // send info to service
    callProductsService({
      method: 'addProduct',
      name: $('#name').val(),
      sku: $('#sku').val(),
      shortDesc: $('#shortDesc').val(),
      featured: $('#featured').val(),
      active: $('#active').val(),
      longDesc: $('#longDesc').val(),
      imgList: $('#imgList').val().toString(),
      categoryId: $('#categoryId').val(),
      printerId: $('#printerId').val(),
      mediaId: $('#mediaId').val(),
      sizeIdList: $('#sizeIdList').val().toString(),
      finishingIdList: $('#finishingIdList').val().toString(),
      flatChargeIdList: $('#flatChargeIdList').val().toString(),
      artworkOptionsIdList: $('#artworkOptionsIdList').val().toString(),
      turnaroundIdList: $('#turnaroundIdList').val().toString(),
      addedBy: 0
    })
      .then( response => {

        // if successful, reload page
        if (response === 'success') {
          loadProducts();
        }

        // if not
        else {

          // display error
          showErrorMsg(response);

        }

      });

  }

  // edit category
  else {

    // send info to service
    callProductsService({
      method: 'editProduct',
      productId: $('#productId').val(),
      name: $('#name').val(),
      sku: $('#sku').val(),
      shortDesc: $('#shortDesc').val(),
      featured: $('#featured').val(),
      active: $('#active').val(),
      longDesc: $('#longDesc').val(),
      imgList: $('#imgList').val().toString(),
      categoryId: $('#categoryId').val(),
      printerId: $('#printerId').val(),
      mediaId: $('#mediaId').val(),
      sizeIdList: $('#sizeIdList').val().toString(),
      finishingIdList: $('#finishingIdList').val().toString(),
      flatChargeIdList: $('#flatChargeIdList').val().toString(),
      artworkOptionsIdList: $('#artworkOptionsIdList').val().toString(),
      turnaroundIdList: $('#turnaroundIdList').val().toString(),
      updatedBy: 0
    })
      .then( response => {

        // if successful, reload page
        if (response === 'success') {
          loadProducts();
        }

        // if not
        else {

          // display error
          showErrorMsg(response);

        }

      });
  }

}
