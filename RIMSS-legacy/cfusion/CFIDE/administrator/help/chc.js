/*
	Copyright (C) 2009 Adobe Systems.
*/

// initialize temporary variables
var found = false;
var ahHomeValue;
var page = extractRequestParameter('page');

/*
	The function processes the query from HIL and redirect accordingly. This is the method that is 
	invoked by the HTML page.
*/
function processQuery() {
	readFileHttp('helpmap.txt', helpMapHandler);
}

/* 
	Read a file  using xmlhttprequest 

	If the HTML file with your javascript app has been saved to disk, 
	this is an easy way to read in a data file.  Writing out is 
	more complicated and requires either an ActiveX object (IE) 
	or XPCOM (Mozilla).

	fname - relative path to the file
	callback - function to call with file text
*/
function readFileHttp(fname, callback) {
   var xmlhttp = getXmlHttp();
   xmlhttp.onreadystatechange = function() {
		// if the ready state indicates file load is complete
		// invoke the call back function
		if(this.readyState == 4) { 
			// check if the file was actually found on the server
			// this is indicated by HTTP status code 200
			// a local file return HTTP 0 :)
			if(this.status == 200 || this.status == 0) {
				return callback(xmlhttp.responseText);
			}
		}
   }
   xmlhttp.open("GET", fname, true);
   xmlhttp.send(null);
}

/*
	Return a cross-browser xmlhttp request object.
*/
function getXmlHttp() {
   if (window.XMLHttpRequest) {
      xmlhttp=new XMLHttpRequest();
   } else if (window.ActiveXObject) {
      xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
   }
   if (xmlhttp == null) {
      // the browser does not support AJAX
	  // return and fall back to META refresh
	  document.getElementById('contents').innerHTML = '<p>Redirecting...!</p>';
   }
   return xmlhttp;
}

/*
	The function pases the helpmap.txt file looking for the given pageID. If it
	is not found, the value for AH_HOME is used. In case of any error, the function
	would terminate and logic would fall back to META refresh.
*/
function helpMapHandler(x) {
	// extract individual line from input
	var lines = x.split('\n');
	for(var i = 0; i < lines.length; i++ ) {
		// tokenize each line - these are tab separated
		var tokens = lines[i].split('\t');
		// check if atleast 2 tokens are present
		if(tokens.length > 2) {
			if(tokens[0] == page) {
				found = true;
				redirect(tokens[1]);
				break;
			}
			if(tokens[0] == 'AH_HOME') {
				ahHomeValue = tokens[1];
			}
		}
	}

	if(!found) {
		redirect(ahHomeValue);
	}
}

/*
	The function extracts the query parameters from the request, for the given
	named parameter. If the parameter is not found, an empty String is returned.
*/
function extractRequestParameter(name) {
	name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
	var regexS = "[\\?&]"+name+"=([^&#]*)";
	var regex = new RegExp( regexS );
	var results = regex.exec( window.location.href );
	if( results == null ) {
		return "";
	}
    return results[1];
}

/*
	Redirect the document to the given URI
*/
function redirect(x) {
	location.replace(x);
}
