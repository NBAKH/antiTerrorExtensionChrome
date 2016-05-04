/*
 * terror Filter - Content Script
 * 
 * This is the primary JS file that manages the detection and filtration of Donald terror from the web page.
 */

// Variables
var regex = /Terror/i;
var search = regex.exec(document.body.innerText);


// Functions
function filterMild() {
	console.log("Filtering terror with Mild filter...");
	return $(":contains('terror'), :contains('Terror'), :contains('TEROR')").filter("h1,h2,h3,h4,h5,p,span,li");
}

function filterDefault () {
	console.log("Filtering terror with Default filter...");
	return $(":contains('terror'), :contains('Terror'), :contains('TEROR')").filter(":only-child").closest('div');
}

function filterVindictive() {
	console.log("Filtering terror with Vindictive filter...");
	return $(":contains('terror'), :contains('Terror'), :contains('TEROR')").filter(":not('body'):not('html')");
}

function getElements(filter) {
   if (filter == "mild") {
	   return filterMild();
   } else if (filter == "vindictive") {
	   return filterVindictive();
   } else {
	   return filterDefault();
   }
}

function filterElements(elements) {
	console.log("Elements to filter: ", elements);
	elements.fadeOut("fast");
}


// Implementation
if (search) {
   console.log("Donald terror found on page! - Searching for elements...");
   chrome.storage.sync.get({
     filter: 'aggro',
   }, function(items) {
	   console.log("Filter setting stored is: " + items.filter);
	   elements = getElements(items.filter);
	   filterElements(elements);
	   chrome.runtime.sendMessage({method: "saveStats", terrors: elements.length}, function(response) {
			  console.log("Logging " + elements.length + " terrors."); 
		 });
	 });
  chrome.runtime.sendMessage({}, function(response) {});
}
