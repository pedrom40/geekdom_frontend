// turnarounds
function loadTurnarounds () {

  // setup member display
  callProductsService({method: 'getTurnarounds'})
    .then( turnarounds => {

      // markup rows
      let turnaroundRowsHtml = '';
      turnarounds.map( turnaround => {

        // setup value for active
        let turnaroundActiveStatus = '';
        if (turnaround[7] === 1) {
          turnaroundActiveStatus = 'Yes';
        }
        else {
          turnaroundActiveStatus = 'No';
        }

        // add the rows to the HTML placeholder
        turnaroundRowsHtml = `${turnaroundRowsHtml}
          <tr>
            <td>${turnaround[1]}</td>
            <td>${turnaround[2]}</td>
            <td>${turnaroundActiveStatus}</td>
            <td class="admin-options">
              <a href="#" title="Edit"><i id="turnaround-edit-btn_${turnaround[0]}" class="fa fa-pencil" aria-hidden="true"></i></a>
              <a href="#" title="Delete"><i id="turnaround-delete-btn_${turnaround[0]}" class="fa fa-trash" aria-hidden="true"></i></a>
            </td>
          </tr>
        `;
      });

      // start fresh
      $('.js-admin-placeholder').empty();

      // markup search form
      const turnaroundSearchForm = `
        <div class="row">
          <div class="column">
            <label for="turnaroundSearchTerm" class="sr-only">Turnaround Search Term</label>
            <input type="text" id="turnaroundSearchTerm" placeholder="Search by Name">
          </div>
        </div>
      `;

      // markup form
      const turnaroundForm = `
        <form class="js-admin-turnaround-form">

          <label for="name">Name:</label>
          <input type="text" id="name" placeholder="New Turnaround" required>

          <label for="markup">Markup:</label>
          <input type="number" id="markup" placeholder="0.25" required>

          <label for="active">Active:</label>
          <select id="active">
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>

          <div class="row">
            <div class="column">
              <input type="submit" id="turnaroundSubmit" value="Add">
            </div>
            <div class="column">
              <button onclick="loadTurnarounds()">Cancel</button>
            </div>
          </div>

          <input type="hidden" id="turnaroundId">

        </form>
      `;

      // markup display
      const displayHtml = `
        <div class="row">
          <div class="column">
            <h4>Turnarounds</h4>

            ${turnaroundSearchForm}
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Markup</th>
                  <th>Active</th>
                  <th>Options</th>
                </tr>
              </thead>
              <tbody>
                ${turnaroundRowsHtml}
              </tbody>
            </table>
          </div>
          <div class="column column-10"></div>
          <div class="column column-33">
            <h4 class="js-form-title">Add Turnaround</h4>
            ${turnaroundForm}
          </div>
        </div>
      `;

      // load markup to page
      $('.js-admin-placeholder').html(displayHtml);

      // setup listeners
      listenForAdminActions();

    });

}

function editTurnaround (turnaroundId) {

  // get user info
  callProductsService({
    method: 'getTurnaround',
    turnaroundId: turnaroundId
  })
    .then( turnaround => {

      // update form content
      $('#turnaroundId').val(turnaround[0]);
      $('#name').val(turnaround[1]);
      $('#markup').val(turnaround[2].toFixed(2));
      $('#active').val(turnaround[7]);

      // change for title and submit text
      $('.js-form-title').html('Edit Turnaround');
      $('#turnaroundSubmit').val('EDIT');

    });

}

function deleteTurnaround (turnaroundId) {

  // confirm delete
  const confirmDelete = confirm('Delete this Turnaround?');

  // on confirm
  if (confirmDelete) {

    // get user info
    callProductsService({
      method: 'deleteTurnaround',
      turnaroundId: turnaroundId
    })
      .then( response => {

        // if successful
        if (response === 'success') {
          loadTurnarounds();
        }

        // if not
        else {
          showErrorMsg(response);
        }

      });

  }

}

function handleTurnaroundFormSubmit () {

  const formAction = $('#turnaroundSubmit').val();

  // add turnaround
  if (formAction === 'Add') {

    // send info to service
    callProductsService({
      method: 'addTurnaround',
      name: $('#name').val(),
      markup: Number($('#markup').val()).toFixed(2),
      addedBy: 0,
      active: $('#active').val()
    })
      .then( response => {

        // if successful, reload page
        if (response === 'success') {
          loadTurnarounds();
        }

        // if not
        else {

          // display error
          showErrorMsg(response);

        }

      });

  }

  // edit turnaround
  else {

    // send info to service
    callProductsService({
      method: 'editTurnaround',
      turnaroundId: $('#turnaroundId').val(),
      name: $('#name').val(),
      markup: Number($('#markup').val()).toFixed(2),
      updatedBy: 0,
      active: $('#active').val()
    })
      .then( response => {

        // if successful, reload page
        if (response === 'success') {
          loadTurnarounds();
        }

        // if not
        else {

          // display error
          showErrorMsg(response);

        }

      });
  }

}
