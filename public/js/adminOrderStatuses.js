function loadOrderStatuses () {

  // setup member display
  callOrderService({method: 'getOrderStatuses'})
    .then( orderStatuses => {

      // markup rows
      let orderStatusRowsHtml = '';
      orderStatuses.map( orderStatus => {

        // setup value for active
        let orderStatusActiveStatus = '';
        if (orderStatus[3] === 1) {
          orderStatusActiveStatus = 'Yes';
        }
        else {
          orderStatusActiveStatus = 'No';
        }

        // add the rows to the HTML placeholder
        orderStatusRowsHtml = `${orderStatusRowsHtml}
          <tr>
            <td>${orderStatus[1]}</td>
            <td>${orderStatus[2]}</td>
            <td>${orderStatusActiveStatus}</td>
            <td class="admin-options">
              <a href="#" title="Edit"><i id="orderStatus-edit-btn_${orderStatus[0]}" class="fa fa-pencil" aria-hidden="true"></i></a>
              <a href="#" title="Delete"><i id="orderStatus-delete-btn_${orderStatus[0]}" class="fa fa-trash" aria-hidden="true"></i></a>
            </td>
          </tr>
        `;
      });

      // start fresh
      $('.js-admin-placeholder').empty();

      // markup search form
      const orderStatusSearchForm = `
        <div class="row">
          <div class="column">
            <label for="orderStatusSearchTerm" class="sr-only">Order Status Search Term</label>
            <input type="text" id="orderStatusSearchTerm" placeholder="Search by Name">
          </div>
        </div>
      `;

      // markup form
      const orderStatusForm = `
        <form class="js-admin-orderStatus-form">

          <label for="name">Name:</label>
          <input type="text" id="name" placeholder="New Order Status" required>

          <label for="rank">Rank:</label>
          <input type="number" id="rank" placeholder="Whole Numbers only" required>

          <label for="active">Active:</label>
          <select id="active">
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>

          <div class="row">
            <div class="column">
              <input type="submit" id="orderStatusSubmit" value="Add">
            </div>
            <div class="column">
              <button onclick="loadOrderStatuses()">Cancel</button>
            </div>
          </div>

          <input type="hidden" id="orderStatusId">

        </form>
      `;

      // markup display
      const displayHtml = `
        <div class="row">
          <div class="column">
            <h4>Order Statuses</h4>

            ${orderStatusSearchForm}
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Rank</th>
                  <th>Active</th>
                  <th>Options</th>
                </tr>
              </thead>
              <tbody>
                ${orderStatusRowsHtml}
              </tbody>
            </table>
          </div>
          <div class="column column-10"></div>
          <div class="column column-33">
            <h4 class="js-form-title">Add Order Status</h4>
            ${orderStatusForm}
          </div>
        </div>
      `;

      // load markup to page
      $('.js-admin-placeholder').html(displayHtml);

      // setup listeners
      listenForAdminActions();

    });

}

function editOrderStatus (orderStatusId) {

  // get user info
  callProductsService({
    method: 'getOrderStatus',
    orderStatusId: orderStatusId
  })
    .then( orderStatus => {

      // update form content
      $('#orderStatusId').val(orderStatus[0]);
      $('#name').val(orderStatus[1]);
      $('#rank').val(orderStatus[2]);
      $('#active').val(orderStatus[3]);

      // change for title and submit text
      $('.js-form-title').html('Edit Order Status');
      $('#orderStatusSubmit').val('EDIT');

    });

}

function deleteOrderStatus (orderStatusId) {

  // confirm delete
  const confirmDelete = confirm('Delete this Order Status?');

  // on confirm
  if (confirmDelete) {

    // get user info
    callProductsService({
      method: 'deleteOrderStatus',
      orderStatusId: orderStatusId
    })
      .then( response => {

        // if successful
        if (response === 'success') {
          loadOrderStatuses();
        }

        // if not
        else {
          showErrorMsg(response);
        }

      });

  }

}

function handleOrderStatusFormSubmit () {

  const formAction = $('#orderStatusSubmit').val();

  // add order status
  if (formAction === 'Add') {

    // send info to service
    callProductsService({
      method: 'addOrderStatus',
      name: $('#name').val(),
      rank: $('#rank').val(),
      active: $('#active').val()
    })
      .then( response => {

        // if successful, reload page
        if (response === 'success') {
          loadOrderStatuses();
        }

        // if not
        else {

          // display error
          showErrorMsg(response);

        }

      });

  }

  // edit order status
  else {

    // send info to service
    callProductsService({
      method: 'editOrderStatus',
      orderStatusId: $('#orderStatusId').val(),
      name: $('#name').val(),
      rank: $('#rank').val(),
      active: $('#active').val()
    })
      .then( response => {

        // if successful, reload page
        if (response === 'success') {
          loadOrderStatuses();
        }

        // if not
        else {

          // display error
          showErrorMsg(response);

        }

      });
  }

}
