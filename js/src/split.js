/*------------------------------------------------------------------------------
split.js
------------------------------------------------------------------------------*/

// if url has ?mode=split, open split view immediately
$(document).ready(function(){
	// open split view
	if (urlParam('mode') == 'split') {
		$('body').addClass('split');
		// show course2 dropdown
		$('#course-dropdown2').dropdown('show');
		// add mode to params
		params.mode = 'split';
	}
});

// activate split view
$('.button-split').click(function(){
	// add split class to body
	$('body').addClass('split');
	// show course2 dropdown if no doc is already selected
	if (!selected.course2 && !selected.year2 && !selected.doc2) {
		$('#course-dropdown2').dropdown('show');
	}
	// change url
	params.mode = 'split';
	history.pushState(null, '', '?' + $.param(params) );
	// update tab title
	updateTabTitle();
});

// exit split view
$('.button-splitexit').click(function(){
	// remove split class from body
	$('body').removeClass('split');
	// change url
	params.mode = 'normal';
	history.pushState(null, '', '?' + $.param(params) );
	// update tab title
	updateTabTitle();
});

// when a course is selected, populate year dropdown
$('#course-input2').change( function() {
	// get selected value
	selected.course2 = $('#course-input2')[0].value;
	// add to new params
	params.course2 = selected.course2;
	// add loading spinner to year dropdown
	$('#year-dropdown2').addClass('loading').removeClass('disabled');
	// loops through each element in json object to find index
	for (k = 0; k < jsonData.length; k++) {
		if (jsonData[k].course_name.toLowerCase() == selected.course2) {
			selected.courseIndex2 = k;
			break;
		}
	}
	// populates dropdown
	populateDropdown(jsonData[selected.courseIndex2].packs, 'year', '#year-menu2', true);
	// activates year dropdown
	$('#year-dropdown2')
		.removeClass('loading')
		.dropdown('restore defaults')
		.dropdown('show')
		.dropdown({ selectOnKeydown: false });
	// Select year from URL parameter
	if (url.year2) {
		$('#year-dropdown2')
			.dropdown('set selected', url.year2)
			.dropdown('hide');
		// if not found
		if ( !$('#year-dropdown2').dropdown('get value') ) urlNotFound('Year2');
	}
	// change url to new params
	history.pushState(null, '', '?' + $.param(params) );
});

// when a year is selected, populate docs dropdown
$('#year-input2').change( function() {
	// if year is blank for some reason, ignore
	if ($(this)[0].value === '') return;
	// get selected year
	selected.year2 = $('#year-input2')[0].value;
	// add to new params
	params.year2 = selected.year2;
	// add loading spinner to year dropdown
	$('#doc-dropdown2').addClass('loading').removeClass('disabled');
	// loops through each element in json object to find year index
	for (l = 0; l < jsonData[selected.courseIndex2].packs.length; l++) {
		if (jsonData[selected.courseIndex2].packs[l].year == selected.year2) {
			selected.yearIndex2 = l;
			break;
		}
	}
	// populates dropdown
	populateDropdown(jsonData[selected.courseIndex2].packs[selected.yearIndex2].docs,
		'doc_name', '#doc-menu2', false);
	// activate doc dropdown
	$('#doc-dropdown2')
		.removeClass('loading')
		.dropdown('restore defaults')
		.dropdown('show');
	// Select doc from URL parameter
	if (url.doc2) {
		$('#doc-dropdown2')
			.dropdown('set selected', url.doc2)
			.dropdown('hide');
		// if not found
		if ( !$('#doc-dropdown2').dropdown('get value') ) urlNotFound('Doc2');
	}
	// activate exam pack buttons and adds link
	// $('.button-exampack')
	// 	.removeClass('disabled')
	// 	.attr('href', jsonData[selected.courseIndex].packs[selected.yearIndex]['link']);
	// change url to new params
	history.pushState(null, '', '?' + $.param(params) );
});

// when a doc is selected, open it
$('#doc-input2').change( function(){
	// if selected doc is blank, ignore
	if ($(this)[0].value === '') return;
	// get selected doc
	selected.doc2 = $('#doc-input2')[0].value;
	// add to new params
	params.doc2 = selected.doc2;
	// loops thorugh each doc to find doc index
	for (m = 0; m < jsonData[selected.courseIndex2].packs[selected.yearIndex2].docs.length; m++) {
		if (jsonData[selected.courseIndex2].packs[selected.yearIndex2].docs[m].doc_name.toLowerCase() ==
			selected.doc2) {
			selected.docLink2 = jsonData[selected.courseIndex2].packs[selected.yearIndex2].docs[m].doc_link;
			// force https
			selected.docLink2 = selected.docLink2.replace('http', 'https');
			break;
		}
	}
	// open in iframe
	$('#iframe-split-right').attr('src', selected.docLink2);
	// add loading indicator on logo
	$('#loader').addClass('active');
	// activate download & link buttons
	// $('.button-download').removeClass('disabled').attr('href', selected.docLink);
	// $('.button-link').removeClass('disabled').removeAttr('disabled');
	// $('#pdf-dropdown').removeClass('disabled').dropdown({action:'nothing'});
	// change url to new params
	history.pushState(null, '', '?' + $.param(params) );
	// change tab title
	updateTabTitle();
	// enable dim function
	dimmable = true;
});

// when iframe finishes loading, remove loading indicator on logo
$('#iframe-split-right').on('load', function(){ $('#loader').removeClass('active'); });
