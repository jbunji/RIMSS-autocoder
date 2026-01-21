
// parseUri 1.2.2
// (c) Steven Levithan <stevenlevithan.com>
// MIT License

function parseUri (str) {
	var	o   = parseUri.options,
		m   = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
		uri = {},
		i   = 14;

	while (i--) uri[o.key[i]] = m[i] || "";

	uri[o.q.name] = {};
	uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
		if ($1) uri[o.q.name][$1] = $2;
	});

	return uri;
};

parseUri.options = {
	strictMode: false,
	key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
	q:   {
		name:   "queryKey",
		parser: /(?:^|&)([^&=]*)=?([^&]*)/g
	},
	parser: {
		strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
		loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
	}
};






var d = new Date().getTime();
var rootpath = findExportRootPath();
var uniqueString = "";
var returnLink="";

function viewport()
{
var e = window
, a = 'inner';
if ( !( 'innerWidth' in window ) )
{
a = 'client';
e = document.documentElement || document.body;
}
return { width : e[ a+'Width' ] , height : e[ a+'Height' ] }
}




function getFirstKeyName(obj)
{	
	for (var name in obj) {
		return name;
		break;
	}
}
function getFirstKeyValue(obj)
{	
	for (var name in obj) {
		return obj[name];
		break;
	}
}

function setUniqueString(s)
{

	uniqueString = s;

}

function getUniqueString()
{

	return uniqueString;

}

function setReturnLink(link)
{

	returnLink = link;

}

function getReturnLink()
{

	return returnLink;

}

function findExportRootPath()
{
	var url = parseUri (location.href)
	var path = url.path;
	var re = new RegExp("^/{1}.[A-Za-z0-9_-]+");
	var m = re.exec(path);
	var s = "";
	if(m!=null)
	{
		for (i = 0; i < m.length; i++) {
		  s = s + m[i];
		}
	}	
	
}

function setExportRootPath(root)
{
	if (root) {
		rootpath = root;
	}
}

