// flat charges
function loadFlatCharges () {

  // setup member display
  callProductsService({method: 'getFlatCharges'})
    .then( flatCharges => {

      // markup rows
      let flatChargeRowsHtml = '';
      flatCharges.map( flatCharge => {

        // setup value for active
        let flatChargeActiveStatus = '';
        if (flatCharge[8] === 1) {
          flatChargeActiveStatus = 'Yes';
        }
        else {
          flatChargeActiveStatus = 'No';
        }

        // add the rows to the HTML placeholder
        flatChargeRowsHtml = `${flatChargeRowsHtml}
          <tr>
            <td>${flatCharge[1]}</td>
            <td>${flatCharge[2]}</td>
            <td>${flatChargeActiveStatus}</td>
            <td class="admin-options">
              <a href="#" title="Edit"><i id="flatCharge-edit-btn_${flatCharge[0]}" class="fa fa-pencil" aria-hidden="true"></i></a>
              <a href="#" title="Delete"><i id="flatCharge-delete-btn_${flatCharge[0]}" class="fa fa-trash" aria-hidden="true"></i></a>
            </td>
          </tr>
        `;
      });

      // start fresh
      $('.js-admin-placeholder').empty();

      // markup search form
      const flatChargeSearchForm = `
        <div class="row">
          <div class="column">
            <label for="flatChargeSearchTerm" class="sr-only">Flat Charge Search Term</label>
            <input type="text" id="flatChargeSearchTerm" placeholder="Search by Name">
          </div>
        </div>
      `;

      // markup form
      const flatChargeForm = `
        <form class="js-admin-flatCharge-form">

          <label for="name">Name:</label>
          <input type="text" id="name" placeholder="New Flat Charge" required>

          <label for="cost">Cost ($):</label>
          <input type="number" id="cost" placeholder="0.00" required>

          <label for="description">Description:</label>
          <input type="text" id="description" placeholder="Short description">

          <label for="active">Active:</label>
          <select id="active">
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>

          <div class="row">
            <div class="column">
              <input type="submit" id="flatChargeSubmit" value="Add">
            </div>
            <div class="column">
              <button onclick="loadFlatCharges()">Cancel</button>
            </div>
          </div>

          <input type="hidden" id="flatChargeId">

        </form>
      `;

      // markup display
      const displayHtml = `
        <div class="row">
          <div class="column">
            <h4>Flat Charges</h4>

            ${flatChargeSearchForm}
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Cost</th>
                  <th>Active</th>
                  <th>Options</th>
                </tr>
              </thead>
              <tbody>
                ${flatChargeRowsHtml}
              </tbody>
            </table>
          </div>
          <div class="column column-10"></div>
          <div class="column column-33">
            <h4 class="js-form-title">Add Flat Charge</h4>
            ${flatChargeForm}
          </div>
        </div>
      `;

      // load markup to page
      $('.js-admin-placeholder').html(displayHtml);

      // setup listeners
      listenForAdminActions();

    });

}

function editFlatCharge (flatChargeId) {

  // get user info
  callProductsService({
    method: 'getFlatCharge',
    flatChargeId: flatChargeId
  })
    .then( flatCharge => {

      // update form content
      $('#flatChargeId').val(flatCharge[0]);
      $('#name').val(flatCharge[1]);
      $('#cost').val(flatCharge[2].toFixed(2));
      $('#description').val(flatCharge[3]);
      $('#active').val(flatCharge[8]);

      // change for title and submit text
      $('.js-form-title').html('Edit Flat Charge');
      $('#flatChargeSubmit').val('EDIT');

    });

}

function deleteFlatCharge (flatChargeId) {

  // confirm delete
  const confirmDelete = confirm('Delete this Flat Charge?');

  // on confirm
  if (confirmDelete) {

    // get user info
    callProductsService({
      method: 'deleteFlatCharge',
      flatChargeId: flatChargeId
    })
      .then( response => {

        // if successful
        if (response === 'success') {
          loadFlatCharges();
        }

        // if not
        else {
          showErrorMsg(response);
        }

      });

  }

}

function handleFlatChargeFormSubmit () {

  const formAction = $('#flatChargeSubmit').val();

  // add flat charge
  if (formAction === 'Add') {

    // send info to service
    callProductsService({
      method: 'addFlatCharge',
      name: $('#name').val(),
      cost: Number($('#cost').val()).toFixed(2),
      description: $('#description').val(),
      addedBy: 0,
      active: $('#active').val()
    })
      .then( response => {

        // if successful, reload page
        if (response === 'success') {
          loadFlatCharges();
        }

        // if not
        else {

          // display error
          showErrorMsg(response);

        }

      });

  }

  // edit printer
  else {

    // send info to service
    callProductsService({
      method: 'editFlatCharge',
      flatChargeId: $('#flatChargeId').val(),
      name: $('#name').val(),
      cost: Number($('#cost').val()).toFixed(2),
      description: $('#description').val(),
      updatedBy: 0,
      active: $('#active').val()
    })
      .then( response => {

        // if successful, reload page
        if (response === 'success') {
          loadFlatCharges();
        }

        // if not
        else {

          // display error
          showErrorMsg(response);

        }

      });
  }

}
