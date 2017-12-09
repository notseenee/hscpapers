/*------------------------------------------------------------------------------
helpers.js
------------------------------------------------------------------------------*/

// get url parameters
function urlParam(name) {
	var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
	return results === null ? '' : decodeURIComponent(results[1]);
}

// if not found from url params
function urlNotFound(type) {
	var table = $('#not-found-modal-table'),
	modalType = $('#not-found-modal-type');
	// clear
	table.html('');
	modalType.html('');
	// add modal title
	modalType.html(type);

	// writer function
	function write(typeToWrite, val, error) {
		if (error) {
			table.append('<tr class="error"><td>' + typeToWrite +
				'</td><td>' + val + '</td></tr>');
		} else {
			table.append('<tr><td>' + typeToWrite + '</td><td>' + val + '</td></tr>');
		}
	}

	// show url params
	switch(type) {
		case 'Course':
			write('Course', url.course, true);
			break;
		case 'Year':
			write('Course', url.course, false);
			write('Year', url.year, true);
			break;
		case 'Doc':
			write('Course', url.course, false);
			write('Year', url.year, false);
			write('Doc', url.doc, true);
			break;
		case 'Course2':
			write('Course2', url.course2, true);
			break;
		case 'Year2':
			write('Course2', url.course2, false);
			write('Year2', url.year2, true);
			break;
		case 'Doc2':
			write('Course2', url.course2, false);
			write('Year2', url.year2, false);
			write('Doc2', url.doc2, true);
	}

	// show the modal
	$('#not-found-modal')
		.modal({
			duration: 200,
			onApprove: function() {
				// clear urlParams variables
				url.course = '';
				url.year = '';
				url.doc = '';
				// show dropdown
				setTimeout(function(){
					$('#' + type.toLowerCase() + '-dropdown').dropdown('show');
				}, 200);
			}
		})
		.modal('show');
}
