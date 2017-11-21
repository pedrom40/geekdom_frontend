// product categories
function loadCategories () {

  // setup member display
  callProductsService({method: 'getCategories'})
    .then( categories => {

      // markup category rows
      let categoryRowsHtml = '';
      categories.map( category => {

        // setup value for featured
        let categoryFeaturedStatus = '';
        if (category[3] === 1) {
          categoryFeaturedStatus = 'Yes';
        }
        else {
          categoryFeaturedStatus = 'No';
        }

        // setup value for active
        let categoryActiveStatus = '';
        if (category[4] === 1) {
          categoryActiveStatus = 'Yes';
        }
        else {
          categoryActiveStatus = 'No';
        }

        // add the rows to the HTML placeholder
        categoryRowsHtml = `${categoryRowsHtml}
          <tr>
            <td><img src="https://static.bannerstack.com/img/categories/${category[2]}"></td>
            <td>${category[1]}</td>
            <td>${categoryFeaturedStatus}</td>
            <td>${categoryActiveStatus}</td>
            <td class="admin-options">
              <a href="#" title="Edit"><i id="category-edit-btn_${category[0]}" class="fa fa-pencil" aria-hidden="true"></i></a>
              <a href="#" title="Delete"><i id="category-delete-btn_${category[0]}" class="fa fa-trash" aria-hidden="true"></i></a>
            </td>
          </tr>
        `;
      });

      // start fresh
      $('.js-admin-placeholder').empty();

      // markup search form
      const categorySearchForm = `
        <div class="row">
          <div class="column">
            <label for="categorySearchTerm" class="sr-only">Category Search Term</label>
            <input type="text" id="categorySearchTerm" placeholder="Search by Name">
          </div>
        </div>
      `;

      // markup category form
      const categoryForm = `
        <form class="js-admin-category-form" enctype="multipart/form-data">

          <label for="categoryName">Name:</label>
          <input type="text" id="categoryName" placeholder="New Category" required>

          <div id="categoryImgHolder"></div>
          <label for="categoryThumb">Thumbnail:</label>
          <input type="file" id="fileupload" name="file" placeholder="jpg, gif and png files (RGB only)">
          <div id="progress">
            <div id="bar"></div>
          </div>

          <label for="categoryShortDesc">Short Description:</label>
          <input type="text" id="categoryShortDesc" placeholder="Short description" required>

          <label for="categoryLongDesc">Long Description:</label>
          <textarea id="categoryLongDesc" placeholder="Detailed category description"></textarea>

          <label for="categoryFeatured">Featured:</label>
          <select id="categoryFeatured">
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>

          <label for="categoryActive">Active:</label>
          <select id="categoryActive">
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>

          <div class="row">
            <div class="column">
              <input type="submit" id="categorySubmit" value="Add">
            </div>
            <div class="column">
              <button onclick="loadCategories()">Cancel</button>
            </div>
          </div>

          <input type="hidden" id="categoryId">
          <input type="hidden" id="categoryThumb">

        </form>
      `;

      // markup display
      const displayHtml = `
        <div class="row">
          <div class="column">
            <h4>Categories</h4>

            ${categorySearchForm}
            <table>
              <thead>
                <tr>
                  <th>Thumb</th>
                  <th>Name</th>
                  <th>Featured</th>
                  <th>Active</th>
                  <th>Options</th>
                </tr>
              </thead>
              <tbody>
                ${categoryRowsHtml}
              </tbody>
            </table>
          </div>
          <div class="column column-10"></div>
          <div class="column column-33">
            <h4 class="js-form-title">Add Category</h4>
            ${categoryForm}
          </div>
        </div>
      `;

      // load markup to page
      $('.js-admin-placeholder').html(displayHtml);

      // setup listeners
      listenForAdminActions();

      // init file upload listener
      const uploadData = {
        methodUrl: 'products.cfc?method=uploadCategoryPic',
        imgNamePlaceholder: '#categoryThumb',
        imgPreviewContainer: '#categoryImgHolder',
        imgUrl: 'https://static.bannerstack.com/img/categories'
      }
      listenForFileUploads(uploadData);

    });

}

function editCategory (categoryId) {

  // get user info
  callProductsService({
    method: 'getCategory',
    categoryId: categoryId
  })
    .then( category => {

      // update form content
      $('#categoryId').val(category[0]);
      $('#categoryName').val(category[1]);
      $('#categoryImgHolder').html(`<img src="https://static.bannerstack.com/img/categories/${category[2]}">`);
      $('#categoryShortDesc').val(category[3]);
      $('#categoryLongDesc').val(category[4]);
      $('#categoryFeatured').val(category[5]);
      $('#categoryActive').val(category[6]);

      // change for title and submit text
      $('.js-form-title').html('Edit Category');
      $('#categorySubmit').val('EDIT');

    });

}

function deleteCategory (categoryId) {

  // confirm delete
  const confirmDelete = confirm('Delete this Category?');

  // on confirm
  if (confirmDelete) {

    // get user info
    callProductsService({
      method: 'deleteCategory',
      categoryId: categoryId
    })
      .then( response => {

        // if successful
        if (response === 'success') {
          loadCategories();
        }

        // if not
        else {
          showErrorMsg(response);
        }

      });

  }

}

function handleCategoryFormSubmit () {

  const formAction = $('#categorySubmit').val();

  // add category
  if (formAction === 'Add') {

    // send info to service
    callProductsService({
      method: 'addCategory',
      categoryName: $('#categoryName').val(),
      categoryThumb: $('#categoryThumb').val(),
      categoryShortDesc: $('#categoryShortDesc').val(),
      categoryLongDesc: $('#categoryLongDesc').val(),
      categoryFeatured: $('#categoryFeatured').val(),
      categoryActive: $('#categoryActive').val()
    })
      .then( response => {

        // if successful, reload page
        if (response === 'success') {
          loadCategories();
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
      method: 'editCategory',
      categoryId: $('#categoryId').val(),
      categoryName: $('#categoryName').val(),
      categoryThumb: $('#categoryThumb').val(),
      categoryShortDesc: $('#categoryShortDesc').val(),
      categoryLongDesc: $('#categoryLongDesc').val(),
      categoryFeatured: $('#categoryFeatured').val(),
      categoryActive: $('#categoryActive').val()
    })
      .then( response => {

        // if successful, reload page
        if (response === 'success') {
          loadCategories();
        }

        // if not
        else {

          // display error
          showErrorMsg(response);

        }

      });
  }

}
