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
	var textNumber = Math.floor(Math.random()*texts.length);

	for (var i = 0; i<grandParent.children.length; i++) {	
		aunts = grandParent.children[i];
		for(var j = 0; j < aunts.children.length; j++){
			if(aunts.children[j].tagName != "LI" && aunts.children[j].tagName != "TIME"){
				try{
					console.log("all kinds of children: "+aunts.children[j].tagName);
					replace(aunts.children[j], aunts.children[j].offsetWidth, aunts.children[j].offsetHeight,textNumber);
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


function replace(element, width, height, textNumber){
	var html = '<img src="http://apollo-na-uploads.s3.amazonaws.com/1440642852/saltylol.jpg" ';
	// console.log("width: " + width);
	// console.log("height: " + height);
	
	switch(element.nodeName){
		case "H1":
			element.innerHTML = '<'+element.nodeName+texts[textNumber][0]+element.nodeName+'> ';
			break;	
		case "H2":
			element.innerHTML = '<'+element.nodeName+texts[textNumber][1]+element.nodeName+'> ';
			break;	
		case "P":
			element.innerHTML = '<'+element.nodeName+texts[textNumber][2]+element.nodeName+'> ';
			break;
		default:
			element.innerHTML = texts[textNumber][3] + width + '" width="' + height + '">';
	}
	
	// if(element.nodeName != 'href'){
	// 	element.innerHTML = '<'+element.nodeName+'>THIS WOULD HAVE CORRUPTED YOUR BRAIN!!</'+element.nodeName+'> ';
	// }
	// else{
	// 	element.innerHTML = html + width + '" width="' + height + '">';
	// }
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

var standardFormat = ['></','></','></','<img src=""']
var yemenTree = ['>Strange Roots</','>National tree of Yemen<' ,'>Socotra Island, located off the southeast coast of Yemen, is known for its lush biodiversity—and strange plant life. Dracaena cinnabari—more commonly known as the dragon’s blood tree—is the island’s iconic species, with its upturned branches perfectly adapted to capturing moisture.</','<img src="http://images.nationalgeographic.com/wpf/media-live/photos/000/932/cache/socotra-island-ngpc2015_93269_990x742.jpg"'];
var moroccoFestival = ['>Festival Gnaoua</','>Gnawa music festival held annually in Essaouira, Morocco</','>The festival provides a platform for exchanges and a meeting point of music and dialogue between foreign artists and the mystical Gnaoua (also Gnawa) musicians. In this melting-pot of musical fusion, the Gnaoua masters invite players of jazz, pop, rock and contemporary World music to explore new avenues. The festivals see up to 500,000 visitors every year over four days, many of the performances can be viewed for free, which complicates comparison with other festivals.</','<img src="https://www.fest300.com/system/images/W1siZiIsIjIwMTQvMDQvMTkvMTkvNTEvMzIvNjYvR25hb3VhX011c2ljX0Zlc3RpdmFsX1ZpbmNlX01pbGxldHRfQ0NfaHR0cGZsaWMua3JwNTRCQVl2XzA5LmpwZyJdXQ/Gnaoua_Music_Festival_Vince_Millett_CC_httpflic.krp54BAYv%20-%2009.jpg"']


var texts = [yemenTree, moroccoFestival];

