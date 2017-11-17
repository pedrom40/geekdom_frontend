function showAjaxError (data) {
  console.log('Error data');
  console.log(data);
}

// setup state select menus
function populateStateSelect (element) {

  $(element).append(`
    <option value="AL">Alabama</option>
    <option value="AK">Alaska</option>
    <option value="AZ">Arizona</option>
    <option value="AR">Arkansas</option>
    <option value="CA">California</option>
    <option value="CO">Colorado</option>
    <option value="CT">Connecticut</option>
    <option value="DE">Delaware</option>
    <option value="FL">Florida</option>
    <option value="GA">Georgia</option>
    <option value="HI">Hawaii</option>
    <option value="ID">Idaho</option>
    <option value="IL">Illinois</option>
    <option value="IN">Indiana</option>
    <option value="IA">Iowa</option>
    <option value="KS">Kansas</option>
    <option value="KY">Kentucky</option>
    <option value="LA">Louisiana</option>
    <option value="ME">Maine</option>
    <option value="MD">Maryland</option>
    <option value="MA">Massachusetts</option>
    <option value="MI">Michigan</option>
    <option value="MN">Minnesota</option>
    <option value="MS">Mississippi</option>
    <option value="MO">Missouri</option>
    <option value="MT">Montana</option>
    <option value="NE">Nebraska</option>
    <option value="NV">Nevada</option>
    <option value="NH">New Hampshire</option>
    <option value="NJ">New Jersey</option>
    <option value="NM">New Mexico</option>
    <option value="NY">New York</option>
    <option value="NC">North Carolina</option>
    <option value="ND">North Dakota</option>
    <option value="OH">Ohio</option>
    <option value="OK">Oklahoma</option>
    <option value="OR">Oregon</option>
    <option value="PA">Pennsylvania</option>
    <option value="RI">Rhode Island</option>
    <option value="SC">South Carolina</option>
    <option value="SD">South Dakota</option>
    <option value="TN">Tennessee</option>
    <option value="TX" selected="">Texas</option>
    <option value="UT">Utah</option>
    <option value="VT">Vermont</option>
    <option value="VA">Virginia</option>
    <option value="WA">Washington</option>
    <option value="DC">Washington D.C.</option>
    <option value="WV">West Virginia</option>
    <option value="WI">Wisconsin</option>
    <option value="WY">Wyoming</option>
  `);

}

// setup months select menus
function populateMonthsSelect (element) {

  $(element).append(`
    <option value="01">January - 01</option>
    <option value="02">February - 02</option>
    <option value="03">March - 03</option>
    <option value="04">April - 04</option>
    <option value="05">May - 05</option>
    <option value="06">June - 06</option>
    <option value="07">July - 07</option>
    <option value="08">August - 08</option>
    <option value="09">September - 09</option>
    <option value="10">October - 10</option>
    <option value="11">November - 11</option>
    <option value="12">December - 12</option>
  `);

}

// setup years select menus
function populateYearsSelect (element) {

  // get this year
  const currentYr = new Date().getFullYear();
  const tenYrsFromNow = currentYr + 10;

  // loop thru next 10 yrs
  for (let i=currentYr; i < tenYrsFromNow; i++) {
    $(element).append(`<option value="${i}">${i}</option>`);
  }

}

// rebuild array of objects for CF
function rebuildArrayOfObjectsForColdfusion (jsArray) {

  // new var to rebuild cart contents
  let newCartArray = [];

  // convert each object in cart into a json string
  jsArray.map( item => {

    // convert object to string
    newCartArray.push(JSON.stringify(item));

  });

  return `[${newCartArray.toString()}]`;
}

// split URL into an array
function splitUrlIntoArray () {

  // get current path
  const currentDir = window.location.pathname;

  // split at the slashes
  let urlArray = currentDir.split('/');

  // remove empty first element
  urlArray.shift();

  return urlArray;

}

// listen for file uploads
function listenForFileUploads (uploadData) {

  var _file = document.getElementById('fileupload'),
  _progress = document.getElementById('bar');

  var upload = function() {

    if(_file.files.length === 0){
      return;
    }

    var data = new FormData();
    data.append('file', _file.files[0]);

    var request = new XMLHttpRequest();
    request.onreadystatechange = function(){
      if (request.readyState == 4){
        try {
          const resp = JSON.parse(request.response);
          $(uploadData.imgNamePlaceholder).val(resp);
          $(uploadData.imgPreviewContainer).html(`<img src="${uploadData.imgUrl}/${resp}">`);
        }
        catch (e){
          var resp = {
            status: 'error',
            data: 'Unknown error occurred: [' + request.responseText + ']'
          };
        }
      }
    };

    request.upload.addEventListener('progress', function(e){
      _progress.style.width = Math.ceil(e.loaded/e.total) * 100 + '%';
    }, false);

    request.open('POST', `https://services.bannerstack.com/${uploadData.methodUrl}`);
    request.send(data);

  }

  _file.addEventListener('change', upload);

}

