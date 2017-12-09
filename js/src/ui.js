/*------------------------------------------------------------------------------
ui.js
------------------------------------------------------------------------------*/

// when link button is clicked, show prompt
$('.button-link').click( function(){ prompt('Copy link below:', selected.docLink); });
// when about button is clicked, show modal
$('.button-about').click( function(){ $('#about-modal').modal('show'); });
// if from /about, remove ?open=about from url
$('#close-modal').click( function(){
	if (urlParam('open') == 'about') history.pushState(null, '', '?');
});
// when iframe finishes loading, remove loading indicator on logo
$('#iframe').on('load', function(){ $('#loader').removeClass('active'); });
