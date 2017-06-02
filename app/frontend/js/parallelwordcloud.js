


var result;

// Get the modal
var modal = document.getElementById('myModal');
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal 
function openModal() {
    modal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

function addDateInput(n){
	var modContent = document.getElementById('DateSelection');
	modContent.innerHTML = '';
	console.log("number of corpus" + n);
	if (n > 10){
		modContent.innerHTML = "Too much splits";
		exit();
	}
	
	for (i=1; i<Number(n)+1; i++){
		line = 'Corpus ' + i + ' start: <input name="Corpus'+i+'-start" type="date" min="1794-06-13" max="1805-12-31" value="1794-06-13"></input> '
				+'end: <input name= "Corpus'+i+'-end" type="date"  min="1794-06-13" max="1805-12-31"  value="1794-12-31"></input><br>';
		modContent.innerHTML += line;
	}
}

//PARALLEL WORDCLOUDS
function hashCode(str) { // java String#hashCode
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
       hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
} 

function intToRGB(i){
    var c = (i & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();

    return "00000".substring(0, 6 - c.length) + c;
}

function createForeignObject(cont,x ,y , size){

	var fo = document.createElementNS('http://www.w3.org/2000/svg',"foreignObject");
	fo.setAttribute("x",x);
	fo.setAttribute("y",y);
	fo.setAttribute('width', "100%");
    fo.setAttribute('height',"100%");
	var div = document.createElement("div");
	div.setAttribute("id", "ptagdiv");
	div.style.backgroundColor = "#" + intToRGB(hashCode(cont));
	div.style.fontSize = String(size)+"px";
	div.innerHTML= cont;
	fo.append(div);
	console.log("foreignObject created" + intToRGB(hashCode(w)));
	return fo;

}

function createSVGContent(svgelement, wordData){
	var x = 40;
	var y = 20;
	var ydelta = 40;
	var xdelta = 200;

	//var connectWords = {};
	//
	////Find out if there are words to connect
	//console.log(Object.keys(wordData).length);
	//for(var i = 1; i < Object.keys(wordData).length; i++) {
	//	console.log(i);
	//
	//	corpusKeys1 = Object.keys(wordData[Object.keys(wordData)[i]]);
	//
	//	corpusKeys2 = Object.keys(wordData[Object.keys(wordData)[i-1]]);
	//	console.log(corpusKeys1);
	//	var common = $.grep(corpusKeys1, function(element) {
	//		    return $.inArray(element, corpusKeys2 ) !== -1;});
	//
	//	for (var w in common){
	//		connectWords[Object.keys(wordData)[i]] = {};
	//		connectWords[Object.keys(wordData)[i]][w] = {};
	//	}
	//}
	//console.log("connect Words:");
	//console.log(connectWords);

	var i = 0 ;
	for (corp in wordData){
		var y = 20;
		for (w in wordData[corp]){
			var fsize = wordData[corp][w]; 
			console.log(w + " " + fsize + "x: " + x);
			y = y + ydelta;
			svgelement.append(createForeignObject(w,x,y,fsize));

		}
		x = x + xdelta;
		i = i + 1;
	}


}
function CorpusSelectionSubmit(){
	console.log("submit the corpusdates");
	
	 event.preventDefault();
	myForm = document.getElementById("CorpusSelectionForm");
	var formData = new FormData(myForm);
	result = {};

    for (var entry of formData.entries())
    {
		if(result.hasOwnProperty(entry[0].split('-')[0])){
			result[entry[0].split('-')[0]][entry[0].split('-')[1]]=entry[1];
		}else{
			result[entry[0].split('-')[0]]={};
			result[entry[0].split('-')[0]][entry[0].split('-')[1]]=entry[1];
		}
		console.log(entry);
    }
	console.log(JSON.stringify(result));
	modal.style.display = "none";
	updateApplicationWindow();
}

function updateApplicationWindow(){
	CreateParallelWordClouds();
	
}


function CreateParallelWordClouds(j){
	console.log("Creating wordclouds");
	
	var api = "http://0.0.0.0:5000/ptagcloudapi";
	var xhr = new XMLHttpRequest();
	xhr.open('POST', 'http://0.0.0.0:5000/ptagcloudapi', true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.onload = function(e) {
		console.log("wordcloud xhr-onload");

		//Cleaning the Application node
		
		node = document.getElementById("app");
		while (node.firstChild) {
			node.removeChild(node.firstChild);
		}
		//var table = document.createElement("table");
		//table.setAttribute("id","wordcloudtable");
		//row = document.createElement("tr");
		//table.appendChild(row);
		//node.appendChild(table);
		//console.log(JSON.parse(this.response));
		var objResponse = JSON.parse(this.response);
		
		//LOOP ADDING THE WORD COLUMNS
		var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		svg.setAttribute ("width","100%");
		svg.setAttribute ("height","100%");
		svg.setAttribute ("style", "border:2px solid #000000") ;
		svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");

		node.append(svg);		
		createSVGContent(svg, objResponse);

		//for (var corp in objResponse){
		//	console.log(objResponse[corp]);
		//	var col = document.createElement("td");
		//	
		//	for (var w in objResponse[corp]){
		//		console.log(w);
		//		var freq = objResponse[corp][w];
		//		console.log(freq);
		//		
		//		var entry = document.createElement("tr");
		//		var entryDiv = document.createElement("div");
		//		entryDiv.setAttribute("id","ptagdiv");
		//		entryDiv.style.fontSize = String(freq)+"px";	
		//		
		//		entryDiv.innerHTML += w;
		//		var colorEntry = intToRGB(hashCode(w));
		//		console.log(colorEntry);
		//		entryDiv.style.backgroundColor = "#" + colorEntry;
		//		
		//		
		//		entry.append(entryDiv);
		//		col.append(entry);
		//	}
		//row.appendChild(col);
		//
		//}
	}
	
	
	xhr.send(JSON.stringify(result));	
	console.log("Wordclouds Created");	
}


