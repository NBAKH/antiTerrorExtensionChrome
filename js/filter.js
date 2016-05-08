/*
 * terror Filter - Content Script
 * 
 * This is the primary JS file that manages the detection and filtration of terror from the web page.
 */

// Variables
var regex = /Terror/i;
var search = regex.exec(document.body.innerText);
var filterType = true;
var site = "";

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
	//console.log("url: "+document.URL);
	console.log("url: "+window.location.host);
	site = window.location.host;
	if (filter == "ignorant") {
		filterType = false;
	}
    else {
	   filterType = true;
   }
   console.log(filterType)
   return findingTerror();
}

function filterElements(elements) {
	console.log("Elements to filter: ", elements);
	//fading out elements.... 
	//elements.fadeOut("fast");
	
	if(filterType == false){
		fade(elements);
	}
	else{
		//replace elements	
		for(var i =0; i<= elements.length; i++){
			try{
				if(elements[i].offsetWidth != null && elements[i].offsetHeight != null){
					if(site== "politiken.dk"){
						iterateThrough(elements[i]);	
					}
					else{
						replace(elements[i], elements[i].offsetWidth, elements[i].offsetHeight);	
					}
					console.log(elements[i].nodeName);
				}
			}
			catch ( err ) {
         		console.log("caught exception");
      		}
		}		
	}
}

function iterateThrough(element){
	var parent = element.parentElement;
	//console.log("parent: "+parent.nodeName);
	var children = parent.children;
	var current = 0;
	var level = 2;
	var grandParent = parent.parentElement;

	// for (var i = 0; i<children.length; i++) {
	// 	//console.log("      children: " + children[i].nodeName);
	// 	replace(children[i], children[i].offsetWidth, children[i].offsetHeight);
	// }
	// console.log("grandparent size on x: " + grandParent.offsetWidth +" and on y: "+ grandParent.offsetHeight);
	

	for (var i = 0; i<grandParent.children.length; i++) {	
		aunts = grandParent.children[i];
		for(var j = 0; j < aunts.children.length; j++){
			if(aunts.children[j].tagName != "LI"){
				try{
					console.log("all kinds of children: "+aunts.children[j].tagName);
					replace(aunts.children[j], aunts.children[j].offsetWidth, aunts.children[j].offsetHeight);
				}
				catch(err){console.log("caught exception");}
			}
		}
		
	}
	
}

function fade(elements) {
	//fading out elements.... 
	elements.fadeOut("fast");
}


function replace(element, width, height){
	var html = '<img src="http://apollo-na-uploads.s3.amazonaws.com/1440642852/saltylol.jpg" ';
	// console.log("width: " + width);
	// console.log("height: " + height);
	if(element.nodeName != 'href'){
		element.innerHTML = '<'+element.nodeName+'>THIS WOULD HAVE CORRUPTED YOUR BRAIN!!</'+element.nodeName+'> ';
	}
	else{
		element.innerHTML = html + width + '" width="' + height + '">';
	}
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

	   filterElements(elements);
	   chrome.runtime.sendMessage({method: "saveStats", terror: elements.length}, function(response) {
			  console.log("Logging " + elements.length + " terror actions."); 
		 });
	 });
  chrome.runtime.sendMessage({}, function(response) {});
}


