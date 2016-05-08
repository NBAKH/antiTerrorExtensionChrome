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
						replace(elements[i], elements[i].offsetWidth, elements[i].offsetHeight, Math.floor(Math.random()*texts.length));	
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
		case "LI":
			element.innerHTML = '<'+element.nodeName+texts[textNumber][0]+element.nodeName+'> '+texts[textNumber][3] + width + '" width="' + height + '">';
			break;
		case "H3":
			element.innerHTML = '<'+element.nodeName+texts[textNumber][1]+element.nodeName+'> '+'<'+element.nodeName+texts[textNumber][2]+element.nodeName+'> ';
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
var camelRaceSaudi = ['>Camel racing</','>Pakistan, Saudi Arabia, Egypt, Bahrain, Jordan, Qatar, United Arab Emirates, Oman, Australia, and Mongolia</','>Camel racing is fun and has a long Arabian history. This event features camels competing to get to the finish line, surrounded by sounds of cheers, car engines, and shouts of the camels’ names.<br>Camel racing is an ancient tradition when Bedouin organized races for a thousand camels in the middle of the vast desert. For more excitement, thousands of spectators compete in 4x4 cars beside the racing camels. <br>The award for the winning camel goes up to hundreds of thousands of riyals, in addition to the reputation for the camel breeding winners. Before the race, camels are gathered and classified into groups according to gender and age. The owners and trainers train their animals every day for several weeks before the race to make sure they are well prepared.</','<img src="http://4.bp.blogspot.com/_4XMbo8Bae0Y/TQEUuBYqhzI/AAAAAAAAAVg/DSRZM-RQqCo/s1600/camel-racing.jpg"']
var mosqueEmirates = ['>Sheikh Zayed Grand Mosque</','>Beautiful mosque located in Abu Dhabi</','>he Sheikh Zayed Grand Mosque is a mammoth modern mosque of incredible beauty. Harnessing contemporary design and ancient craftsmanship skills, the mosque is a harmonious blend of modern and old. It does not fail to dazzle all who enter with its lavish use of gold, mosaic work and glass work, marble in gigantic proportions and blindingly white stone contrasting dramatically under the Emirati blue sky.</','<img src="http://www.planetware.com/photos-large/UAE/uae-abu-dhabi-sheikh-ziyeed-grand-mosque.jpg"']
var nationalPark = ['>Band-e Amir National Park</','>National park in the Bamyan Province</','>Band-e Amir National Park (Persian: بند امیر‎‎) is Afghanistan s first national park, located in the Bamyan Province.[1] It is a series of six deep blue lakes separated by natural dams made of travertine, a mineral deposit. The lakes are situated in the Hindu Kush mountains of central Afghanistan at approximately 3000 m of elevation, west of the famous Buddhas of Bamiyan.</','<img src="https://upload.wikimedia.org/wikipedia/commons/a/aa/Afghanistan%27s_Grand_Canyon.jpg"']
var cottonFestival = ['>Cotton Festival</','>Festival in Aleppo</','>Every year in July, Aleppo shows the rest of the country just what it has to offer. The region produces almost all of Syria’s cotton exports and during the annual Cotton Festival, factories open their doors to boast their wares and their skills. Locals from all over the country attend the event, not only to learn new and valuable skills but also to buy 100 percent cotton goods at a fraction of the usual price.</','<img src="http://images.delcampe.com/img_large/auction/000/212/709/519_001.jpg?v=2"']
var masgouf = ['>Masgouf - Grilled Fish</','>an Iraqi National Dish</','>Masgouf is a grilled fish delicacy considered by many as the national dish of Iraq. Our first magouf experience was at an Iraqi restaurant in Dubai called ‘Al Maskoof Al Iraqi‘. We were served a large Iraqi carp that weighed around 4 kilograms. This moist and flaky fish became the most significant meal of our time in Dubai. Since then we were looking forward to feature it on hissing cooker.</','<img src="http://hissingcooker.com/wp-content/uploads/2015/12/masgouf-grilled-fish-grill-fish-healthy-recipe-hissing-cooker.jpg"']
var standardFormat = ['></','></','></','<img src=""']

var texts = [yemenTree, moroccoFestival, camelRaceSaudi, mosqueEmirates, nationalPark, cottonFestival, masgouf];

