// finishings
function loadFinishings () {

  // setup member display
  callProductsService({method: 'getFinishings'})
    .then( finishings => {

      // markup rows
      let finishingRowsHtml = '';
      finishings.map( finishing => {

        // setup value for active
        let finishingActiveStatus = '';
        if (finishing[9] === 1) {
          finishingActiveStatus = 'Yes';
        }
        else {
          finishingActiveStatus = 'No';
        }

        // add the rows to the HTML placeholder
        finishingRowsHtml = `${finishingRowsHtml}
          <tr>
            <td>${finishing[1]}</td>
            <td>${finishing[2]}</td>
            <td>${finishing[3]}</td>
            <td>${finishingActiveStatus}</td>
            <td class="admin-options">
              <a href="#" title="Edit"><i id="finishing-edit-btn_${finishing[0]}" class="fa fa-pencil" aria-hidden="true"></i></a>
              <a href="#" title="Delete"><i id="finishing-delete-btn_${finishing[0]}" class="fa fa-trash" aria-hidden="true"></i></a>
            </td>
          </tr>
        `;
      });

      // start fresh
      $('.js-admin-placeholder').empty();

      // markup search form
      const finishingSearchForm = `
        <div class="row">
          <div class="column">
            <label for="finishingSearchTerm" class="sr-only">Finishing Search Term</label>
            <input type="text" id="finishingSearchTerm" placeholder="Search by Name">
          </div>
        </div>
      `;

      // markup form
      const finishingForm = `
        <form class="js-admin-finishing-form">

          <label for="name">Name:</label>
          <input type="text" id="name" placeholder="New Finishing" required>

          <label for="cost">Cost ($):</label>
          <input type="number" id="cost" placeholder="0.00" required>

          <label for="runTime">Run Time:</label>
          <input type="text" id="runTime" placeholder="Run Time">

          <label for="printerIds">Printers:</label>
          <select id="printerIds" multiple></select>

          <label for="active">Active:</label>
          <select id="active">
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>

          <div class="row">
            <div class="column">
              <input type="submit" id="finishingSubmit" value="Add">
            </div>
            <div class="column">
              <button onclick="loadFinishings()">Cancel</button>
            </div>
          </div>

          <input type="hidden" id="finishingId">

        </form>
      `;

      // markup display
      const displayHtml = `
        <div class="row">
          <div class="column">
            <h4>Finishing</h4>

            ${finishingSearchForm}
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Cost</th>
                  <th>Run Time</th>
                  <th>Active</th>
                  <th>Options</th>
                </tr>
              </thead>
              <tbody>
                ${finishingRowsHtml}
              </tbody>
            </table>
          </div>
          <div class="column column-10"></div>
          <div class="column column-33">
            <h4 class="js-form-title">Add Finishing</h4>
            ${finishingForm}
          </div>
        </div>
      `;

      // load markup to page
      $('.js-admin-placeholder').html(displayHtml);

      // get all printers
      getActivePrinters();

      // setup listeners
      listenForAdminActions();

    });

}

function editFinishing (finishingId) {

  // get user info
  callProductsService({
    method: 'getFinishing',
    finishingId: finishingId
  })
    .then( finishing => {

      // update form content
      $('#finishingId').val(finishing[0]);
      $('#name').val(finishing[1]);
      $('#cost').val(finishing[2].toFixed(2));
      $('#runTime').val(finishing[3]);
      $('#printerIds').val(finishing[4]);
      $('#active').val(finishing[9]);

      // change for title and submit text
      $('.js-form-title').html('Edit Finishing');
      $('#finishingSubmit').val('EDIT');

    });

}

function deleteFinishing (finishingId) {

  // confirm delete
  const confirmDelete = confirm('Delete this Finishing?');

  // on confirm
  if (confirmDelete) {

    // get user info
    callProductsService({
      method: 'deleteFinishing',
      finishingId: finishingId
    })
      .then( response => {

        // if successful
        if (response === 'success') {
          loadFinishings();
        }

        // if not
        else {
          showErrorMsg(response);
        }

      });

  }

}

function handleFinishingFormSubmit () {

  const formAction = $('#finishingSubmit').val();

  // add finishing
  if (formAction === 'Add') {

    // send info to service
    callProductsService({
      method: 'addFinishing',
      name: $('#name').val(),
      cost: Number($('#cost').val()).toFixed(2),
      runTime: $('#runTime').val(),
      printerIds: $('#printerIds').val().join(','),
      addedBy: 0,
      active: $('#active').val()
    })
      .then( response => {

        // if successful, reload page
        if (response === 'success') {
          loadFinishings();
        }

        // if not
        else {

          // display error
          showErrorMsg(response);

        }

      });

  }

  // edit finishing
  else {

    // send info to service
    callProductsService({
      method: 'editFinishing',
      finishingId: $('#finishingId').val(),
      name: $('#name').val(),
      cost: Number($('#cost').val()).toFixed(2),
      runTime: $('#runTime').val(),
      printerIds: $('#printerIds').val().join(','),
      updatedBy: 0,
      active: $('#active').val()
    })
      .then( response => {

        // if successful, reload page
        if (response === 'success') {
          loadFinishings();
        }

        // if not
        else {

          // display error
          showErrorMsg(response);

        }

      });
  }

}
