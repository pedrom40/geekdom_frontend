// media
function loadMedias () {

  // setup display
  callProductsService({method: 'getMedias'})
    .then( medias => {

      // markup rows
      let mediaRowsHtml = '';
      medias.map( media => {

        // setup value for active
        let mediaActiveStatus = '';
        if (media[14] === 1) {
          mediaActiveStatus = 'Yes';
        }
        else {
          mediaActiveStatus = 'No';
        }

        // add the rows to the HTML placeholder
        mediaRowsHtml = `${mediaRowsHtml}
          <tr>
            <td>${media[1]}</td>
            <td>${media[4]}</td>
            <td>${media[5]}</td>
            <td>${media[7]}</td>
            <td>${mediaActiveStatus}</td>
            <td class="admin-options">
              <a href="#" title="Edit"><i id="media-edit-btn_${media[0]}" class="fa fa-pencil" aria-hidden="true"></i></a>
              <a href="#" title="Delete"><i id="media-delete-btn_${media[0]}" class="fa fa-trash" aria-hidden="true"></i></a>
            </td>
          </tr>
        `;
      });

      // start fresh
      $('.js-admin-placeholder').empty();

      // markup search form
      const mediaSearchForm = `
        <div class="row">
          <div class="column">
            <label for="mediaSearchTerm" class="sr-only">Media Search Term</label>
            <input type="text" id="mediaSearchTerm" placeholder="Search by Name">
          </div>
        </div>
      `;

      // markup form
      const mediaForm = `
        <form class="js-admin-media-form">

          <label for="name">Name:</label>
          <input type="text" id="name" placeholder="New Media" required>

          <label for="printerIds">Printers:</label>
          <select id="printerIds" multiple></select>

          <label for="wasteFactor">Waste Factor:</label>
          <input type="number" id="wasteFactor" placeholder="0.00" required>

          <label for="rollWidth">Roll Width:</label>
          <input type="number" id="rollWidth" placeholder="0.00" required onChange="calcTotalSqFt()">

          <label for="rollLength">Roll Length:</label>
          <input type="number" id="rollLength" placeholder="0.00" required onChange="calcTotalSqFt()">

          <label for="rollTotalSqFt">Roll Total Sq Ft:</label>
          <input type="number" id="rollTotalSqFt" placeholder="0.00" required readonly>

          <label for="rollPrice">Roll Price ($):</label>
          <input type="number" id="rollPrice" placeholder="0.00" required onChange="calcPricePerSqFt()">

          <label for="pricePerSqFt">Price Per Sq Ft ($):</label>
          <input type="number" id="pricePerSqFt" placeholder="0.00" required readonly>

          <label for="mSquaredFeeFactor">M Squared Fee Factor:</label>
          <input type="number" id="mSquaredFeeFactor" placeholder="0.00" required>

          <label for="active">Active:</label>
          <select id="active">
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>

          <div class="row">
            <div class="column">
              <input type="submit" id="mediaSubmit" value="Add">
            </div>
            <div class="column">
              <button onclick="loadMedias()">Cancel</button>
            </div>
          </div>

          <input type="hidden" id="mediaId">

        </form>
      `;

      // markup display
      const displayHtml = `
        <div class="row">
          <div class="column">
            <h4>Media</h4>

            ${mediaSearchForm}
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Width</th>
                  <th>Length</th>
                  <th>Price</th>
                  <th>Active</th>
                  <th>Options</th>
                </tr>
              </thead>
              <tbody>
                ${mediaRowsHtml}
              </tbody>
            </table>
          </div>
          <div class="column column-10"></div>
          <div class="column column-33">
            <h4 class="js-form-title">Add Media</h4>
            ${mediaForm}
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

function editMedia (mediaId) {

  // get user info
  callProductsService({
    method: 'getMedia',
    mediaId: mediaId
  })
    .then( media => {

      // update form content
      $('#mediaId').val(media[0]);
      $('#name').val(media[1]);
      $('#printerIds').val(media[2]);
      $('#wasteFactor').val(media[3]);
      $('#rollWidth').val(media[4]);
      $('#rollLength').val(media[5]);
      $('#rollTotalSqFt').val(media[6]);
      $('#rollPrice').val(media[7]);
      $('#pricePerSqFt').val(media[8]);
      $('#mSquaredFeeFactor').val(media[9]);
      $('#active').val(media[14]);

      // change for title and submit text
      $('.js-form-title').html('Edit Media');
      $('#mediaSubmit').val('EDIT');

    });

}

function deleteMedia (mediaId) {

  // confirm delete
  const confirmDelete = confirm('Delete this Media?');

  // on confirm
  if (confirmDelete) {

    // get user info
    callProductsService({
      method: 'deleteMedia',
      mediaId: mediaId
    })
      .then( response => {

        // if successful
        if (response === 'success') {
          loadMedias();
        }

        // if not
        else {
          showErrorMsg(response);
        }

      });

  }

}

function handleMediaFormSubmit () {

  const formAction = $('#mediaSubmit').val();

  // add media
  if (formAction === 'Add') {

    // send info to service
    callProductsService({
      method: 'addMedia',
      name: $('#name').val(),
      printerIds: $('#printerIds').val().join(','),
      wasteFactor: Number($('#wasteFactor').val()).toFixed(2),
      rollWidth: Number($('#rollWidth').val()).toFixed(2),
      rollLength: Number($('#rollLength').val()).toFixed(2),
      rollTotalSqFt: Number($('#rollTotalSqFt').val()).toFixed(2),
      rollPrice: Number($('#rollPrice').val()).toFixed(2),
      pricePerSqFt: Number($('#pricePerSqFt').val()).toFixed(2),
      mSquaredFeeFactor: Number($('#mSquaredFeeFactor').val()).toFixed(2),
      addedBy: 0,
      active: $('#active').val()
    })
      .then( response => {

        // if successful, reload page
        if (response === 'success') {
          loadMedias();
        }

        // if not
        else {

          // display error
          showErrorMsg(response);

        }

      });

  }

  // edit media
  else {

    // send info to service
    callProductsService({
      method: 'editMedia',
      mediaId: $('#mediaId').val(),
      name: $('#name').val(),
      printerIds: $('#printerIds').val().join(','),
      wasteFactor: Number($('#wasteFactor').val()).toFixed(2),
      rollWidth: Number($('#rollWidth').val()).toFixed(2),
      rollLength: Number($('#rollLength').val()).toFixed(2),
      rollTotalSqFt: Number($('#rollTotalSqFt').val()).toFixed(2),
      rollPrice: Number($('#rollPrice').val()).toFixed(2),
      pricePerSqFt: Number($('#pricePerSqFt').val()).toFixed(2),
      mSquaredFeeFactor: Number($('#mSquaredFeeFactor').val()).toFixed(2),
      updatedBy: 0,
      active: $('#active').val()
    })
      .then( response => {

        // if successful, reload page
        if (response === 'success') {
          loadMedias();
        }

        // if not
        else {

          // display error
          showErrorMsg(response);

        }

      });
  }

}

function getActivePrinters () {

  // get active printers
  callProductsService({method: 'getActivePrinters'})
    .then( printers => {

      // remove all options
      $('#printerIds').html('');

      // loop thru all printers
      let printerOptions = '';
      printers.map( printer => {

        // add options to variable that will populate the printer select menu
        printerOptions = `${printerOptions}<option value="${printer[0]}">${printer[1]}</option>`;

      });

      // send options to select menu
      $('#printerIds').append(printerOptions);

    });

}

function calcTotalSqFt () {

  if ($('#rollWidth').val() !== '' && $('#rollLength').val() !== '') {

    const totalSqFt = Number($('#rollWidth').val()) * Number($('#rollLength').val());
    $('#rollTotalSqFt').val(totalSqFt);

  }

}

function calcPricePerSqFt () {

  if ($('#rollTotalSqFt').val() !== '' && $('#rollPrice').val() !== '') {

    const pricePerSqFt = Number($('#rollPrice').val()) / Number($('#rollTotalSqFt').val());
    $('#pricePerSqFt').val(pricePerSqFt.toFixed(2));

  }

}
