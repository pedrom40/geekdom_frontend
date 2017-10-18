function initTemplates () {

  // init size vars
  let width, height;

  // get info from URL
  let urlQueryString = window.location.search.toString().replace('?', '').split('&');
  urlQueryString.map( value => {

    // search for equal sign
    let equalIndex = value.search('=');
    equalIndex = equalIndex + 1;

    // if this is the width
    if (value.search('width') !== -1) {

      // set width
      width = value.slice(equalIndex, value.length);

    }

    // else it's the height
    else {

      // set width
      height = value.slice(equalIndex, value.length);

    }

  });

  // make the service call to get templates to show
  getDesignTemplates(width, height);

}

// call service to get design templates
function getDesignTemplates (width, height) {

  const qData = {
    method: 'getDesignTemplates',
    width: width,
    height: height
  }
  callTemplatesService(qData)
    .then( data => {
      displayDesignTemplates(data);
    });
}

// display design templates
function displayDesignTemplates (templates) {

  // go through each category in the array
  templates.map( template => {

    const templateHtml = `
      <div class="product-box">
        <a href="/createDesign/?templateId=${template[1]}">
          <div class="product-img" style="background-image:url('https://static.bannerstack.com/img/templates/${template[1]}.jpg');"></div>
          <div class="product-name">${template[0]}</div>
          <div class="product-details-btn">
            <i class="fa fa-eye" aria-hidden="true"></i>
            CHOOSE DESIGN
            <i class="fa fa-caret-right" aria-hidden="true"></i>
          </div>
        </a>
      </div>
    `;

    // add category HTML
    $('.js-category-list').append(templateHtml);

  });

}

// makes all calls to templates service
function callTemplatesService (data) {

  const settings = {
    url: 'https://services.bannerstack.com/templates.cfc',
    data: data,
    dataType: 'json',
    type: 'GET',
    fail: showAjaxError
  }

  return $.ajax(settings);

}

$(initTemplates)
