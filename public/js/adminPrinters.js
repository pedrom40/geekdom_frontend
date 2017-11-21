// printers
function loadPrinters () {

  // setup member display
  callProductsService({method: 'getPrinters'})
    .then( printers => {

      // markup rows
      let printerRowsHtml = '';
      printers.map( printer => {

        // setup value for active
        let printerActiveStatus = '';
        if (printer[2] === 1) {
          printerActiveStatus = 'Yes';
        }
        else {
          printerActiveStatus = 'No';
        }

        // add the rows to the HTML placeholder
        printerRowsHtml = `${printerRowsHtml}
          <tr>
            <td>${printer[1]}</td>
            <td>${printerActiveStatus}</td>
            <td class="admin-options">
              <a href="#" title="Edit"><i id="printer-edit-btn_${printer[0]}" class="fa fa-pencil" aria-hidden="true"></i></a>
              <a href="#" title="Delete"><i id="printer-delete-btn_${printer[0]}" class="fa fa-trash" aria-hidden="true"></i></a>
            </td>
          </tr>
        `;
      });

      // start fresh
      $('.js-admin-placeholder').empty();

      // markup search form
      const printerSearchForm = `
        <div class="row">
          <div class="column">
            <label for="printerSearchTerm" class="sr-only">Printer Search Term</label>
            <input type="text" id="printerSearchTerm" placeholder="Search by Name">
          </div>
        </div>
      `;

      // markup form
      const printerForm = `
        <form class="js-admin-printer-form" enctype="multipart/form-data">

          <label for="printerName">Name:</label>
          <input type="text" id="printerName" placeholder="New Printer" required>

          <label for="printerTimeToRunJobFactor">Time to Run Job Factor:</label>
          <input type="number" id="printerTimeToRunJobFactor" placeholder="0.00000" required>

          <label for="printerInkUsageFactor">Ink Usage Factor:</label>
          <input type="number" id="printerInkUsageFactor" placeholder="0.0" required>

          <label for="printerInkCostFactor">Ink Cost Factor:</label>
          <input type="number" id="printerInkCostFactor" placeholder="0.00000" required>

          <label for="printerOverheadFactor">Overhead Factor:</label>
          <input type="number" id="printerOverheadFactor" placeholder="0.00" required>

          <label for="printerActive">Active:</label>
          <select id="printerActive">
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>

          <div class="row">
            <div class="column">
              <input type="submit" id="printerSubmit" value="Add">
            </div>
            <div class="column">
              <button onclick="loadPrinters()">Cancel</button>
            </div>
          </div>

          <input type="hidden" id="printerId">

        </form>
      `;

      // markup display
      const displayHtml = `
        <div class="row">
          <div class="column">
            <h4>Printers</h4>

            ${printerSearchForm}
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Active</th>
                  <th>Options</th>
                </tr>
              </thead>
              <tbody>
                ${printerRowsHtml}
              </tbody>
            </table>
          </div>
          <div class="column column-10"></div>
          <div class="column column-33">
            <h4 class="js-form-title">Add Printer</h4>
            ${printerForm}
          </div>
        </div>
      `;

      // load markup to page
      $('.js-admin-placeholder').html(displayHtml);

      // setup listeners
      listenForAdminActions();

    });

}

function editPrinter (printerId) {

  // get user info
  callProductsService({
    method: 'getPrinter',
    printerId: printerId
  })
    .then( printer => {

      // update form content
      $('#printerId').val(printer[0]);
      $('#printerName').val(printer[1]);
      $('#printerTimeToRunJobFactor').val(printer[2]);
      $('#printerInkUsageFactor').val(printer[3]);
      $('#printerInkCostFactor').val(printer[4]);
      $('#printerOverheadFactor').val(printer[5]);
      $('#printerActive').val(printer[10]);

      // change for title and submit text
      $('.js-form-title').html('Edit Printer');
      $('#printerSubmit').val('EDIT');

    });

}

function deletePrinter (printerId) {

  // confirm delete
  const confirmDelete = confirm('Delete this Printer?');

  // on confirm
  if (confirmDelete) {

    // get user info
    callProductsService({
      method: 'deletePrinter',
      printerId: printerId
    })
      .then( response => {

        // if successful
        if (response === 'success') {
          loadPrinters();
        }

        // if not
        else {
          showErrorMsg(response);
        }

      });

  }

}

function handlePrinterFormSubmit () {

  const formAction = $('#printerSubmit').val();

  // add printer
  if (formAction === 'Add') {

    // send info to service
    callProductsService({
      method: 'addPrinter',
      printerName: $('#printerName').val(),
      printerTimeToRunJobFactor: $('#printerTimeToRunJobFactor').val(),
      printerInkUsageFactor: $('#printerInkUsageFactor').val(),
      printerInkCostFactor: $('#printerInkCostFactor').val(),
      printerOverheadFactor: $('#printerOverheadFactor').val(),
      printerAddedBy: 0,
      printerActive: $('#printerActive').val()
    })
      .then( response => {

        // if successful, reload page
        if (response === 'success') {
          loadPrinters();
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
      method: 'editPrinter',
      printerId: $('#printerId').val(),
      printerName: $('#printerName').val(),
      printerTimeToRunJobFactor: $('#printerTimeToRunJobFactor').val(),
      printerInkUsageFactor: $('#printerInkUsageFactor').val(),
      printerInkCostFactor: $('#printerInkCostFactor').val(),
      printerOverheadFactor: $('#printerOverheadFactor').val(),
      printerUpdatedBy: 0,
      printerActive: $('#printerActive').val()
    })
      .then( response => {

        // if successful, reload page
        if (response === 'success') {
          loadPrinters();
        }

        // if not
        else {

          // display error
          showErrorMsg(response);

        }

      });
  }

}