function escapeHTML(str) {                                       
        return(                                                                 
            str.replace(/&/g,'&amp;').                                         
                replace(/>/g,'&gt;').                                           
                replace(/</g,'&lt;').                                           
                replace(/"/g,'&quot;')                                         
        );                                                                     
    };	

function setupPrintLink(id,title,cssFile){
	
	$('.printLink').css('cursor','pointer');
	$('.printLink').click(function() 
		{ 
		var content = "";
		for (var i = 0; i < id.length; i++) {
			var curId = document.getElementById(id[i]);
			var node = $(curId).get(0).nodeName;
			if (node.toUpperCase() == 'TABLE') {
				var printDiv = $('<div id="printFriendly">').append($(curId).clone());
			}
			else {
				var printDiv = $(curId).clone();
			}
			if(i > 0){
				content +="<hr/>";
			}
			content += "<div>" + printDiv.html()+ "</div>";
			
		}
		
		printWindow(content,title,cssFile);
		return false;
 
		});
		
	}

function setupPDFLink(id,title,pdfTitle,cssFile){
	$('.pdfLink').css('cursor','pointer');
	$('.pdfLink').click(function() 
		{ 
		
		var contentArray=[];
		for (var i = 0; i < id.length; i++) {
			
			var curId = document.getElementById(id[i]);

			
			var w = $(curId).width();
			var node = $(curId).get(0).nodeName;
			if (node.toUpperCase() == 'TABLE') {
				$(curId).attr({
					'cellpadding': "0",
					'cellspacing': '0'
				})
				var pdfDiv = $('<div id="printPDFDoc" class="exportTable">').append($(curId).clone());
			}
			else {
			
				var pdfDiv = $(curId).clone();
				
				$(pdfDiv).find('TABLE').attr({
					'cellpadding': "0",
					'cellspacing': '0'
				})
				$(pdfDiv).addClass('exportTable');
			}
			
			var content = $(pdfDiv).outerHTML();
			$(content).addClass("exportTable");
			contentArray.push(escapeHTML(content));
			
		}
		
		  printPDF(contentArray,title,pdfTitle,cssFile);
		  return false;	
		});
			
	}

function setupExcelLink(qry,headerColor,fontColor,columns,title){
	$('.excelLink').css('cursor','pointer');
	$('.excelLink').click(function() 
		{  
		
		 printExcel(qry,headerColor,fontColor,columns,title);			
		 return false;
		}); 
			
	}

function printWindow(content,title,cssFile) {
	 var s = rootpath;
	var w = screen.width;
	var h = 500;


	 if($.trim(title).length <=0)
	 {
	 	title = 'Print Document';
	 }
	 top.consoleRef=window.open('','printWindow',
	  'width='+w+',height='+h
	   +',menubar=1'
	   +',toolbar=1'
	   +',status=0'
	   +',scrollbars=1'
	   +',resizable=1');

	 top.consoleRef.document.writeln(
	  '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">'+
	  '<html>'+
	  '<head>'+
	  '<title>'+title+'</title>'+
	  '<link href="'+cssFile+'" rel="stylesheet" type="text/css">'
	  +'</head>'
	   +'<body style="margin:5px;padding:0px;" bgcolor=white class="exportTable">'
	   +content
	   +'</body>'
	   +'</html>'
	 );
	 top.consoleRef.focus();
	 top.consoleRef.document.close();
	}
	

function setupTable(){

		$(".exportTable table").find("tr:even").addClass("alt");
		$(".exportTable table tr").mouseover(function(){
			$(this).addClass('over');
			
			});
		$(".exportTable table tr").mouseout(function(){
			$(this).removeClass('over');
			
			});
		
		$(".exportTable table td").find("a").each(function(){
			$(this).parent().text($(this).text());
		});


}
	
	
function printPDF(content, title, pdfTitle,cssFile){
	var s = rootpath;
	
	
	var name = [];
	var data = [];
	var columns = [];
	var formfields = {};
	
	if($.trim(title).length <=0)
	 {
	 	title = 'PDF Document';
	 }
	
	
	formfields.pdfContent=content.join('export_content');
	formfields.pdfTitle=pdfTitle;
	formfields.title=title;
	formfields.cssFile=cssFile;
	
	
	
	
	$.download(s+'export/assets/exportPage/exportDocument.cfm',formfields);
	return;
	}
	
function printExcel() {

	$('#exportExcelForm').submit();
	return;
	downloadFile();
	//alert('here');
	//$.download(s+'export/assets/exportPage/exportDocument.cfm',[],[]);

	return;

	}

function jsFormatString(str){
	str.replace(/"/g,'\"');
	str.replace(/'/g,"\'");
	return str;
}


function downloadFile(url,data,method){
	var s = rootpath;
	$.download(s+'export/assets/exportPage/exportDocument.cfm',"uniqueString=" + getUniqueString() + "&returnLink=" + getReturnLink(),method);
}

$.fn.serializeObject = function() 
 
{ 
    var o = {}; 
    var a = this.serializeArray(); 
    $.each(a, function() { 
        if (o[this.name]) { 
            if (!o[this.name].push) { 
                o[this.name] = [o[this.name]]; 
            } 
            o[this.name].push(this.value || ''); 
        } else { 
            o[this.name] = this.value || ''; 
        } 
    }); 
    return o; 
}; 


jQuery.fn.outerHTML = function(s) {     return s         ? this.before(s).remove()         : jQuery("<p>").append(this.eq(0).clone()).html(); };

jQuery.download = function(url, data, method){
	//url and data options required
	if( url && data ){ 
		//data can be string of parameters or array/object
		data = typeof data == 'string' ? data : jQuery.param(data);
		//split params into form inputs
		var inputs = '';
		jQuery.each(data.split('&'), function(){ 
			var pair = this.split('=');
			
			inputs+='<input type="hidden" name="'+ pair[0] +'" value="'+ pair[1] +'" />'; 
		});
		//send request
		jQuery('<form action="'+ url +'" method="'+ (method||'post') +'">'+inputs+'</form>')
		.appendTo('body').submit().remove();
	};
};






