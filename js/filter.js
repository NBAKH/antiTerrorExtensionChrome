/*
 * terror Filter - Content Script
 * 
 * This is the primary JS file that manages the detection and filtration of terror from the web page.
 */

// Variables
var regex = /Terror/i;
var search = regex.exec(document.body.innerText);
var filterType = ""


// Functions
//search function using regular expressions. 
function findingTerror() {
	console.log("Filtering terror ...");
	return $(":contains('terror'), :contains('Terror'), :contains('TERROR')").filter("h1,h2,h3,h4,h5,p,span,li");
}

function filterDefault () {
	console.log("Filtering terror with Default filter...");
	return $(":contains('terror'), :contains('Terror'), :contains('TERROR')").filter(":only-child").closest('div');
}

function filterVindictive() {
	console.log("Filtering terror with Vindictive filter...");
	return $(":contains('terror'), :contains('Terror'), :contains('TERROR')").filter(":not('body'):not('html')");
}


//which mode is selected?? use that mode for filtering
function getElements(filter) {
   /*if (filter == "mild") {
	   return filterMild();
   } else if (filter == "vindictive") {
	   return filterVindictive();
   } else {
	   return filterDefault();
   }*/
   return findingTerror();
}

function filterElements(elements) {
	console.log("Elements to filter: ", elements);
	//fading out elements.... 
	//elements.fadeOut("fast");
	
	//replace elements	
	for(var i =0; i<= elements.length; i++){
		if(elements[i].offsetWidth != null && elements[i].offsetHeight != null){
			replace(elements[i], elements[i].offsetWidth, elements[i].offsetHeight);
		}
		/*var width = elements[i].offsetWidth;
		console.log(width);
		console.log("element height: " + elements[i].offsetHeight);*/
		//(elements[i].id);

	}
}

function fade(elements) {
	//fading out elements.... 
	elements.fadeOut("fast");
}


function replace(element, width, height){
	var html = '<img src="http://apollo-na-uploads.s3.amazonaws.com/1440642852/saltylol.jpg" ';
	console.log("width: " + width);
	console.log("height: " + height);
	element.innerHTML = html + width + '" width="' + height + '">';
}

// Implementation
// if the regex returns results we are executing this part of the code
if (search) {
   //console.log("Terror found on page! - Searching for elements...");
   chrome.storage.sync.get({
     filter: 'aggro',
   }, function(items) {
	   console.log("Filter setting stored is: " + items.filter);
	   //getting elements according to filter settings
	   elements = getElements(items.filter);
	   //console.log("this is the element: " + elements);
	   /*for(var i =0; i<= elements.length; i++){
	   	//console.log(elements[i].parentElement);
   		console.log("element number " + i + ":" + elements[i]);
	   }*/

	   filterElements(elements);
	   chrome.runtime.sendMessage({method: "saveStats", terrors: elements.length}, function(response) {
			  console.log("Logging " + elements.length + " terror actions."); 
		 });
	 });
  chrome.runtime.sendMessage({}, function(response) {});
}