// drag and drop image uploads
function dragAndDropUploads () {

  // setup DnD vars
  const
    _dropZone = $('.js-drop-zone'),
    _file = $('.files'),
    _progress = $('.progress-bar');

  // test for DnD ability
  var isAdvancedUpload = function() {
    var div = document.createElement('div');
    return (('draggable' in div ) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
  }();

  // if able
  if (isAdvancedUpload) {

    // capture DnD events: on drop, trigger upload
    _dropZone
      .on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
        // preventing the unwanted behaviours
        e.preventDefault();
        e.stopPropagation();
      })
      .on('dragover dragenter', function() {
        console.log('dragover dragenter');
        _dropZone.addClass('on-dragover');
      })
      .on('dragleave dragend drop', function() {
        console.log('dragleave dragend drop');
        _dropZone.removeClass('on-dragover');
      })
      .on('drop', function(e) {
        console.log('drop');
      });

  }

  // if not, load regular file upload handlers
  else {
    console.log('cannot do DnD');
  }


  /*
  ;(function($, window, document, undefined) {

    // applying the effect for every form
		$('.box').each( function() {
      var $form = $(this);
      var $input = $form.find('input[type="file"]');
      var $label = $form.find('label');
      var $errorMsg = $form.find('.box__error span');
      var $restart = $form.find('.box__restart');
      var droppedFiles = false;
      var showFiles = function(files) {
        $label.text(files.length > 1 ? ($input.attr('data-multiple-caption') || '').replace('{count}', files.length) : files[0].name);
      };

      // letting the server side to know we are going to make an Ajax request
			$form.append('<input type="hidden" name="ajax" value="1" />');

			// automatically submit the form on file select
			$input.on('change', function(e) {
        showFiles(e.target.files);
        $form.trigger('submit');
      });

      // drag&drop files if the feature is available
			if (isAdvancedUpload) {
				$form
				  .addClass('has-advanced-upload') // letting the CSS part to know drag&drop is supported by the browser
				  .on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
            // preventing the unwanted behaviours
            e.preventDefault();
            e.stopPropagation();
          })
          .on('dragover dragenter', function() {
            $form.addClass('is-dragover');
          })
          .on('dragleave dragend drop', function() {
            $form.removeClass('is-dragover');
          })
				  .on('drop', function(e) {
					  droppedFiles = e.originalEvent.dataTransfer.files; // the files that were dropped
            showFiles(droppedFiles);
            $form.trigger('submit'); // automatically submit the form on file drop
          });
      }

      // if the form was submitted
			$form.on('submit', function(e) {

        // preventing the duplicate submissions if the current one is in progress
				if ($form.hasClass('is-uploading')) return false;

				$form.addClass('is-uploading').removeClass('is-error');

        if (isAdvancedUpload) { // ajax file upload for modern browsers
          e.preventDefault();

					// gathering the form data
					var ajaxData = new FormData($form.get(0));
					if (droppedFiles) {
						$.each(droppedFiles, function(i, file) {
              ajaxData.append($input.attr('name'), file);
              console.log(file);
						});
          }

					// ajax request
					$.ajax({
						url: $form.attr('action'),
						type: $form.attr('method'),
						data: ajaxData,
						dataType: 'json',
						cache: false,
						contentType: false,
						processData: false,
						complete: function() {
							$form.removeClass('is-uploading');
						},
						success: function(data) {
							$form.addClass(data.success == true ? 'is-success' : 'is-error');
							if (!data.success) $errorMsg.text(data.error);
						},
						error: function() {
							alert('Error. Please, contact the webmaster!');
						}
					});
				}
        else { // fallback Ajax solution upload for older browsers

          var iframeName = 'uploadiframe' + new Date().getTime();
          var $iframe = $('<iframe name="' + iframeName + '" style="display:none;"></iframe>');

          $('body').append($iframe);
					$form.attr('target', iframeName);

					$iframe.one('load', function() {
						var data = $.parseJSON($iframe.contents().find('body').text());
						$form.removeClass('is-uploading').addClass(data.success == true ? 'is-success' : 'is-error').removeAttr('target');
						if (!data.success) $errorMsg.text(data.error);
						$iframe.remove();
					});
        }

      });

      // restart the form if has a state of error/success
			$restart.on('click', function(e) {
				e.preventDefault();
				$form.removeClass('is-error is-success');
				$input.trigger('click');
			});

			// Firefox focus bug fix for file input
			$input
			  .on('focus', function() {
          $input.addClass('has-focus');
        })
			  .on('blur', function() {
          $input.removeClass('has-focus');
        });
		});

  })(jQuery, window, document);
  */

}

// handle error messages
function showErrorMsg (msg) {
  $('.js-error-msg').html(`<h4>${msg}</h4>`);
  $('.js-error-msg')
    .show()
    .delay(5000)
    .fadeOut(400);
  $(window).scrollTop(0);
}
