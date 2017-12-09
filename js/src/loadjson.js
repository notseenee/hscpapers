/*------------------------------------------------------------------------------
loadjson.js
------------------------------------------------------------------------------*/

function loadJSON(url, name, xhr, callback) {
	// Check if local storage is supported
	if (typeof(Storage) !== 'undefined') {
		// Check if expired
		var expired = true;
		var cacheTimestamp = localStorage.getItem('timestamp');
		if (cacheTimestamp !== null) {
			// Calculate time difference
			var currentTime = new Date();
			var diff = currentTime.getTime() - new Date(cacheTimestamp).getTime();
			// If under a week old, use local storage
			if (diff < 1000*60*60*24*7) expired = false;
		} else {
			var newTimestamp = new Date();
			localStorage.setItem('timestamp', newTimestamp);
			console.log('Local storage - set new download date: ' + newTimestamp);
		}

		// Check if already in local storage and not expired
		var check = localStorage.getItem(name);
		if (check !== null && expired === false) {
			// Serve from local storage
			console.log('Serving from LocalStorage: ' + name);
			// Make sure to parse the JSON from string format
			var pass;
			try { pass = JSON.parse(check); }
			catch (err) {
				// Write error message
				var msg = 'Failed to parse ' + name + ' JSON from cache.\n' + err;
				// Display in console and alert
				console.error(msg);
				alert(msg + '\n\nPress OK to reload.');
				// Remove from local storage
				localStorage.removeItem(name);
				// Reload
				location.reload();
			}
			callback(pass); 
		} else {
			// Else, download and cache
			console.log('Downloading: ' + name);
			ajaxJSON(url, name, xhr, function(data){
				console.log('Downloaded and cached: ' + name);
				// Make sure to stringify the data
				localStorage.setItem(name, JSON.stringify(data));
				callback(data);
			});
		}

	} else {
		// No local storage available - download using ajax
		console.log('LocalStorage not available: ' + name);
		ajaxJSON(url, name, xhr, function(data){ callback(data); });
	}
}

function ajaxJSON(url, name, xhr, success) {
	// If there's an xhr progress function submitted
	if (xhr !== null) {
		$.ajax({ dataType: 'json', url: url, xhr: xhr, success: success });
	} else {
		$.ajax({ dataType: 'json', url: url, success: success });
	}
}

// Clear cache button
$('#clear-cache').click(function(){
	localStorage.clear();
	location.reload();
});
