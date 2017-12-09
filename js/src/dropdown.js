/*------------------------------------------------------------------------------
dropdown.js
------------------------------------------------------------------------------*/

// parses JSON to populate dropdowns
function populateDropdown(json, searchFor, pushTo, reverse) {
	if (typeof(json) == 'object') {
		// get all items into an array
		var items = [];
		// loop through each item and push to array
		for (i = 0; i < json.length; i++) {
			items.push(json[i][searchFor]);
		}
		// sort array
		items.sort();
		// optionally reverses array (for year dropdown)
		if (reverse) items.reverse();
		// clears dropdown
		$(pushTo).empty();
		// loops through items in array and adds to the dropdown
		for (j = 0; j < items.length; j++) {
			$(pushTo).append('<div class="item" data-value"1">' + items[j] + '</div>');
		}
	} else {
		console.error('Input JSON not an object: ' + json);
		alert('Error:\n\nInput JSON not an object: ' + json);
	}
}

// generalised function for different dropdowns to reduce repeated code
function userSelect(
	elem, suffix, next,
	searchIn, searchFor, searchNext, elemValue, reverse,
	finish) {
	console.warn('bound change event for ' + elem);
	$('#' + elem + '-input' + suffix).change( function() {
	console.warn('trigger change event for ' + elem);
		// save input DOM element
		var input = $('#' + elem + '-input' + suffix);
		// if this is blank for some reason, ignore
		if (input[0].value === '') return;
		// save next dropdown DOM element
		if (next) {
			var nextDropdown = $('#' + next + '-dropdown' + suffix);
			var nextMenu = $('#' + next + '-menu' + suffix);
		}
		// get selected value
		selected[elem] = input[0].value;
		// add to new params
		params[elem] = selected[elem];
		// add loading spinner to next dropdown
		if (next) nextDropdown.addClass('loading').removeClass('disabled');
		// loops through each element in json object to find index
		for (k = 0; k < searchIn.length; k++) {
			if (searchIn[k][searchFor].toLowerCase() == selected[elem]) {
				selected[elemValue] = k;
				break;
			}
		}
		// if not found, throw an error
		if (!selected[elemValue]) {
			console.error(elem + ' not found');
			alert(elem + ' not found');
			return;
		}
		// next dropdown
		if (next) {
			// populates next dropdown
			populateDropdown(
				searchIn[selected[elemValue]][searchNext], next, nextMenu, reverse);
			// activates next dropdown
			nextDropdown
				.removeClass('loading')
				.dropdown('restore defaults')
				.dropdown('show')
				.dropdown({ selectOnKeydown: false });
			// Select next from URL parameter
			if (url[next]) {
				nextDropdown
					.dropdown('set selected', url[next])
					.dropdown('hide');
				// if not found
				if ( !nextDropdown.dropdown('get value') ) urlNotFound(next);
			}
		}
		// change url to new params
		history.pushState(null, '', '?' + $.param(params) );
		if (finish) finish();
	});
}

// // when a year is selected, populate docs dropdown
// $('#year-input').change( function() {
// 	// if year is blank for some reason, ignore
// 	if ($(this)[0].value === '') return;
// 	// get selected year
// 	selected.year = $('#year-input')[0].value;
// 	// add to new params
// 	params.year = selected.year;
// 	// add loading spinner to year dropdown
// 	$('#doc-dropdown').addClass('loading').removeClass('disabled');
// 	// loops through each element in json object to find year index
// 	for (l = 0; l < jsonData[selected.courseIndex].packs.length; l++) {
// 		if (jsonData[selected.courseIndex].packs[l].year == selected.year) {
// 			selected.yearIndex = l;
// 			break;
// 		}
// 	}
// 	// populates dropdown
// 	populateDropdown(jsonData[selected.courseIndex].packs[selected.yearIndex].docs,
// 		'doc_name', '#doc-menu', false);
// 	// activate doc dropdown
// 	$('#doc-dropdown')
// 		.removeClass('loading')
// 		.dropdown('restore defaults')
// 		.dropdown('show');
// 	// Select doc from URL parameter
// 	if (url.doc) {
// 		$('#doc-dropdown')
// 			.dropdown('set selected', url.doc)
// 			.dropdown('hide');
// 		// if not found
// 		if ( !$('#doc-dropdown').dropdown('get value') ) urlNotFound('Doc');
// 	}
// 	// activate exam pack buttons and adds link
// 	$('.button-exampack')
// 		.removeClass('disabled')
// 		.attr('href', jsonData[selected.courseIndex].packs[selected.yearIndex].link);
// 	// change url to new params
// 	history.pushState(null, '', '?' + $.param(params) );
// });

// when a doc is selected, open it
$('#doc-input').change( function(){
	// if selected doc is blank, ignore
	if ($(this)[0].value == '') return;
	// get selected doc
	selected.doc = $('#doc-input')[0].value;
	// add to new params
	params.doc = selected.doc;
	// loops thorugh each doc to find doc index
	for (m = 0; m < jsonData[selected.courseIndex].packs[selected.yearIndex].docs.length; m++) {
		if (jsonData[selected.courseIndex].packs[selected.yearIndex].docs[m].doc_name.toLowerCase() ==
			selected.doc) {
			selected.docLink = jsonData[selected.courseIndex].packs[selected.yearIndex].docs[m].doc_link;
			// force https
			selected.docLink = selected.docLink.replace('http', 'https');
			break;
		}
	}
	// open in iframe
	$('#iframe').attr('src', selected.docLink);
	// add loading indicator on logo
	$('#loader').addClass('active');
	// activate download & link buttons
	$('.button-download').removeClass('disabled').attr('href', selected.docLink);
	$('.button-link').removeClass('disabled').removeAttr('disabled');
	$('#pdf-dropdown').removeClass('disabled').dropdown({action:'nothing'});
	// change url to new params
	history.pushState(null, '', '?' + $.param(params) );
	// change tab title
	updateTabTitle();
	// enable dim function
	dimmable = true;
});
