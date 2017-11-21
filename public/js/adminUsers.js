// admin user functions
function loginAdminUser () {

  // create login obj
  const loginValues = {
    method: 'loginUser',
    email: $('#adminEmail').val(),
    password: $('#adminPassword').val()
  }

  // send to service for validation
  callAdminService(loginValues)
    .then( loginResponse => {

      // figure out how to handle the result
      handleLoginResponse(loginResponse);

    });

}
function handleLoginResponse (loginResponse) {

  // if login successfull
  if (loginResponse.validated) {

    // update admin user session
    updateAdminUserSession(loginResponse)
      .then( userResponse => {

        // send user to dashboard
        window.location.assign('/admin/dashboard');

      });

  }

  // if not
  else {

    // send failed msg
    showErrorMsg(loginResponse.msg);

    // reinstate login btn
    $('#adminLoginSubmitBtn').prop('value', 'LOGIN');
    $('#adminLoginSubmitBtn').prop('disabled', false);

  }

}
function updateAdminUserSession (adminUser) {

  // get user session info from express route
  const settings = {
    url: '/admin/updateAdminUser/',
    data: adminUser,
    type: 'GET',
    fail: showAjaxError
  };

  return $.ajax(settings);

}
function getAdminSessionInfo () {
  const settings = {
    url: '/admin/getAdminUser/',
    type: 'GET',
    fail: showAjaxError
  };

  return $.ajax(settings);
}


// users
function loadAdminUsers () {

  // setup member display
  callUserService({method: 'getMembers'})
    .then( members => {

      // markup order rows
      let memberRowsHtml = '';
      members.map( member => {
        memberRowsHtml = `${memberRowsHtml}
          <tr>
            <td>${member[0]}</td>
            <td>${member[1]}</td>
            <td>${member[2]}</td>
            <td>${member[3]}</td>
          </tr>
        `;
      });

      // markup admin rows
      let adminRowsHtml = '';
      callUserService({method: 'getAdminUsers'})
        .then( adminUsers => {

          adminUsers.map( adminUser => {
            adminRowsHtml = `${adminRowsHtml}
              <tr>
                <td>${adminUser[1]}</td>
                <td class="admin-options">
                  <a href="#" title="Edit User"><i id="admin-edit-btn_${adminUser[0]}" class="fa fa-pencil" aria-hidden="true"></i></a>
                  <a href="#" title="Delete User"><i id="admin-delete-btn_${adminUser[0]}" class="fa fa-trash" aria-hidden="true"></i></a>
                </td>
              </tr>
            `;
          });

          // start fresh
          $('.js-admin-placeholder').empty();

          // markup search form
          const memberSearchForm = `
            <div class="row">
              <div class="column">
                <label for="memberSearchTerm" class="sr-only">Member Search Term</label>
                <input type="text" id="memberSearchTerm" placeholder="Search by Name, Email or Phone">
              </div>
            </div>
          `;

          // markup admin form
          const adminForm = `
            <form class="js-admin-user-form">

              <label for="adminName">Name:</label>
              <input type="text" id="adminName" placeholder="New Guy" required>

              <label for="adminEmail">Email:</label>
              <input type="email" id="adminEmail" placeholder="new@guy.com" required>

              <label for="adminPassword">Password:</label>
              <input type="password" id="adminPassword" placeholder="******" required>

              <div class="row">
                <div class="column">
                  <input type="submit" id="adminSubmit" value="Add">
                </div>
                <div class="column">
                  <button onclick="loadAdminUsers()">Cancel</button>
                </div>
              </div>

              <input type="hidden" id="adminId">

            </form>
          `;

          // markup display
          const displayHtml = `
            <div class="row">
              <div class="column">
                <h4>Members</h4>

                ${memberSearchForm}
                <table>
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Orders</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${memberRowsHtml}
                  </tbody>
                </table>
              </div>
              <div class="column column-10"></div>
              <div class="column">
                <h4>Admin</h4>
                <table class="js-admin-table">
                  <tbody>
                    ${adminRowsHtml}
                  </tbody>
                </table>

                <br><h4 class="js-admin-form-title">Add Admin</h4>
                ${adminForm}
              </div>
            </div>
          `;

          // load markup to page
          $('.js-admin-placeholder').html(displayHtml);

        });

    });

  // setup listeners
  listenForAdminActions();

}

function editAdminUser (adminUserId) {

  // get user info
  callUserService({
    method: 'getAdminUser',
    adminUserId: adminUserId
  })
    .then( adminUser => {

      // update form content
      $('#adminId').val(adminUser[0]);
      $('#adminName').val(adminUser[1]);
      $('#adminEmail').val(adminUser[2]);

      // change for title and submit text
      $('.js-admin-form-title').html('Edit Admin');
      $('#adminSubmit').val('EDIT');

    });

}

function deleteAdminUser (adminUserId) {

  // confirm delete
  const confirmDelete = confirm('Delete this Admin User?');

  // on confirm
  if (confirmDelete) {

    // get user info
    callUserService({
      method: 'deleteAdminUser',
      adminUserId: adminUserId
    })
      .then( response => {

        // if successful
        if (response === 'success') {
          loadAdminUsers();
        }

        // if not
        else {
          showErrorMsg(response);
        }

      });

  }

}

function handleAdminUserFormSubmit () {

  const formAction = $('#adminSubmit').val();

  // add admin user
  if (formAction === 'Add') {

    // send info to service
    callUserService({
      method: 'addAdminUser',
      adminName: $('#adminName').val(),
      adminEmail: $('#adminEmail').val(),
      adminPassword: $('#adminPassword').val()
    })
      .then( response => {

        // if successful, reload page
        if (response === 'success') {
          loadAdminUsers();
        }

        // if not
        else {

          // display error
          showErrorMsg(response);

        }

      });

  }

  // edit admin user
  else {

    // send info to service
    callUserService({
      method: 'editAdminUser',
      adminId: $('#adminId').val(),
      adminName: $('#adminName').val(),
      adminEmail: $('#adminEmail').val(),
      adminPassword: $('#adminPassword').val()
    })
      .then( response => {

        // if successful, reload page
        if (response === 'success') {
          loadAdminUsers();
        }

        // if not
        else {

          // display error
          showErrorMsg(response);

        }

      });
  }

}
