let
  cdnBase = 'https://dta8vnpq1ae34.cloudfront.net/',
  rscBase = 'https://s3.amazonaws.com/pitchprint.rsc/',
  apiBase = 'https://pitchprint.net/api/front/',
  buildPath = 'app/83/',
  langCode = 'en',
  apiKey = 'bc47b4f2fe45c320901d400be04c5e2f',
  appApiUrl = 'https://pitchprint.net/api/front/',
  designId = 'ab73e4cc5b80b05facfca35cca40d318',
  lang,
  designer,
  mode = 'new',
  userId = 'guest',
  projectSource,
  previews,
  numPages,
  projectId,
  config,
  designerShown,
  validationData,
  version = "8.3.0";

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

function loadLanguage () {
  $.ajax({
    type: 'GET',
    dataType: 'json',
    url: rscCdn + 'lang/' + (langCode || 'en'),
    cache: true,
    success: function(_r) {
      lang = _r;
      initEditor();
    }
  });
}

function initEditor () {
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

function showDesigner() {
	if (!designerShown) {

    TweenLite.to(
      $('#pp_inline_div'), 0.6, {
        'height': ($(window).height() - 150), ease: Power2.easeOut, onComplete: function() {
			    designer.show();
			    $('#launch_btn').hide();
        }
      }
    );

	} else {
		designer.resume();
	}
}

function onShown () {
	designerShown = true;
}
function onReady () {
	$('#launch_btn').show();
}
function onSave () {
}

$(validate)
