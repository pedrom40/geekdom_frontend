// sizes
function loadSizes () {

  // setup member display
  callProductsService({method: 'getSizes'})
    .then( sizes => {

      // markup rows
      let sizeRowsHtml = '';
      sizes.map( size => {

        // setup value for active
        let sizeActiveStatus = '';
        if (size[3] === 1) {
          sizeActiveStatus = 'Yes';
        }
        else {
          sizeActiveStatus = 'No';
        }

        // add the rows to the HTML placeholder
        sizeRowsHtml = `${sizeRowsHtml}
          <tr>
            <td>${size[1]}</td>
            <td>${size[2]}</td>
            <td>${sizeActiveStatus}</td>
            <td class="admin-options">
              <a href="#" title="Edit"><i id="size-edit-btn_${size[0]}" class="fa fa-pencil" aria-hidden="true"></i></a>
              <a href="#" title="Delete"><i id="size-delete-btn_${size[0]}" class="fa fa-trash" aria-hidden="true"></i></a>
            </td>
          </tr>
        `;
      });

      // start fresh
      $('.js-admin-placeholder').empty();

      // markup search form
      const sizeSearchForm = `
        <div class="row">
          <div class="column">
            <label for="sizeSearchTerm" class="sr-only">Size Search Term</label>
            <input type="text" id="sizeSearchTerm" placeholder="Search by Width and Height">
          </div>
        </div>
      `;

      // markup form
      const sizeForm = `
        <form class="js-admin-size-form">

          <label for="productWidth">Width:</label>
          <input type="text" id="productWidth" placeholder="Inches, numbers only" required>

          <label for="productHeight">Height:</label>
          <input type="text" id="productHeight" placeholder="Inches, numbers only" required>

          <label for="active">Active:</label>
          <select id="active">
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>

          <div class="row">
            <div class="column">
              <input type="submit" id="sizeSubmit" value="Add">
            </div>
            <div class="column">
              <button onclick="loadSizes()">Cancel</button>
            </div>
          </div>

          <input type="hidden" id="sizeId">

        </form>
      `;

      // markup display
      const displayHtml = `
        <div class="row">
          <div class="column">
            <h4>Sizes</h4>

            ${sizeSearchForm}
            <table>
              <thead>
                <tr>
                  <th>Width</th>
                  <th>Height</th>
                  <th>Active</th>
                  <th>Options</th>
                </tr>
              </thead>
              <tbody>
                ${sizeRowsHtml}
              </tbody>
            </table>
          </div>
          <div class="column column-10"></div>
          <div class="column column-33">
            <h4 class="js-form-title">Add Size</h4>
            ${sizeForm}
          </div>
        </div>
      `;

      // load markup to page
      $('.js-admin-placeholder').html(displayHtml);

      // setup listeners
      listenForAdminActions();

    });

}

function editSize (sizeId) {

  // get user info
  callProductsService({
    method: 'getSize',
    sizeId: sizeId
  })
    .then( size => {

      // update form content
      $('#sizeId').val(size[0]);
      $('#productWidth').val(size[1]);
      $('#productHeight').val(size[2]);
      $('#active').val(size[3]);

      // change for title and submit text
      $('.js-form-title').html('Edit Size');
      $('#sizeSubmit').val('EDIT');

    });

}

function deleteSize (sizeId) {

  // confirm delete
  const confirmDelete = confirm('Delete this Size?');

  // on confirm
  if (confirmDelete) {

    // get user info
    callProductsService({
      method: 'deleteSize',
      sizeId: sizeId
    })
      .then( response => {

        // if successful
        if (response === 'success') {
          loadSizes();
        }

        // if not
        else {
          showErrorMsg(response);
        }

      });

  }

}

function handleSizeFormSubmit () {

  const formAction = $('#sizeSubmit').val();

  // add
  if (formAction === 'Add') {

    // send info to service
    callProductsService({
      method: 'addSize',
      productWidth: $('#productWidth').val(),
      productHeight: $('#productHeight').val(),
      addedBy: 0,
      active: $('#active').val()
    })
      .then( response => {

        // if successful, reload page
        if (response === 'success') {
          loadSizes();
        }

        // if not
        else {

          // display error
          showErrorMsg(response);

        }

      });

  }

  // edit
  else {

    // send info to service
    callProductsService({
      method: 'editSize',
      sizeId: $('#sizeId').val(),
      productWidth: $('#productWidth').val(),
      productHeight: $('#productHeight').val(),
      updatedBy: 0,
      active: $('#active').val()
    })
      .then( response => {

        // if successful, reload page
        if (response === 'success') {
          loadSizes();
        }

        // if not
        else {

          // display error
          showErrorMsg(response);

        }

      });
  }

}
