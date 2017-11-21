// artwork options
function loadArtworkOptions () {

  // setup member display
  callProductsService({method: 'getArtworkOptions'})
    .then( artworkOptions => {

      // markup rows
      let artworkOptionRowsHtml = '';
      artworkOptions.map( artworkOption => {

        // setup value for active
        let artworkOptionActiveStatus = '';
        if (artworkOption[7] === 1) {
          artworkOptionActiveStatus = 'Yes';
        }
        else {
          artworkOptionActiveStatus = 'No';
        }

        // add the rows to the HTML placeholder
        artworkOptionRowsHtml = `${artworkOptionRowsHtml}
          <tr>
            <td>${artworkOption[1]}</td>
            <td>${artworkOption[2]}</td>
            <td>${artworkOptionActiveStatus}</td>
            <td class="admin-options">
              <a href="#" title="Edit"><i id="artworkOption-edit-btn_${artworkOption[0]}" class="fa fa-pencil" aria-hidden="true"></i></a>
              <a href="#" title="Delete"><i id="artworkOption-delete-btn_${artworkOption[0]}" class="fa fa-trash" aria-hidden="true"></i></a>
            </td>
          </tr>
        `;
      });

      // start fresh
      $('.js-admin-placeholder').empty();

      // markup search form
      const artworkOptionSearchForm = `
        <div class="row">
          <div class="column">
            <label for="artworkOptionSearchTerm" class="sr-only">Artwork Option Search Term</label>
            <input type="text" id="artworkOptionSearchTerm" placeholder="Search by Name">
          </div>
        </div>
      `;

      // markup form
      const artworkOptionForm = `
        <form class="js-admin-artworkOption-form">

        <label for="description">Description:</label>
        <input type="text" id="description" placeholder="Short description" required>

          <label for="cost">Cost ($):</label>
          <input type="number" id="cost" placeholder="0.00" required>

          <label for="active">Active:</label>
          <select id="active">
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>

          <div class="row">
            <div class="column">
              <input type="submit" id="artworkOptionSubmit" value="Add">
            </div>
            <div class="column">
              <button onclick="loadArtworkOptions()">Cancel</button>
            </div>
          </div>

          <input type="hidden" id="artworkOptionId">

        </form>
      `;

      // markup display
      const displayHtml = `
        <div class="row">
          <div class="column">
            <h4>Artwork Options</h4>

            ${artworkOptionSearchForm}
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Cost</th>
                  <th>Active</th>
                  <th>Options</th>
                </tr>
              </thead>
              <tbody>
                ${artworkOptionRowsHtml}
              </tbody>
            </table>
          </div>
          <div class="column column-10"></div>
          <div class="column column-33">
            <h4 class="js-form-title">Add Artwork Option</h4>
            ${artworkOptionForm}
          </div>
        </div>
      `;

      // load markup to page
      $('.js-admin-placeholder').html(displayHtml);

      // setup listeners
      listenForAdminActions();

    });

}

function editArtworkOption (artworkOptionId) {

  // get user info
  callProductsService({
    method: 'getArtworkOption',
    artworkOptionId: artworkOptionId
  })
    .then( artworkOption => {

      // update form content
      $('#artworkOptionId').val(artworkOption[0]);
      $('#description').val(artworkOption[1]);
      $('#cost').val(artworkOption[2].toFixed(2));
      $('#active').val(artworkOption[7]);

      // change for title and submit text
      $('.js-form-title').html('Edit Artwork Option');
      $('#artworkOptionSubmit').val('EDIT');

    });

}

function deleteArtworkOption (artworkOptionId) {

  // confirm delete
  const confirmDelete = confirm('Delete this Artwork Option?');

  // on confirm
  if (confirmDelete) {

    // get user info
    callProductsService({
      method: 'deleteArtworkOption',
      artworkOptionId: artworkOptionId
    })
      .then( response => {

        // if successful
        if (response === 'success') {
          loadArtworkOptions();
        }

        // if not
        else {
          showErrorMsg(response);
        }

      });

  }

}

function handleArtworkOptionFormSubmit () {

  const formAction = $('#artworkOptionSubmit').val();

  // adding
  if (formAction === 'Add') {

    // send info to service
    callProductsService({
      method: 'addArtworkOption',
      description: $('#description').val(),
      cost: Number($('#cost').val()).toFixed(2),
      addedBy: 0,
      active: $('#active').val()
    })
      .then( response => {

        // if successful, reload page
        if (response === 'success') {
          loadArtworkOptions();
        }

        // if not
        else {

          // display error
          showErrorMsg(response);

        }

      });

  }

  // editing
  else {

    // send info to service
    callProductsService({
      method: 'editArtworkOption',
      artworkOptionId: $('#artworkOptionId').val(),
      description: $('#description').val(),
      cost: Number($('#cost').val()).toFixed(2),
      updatedBy: 0,
      active: $('#active').val()
    })
      .then( response => {

        // if successful, reload page
        if (response === 'success') {
          loadArtworkOptions();
        }

        // if not
        else {

          // display error
          showErrorMsg(response);

        }

      });
  }

}
