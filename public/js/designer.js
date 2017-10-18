// init global variables needed for designer plugin
var cdnBase, rscBase, apiBase, buildPath, langCode, apiKey, designId, userId, mode, version, lang, designer, projectSource, previews, numPages, projectId, designerShown, config, validationData;

function getDesignId () {

  // get info from URL
  let urlQueryString = window.location.search.toString().replace('?', '').split('&');

  // search for equal sign
  let equalIndex = urlQueryString[0].search('=');
  equalIndex = equalIndex + 1;

  // isolate the template id
  let templateId = urlQueryString[0].slice(equalIndex, urlQueryString[0].length);

  // start the process
  initDesigner(templateId);

}

function initDesigner (templateId) {

  cdnBase = 'https://dta8vnpq1ae34.cloudfront.net/';
  rscBase = 'https://s3.amazonaws.com/pitchprint.rsc/';
  apiBase = 'https://pitchprint.net/api/front/';
  buildPath = 'app/83/';

  langCode = 'en';
  apiKey = 'bc47b4f2fe45c320901d400be04c5e2f';

  designId = templateId;
  userId = 'guest';
  mode = 'new';
  version = '8.3.0';

  $('#launch_btn').hide();
  validate();

}

function validate() {
  $.ajax({
    url: apiBase + 'validate',
    type: 'POST',
    dataType: 'json',
    xhrFields: { withCredentials: true },
    data: {
      userId: userId,
      apiKey: apiKey,
      version: version,
      config: true
    },
    success: function(_data) {
      if (!_data.error) {
        validationData = _data.validation;
        config = _data.config;
        loadLanguage();
      }
      else {
        alert(_data);
      }
    },
    error: function(_e) {
      console.log(_e);
    }
  });
}

// Load the language file as a json data
function loadLanguage() {
  $.ajax({
    type: 'GET',
    dataType: 'json',
    url: cdnBase + buildPath + 'lang/' + (langCode || 'en'),
    cache: true,
    success: function(_r) {
      lang = _r;
      //Language data loaded, let's initialize the editor next..
      initEditor();
    }
  });
}

// This instantiates the editor object and we store it in the variable designer.
function initEditor() {
  designer = new pprint.designer({
    apiKey: apiKey,
    apiBase: apiBase,
    cdnBase: cdnBase,
    rscBase: rscBase,
    buildPath: buildPath,
    parentDiv: '#pp_inline_div',
    mode: mode,
    config: config,
    lang: lang,
    langCode: langCode,
    userId: userId,
    product: { title: 'Sample Card', id: '' },
    designId: designId,
    validationData: validationData,
    autoInitialize: true,
    isUserproject: false,
    isAdmin: false,

    onLibReady: onLibReady,
    autoShow: false,
    onSave: onSave,
    onShown: onShown
  });
}

function onShown() {
  designerShown = true;
}

function onLibReady() {
  $('#launch_btn').show();
  $('#pp_loader_div').hide();
}

function onSave(_val) {
  console.log(_val);
  mode = 'edit';
  projectSource = _val.source;
  projectId = _val.projectId;
  numPages = _val.numPages;
  previews = _val.previews;

  //Let's show previews
  var _prevDiv = $('#pp_preview_div');
  _prevDiv.empty();

  for (var i=0; i < numPages; i++) {
    _prevDiv.append('<img style="border: 1px solid #eee; margin: 10px" src="' + rscBase + 'images/previews/' + projectId + '_' + (i+1) + '.jpg" >');		//Please note, previews are stored based on design page number, thus (i+1)... page 1, page 2...
  }

  designer.close(true);	// Setting this to true ensures the designer is active but with previews shown.

  // If you pass in false, you will need to collapse the editor or remove it from DOM.

  // Now show the launch button again, change the text to edit
  $('#launch_btn').show().text('Edit Design');
}

function showDesigner() {

  // Here, we check if the designer has not been shown before, then we animage the container div's height, which was initially 0
  // If designer has been shown before, we just call up the resume function on the designer..

  if (!designerShown) {
    TweenLite.to($('#pp_inline_div'), 0.6, {
      'height': ($(window).height() - 150), ease: Power2.easeOut, onComplete: function() {
        designer.show();
        $('#launch_btn').hide();
      }
    });
  }
  else {
    designer.resume();
  }
}

$(getDesignId)
