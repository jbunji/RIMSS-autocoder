/*ADOBE SYSTEMS INCORPORATED
Copyright 2007 Adobe Systems Incorporated
All Rights Reserved.

NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the
terms of the Adobe license agreement accompanying it.  If you have received this file from a
source other than Adobe, then your use, modification, or distribution of it requires the prior
written permission of Adobe.*/
function cfinit(){
if(!window.ColdFusion){
ColdFusion={};
var $C=ColdFusion;
if(!$C.Ajax){
$C.Ajax={};
}
var $A=$C.Ajax;
if(!$C.AjaxProxy){
$C.AjaxProxy={};
}
var $X=$C.AjaxProxy;
if(!$C.Bind){
$C.Bind={};
}
var $B=$C.Bind;
if(!$C.Event){
$C.Event={};
}
var $E=$C.Event;
if(!$C.Log){
$C.Log={};
}
var $L=$C.Log;
if(!$C.Util){
$C.Util={};
}
var $U=$C.Util;
if(!$C.DOM){
$C.DOM={};
}
var $D=$C.DOM;
if(!$C.Spry){
$C.Spry={};
}
var $S=$C.Spry;
if(!$C.Pod){
$C.Pod={};
}
var $P=$C.Pod;
if(!$C.objectCache){
$C.objectCache={};
}
if(!$C.required){
$C.required={};
}
if(!$C.importedTags){
$C.importedTags=[];
}
if(!$C.requestCounter){
$C.requestCounter=0;
}
if(!$C.bindHandlerCache){
$C.bindHandlerCache={};
}
window._cf_loadingtexthtml="<div style=\"text-align: center;\">"+window._cf_loadingtexthtml+"&nbsp;"+CFMessage["loading"]+"</div>";
$C.globalErrorHandler=function(_22c,_22d){
if($L.isAvailable){
$L.error(_22c,_22d);
}
if($C.userGlobalErrorHandler){
$C.userGlobalErrorHandler(_22c);
}
if(!$L.isAvailable&&!$C.userGlobalErrorHandler){
alert(_22c+CFMessage["globalErrorHandler.alert"]);
}
};
$C.handleError=function(_22e,_22f,_230,_231,_232,_233,_234,_235){
var msg=$L.format(_22f,_231);
if(_22e){
$L.error(msg,"http");
if(!_232){
_232=-1;
}
if(!_233){
_233=msg;
}
_22e(_232,_233,_235);
}else{
if(_234){
$L.error(msg,"http");
throw msg;
}else{
$C.globalErrorHandler(msg,_230);
}
}
};
$C.setGlobalErrorHandler=function(_237){
$C.userGlobalErrorHandler=_237;
};
$A.createXMLHttpRequest=function(){
try{
return new XMLHttpRequest();
}
catch(e){
}
var _238=["Microsoft.XMLHTTP","MSXML2.XMLHTTP.5.0","MSXML2.XMLHTTP.4.0","MSXML2.XMLHTTP.3.0","MSXML2.XMLHTTP"];
for(var i=0;i<_238.length;i++){
try{
return new ActiveXObject(_238[i]);
}
catch(e){
}
}
return false;
};
$A.isRequestError=function(req){
return ((req.status!=0&&req.status!=200)||req.getResponseHeader("server-error"));
};
$A.sendMessage=function(url,_23c,_23d,_23e,_23f,_240,_241){
var req=$A.createXMLHttpRequest();
if(!_23c){
_23c="GET";
}
if(_23e&&_23f){
req.onreadystatechange=function(){
$A.callback(req,_23f,_240);
};
}
if(_23d){
_23d+="&_cf_nodebug=true&_cf_nocache=true";
}else{
_23d="_cf_nodebug=true&_cf_nocache=true";
}
if(window._cf_clientid){
_23d+="&_cf_clientid="+_cf_clientid;
}
if(_23c=="GET"){
if(_23d){
_23d+="&_cf_rc="+($C.requestCounter++);
if(url.indexOf("?")==-1){
url+="?"+_23d;
}else{
url+="&"+_23d;
}
}
$L.info("ajax.sendmessage.get","http",[url]);
req.open(_23c,url,_23e);
req.send(null);
}else{
$L.info("ajax.sendmessage.post","http",[url,_23d]);
req.open(_23c,url,_23e);
req.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
if(_23d){
req.send(_23d);
}else{
req.send(null);
}
}
if(!_23e){
while(req.readyState!=4){
}
if($A.isRequestError(req)){
$C.handleError(null,"ajax.sendmessage.error","http",[req.status,req.statusText],req.status,req.statusText,_241);
}else{
return req;
}
}
};
$A.callback=function(req,_244,_245){
if(req.readyState!=4){
return;
}
req.onreadystatechange=new Function;
_244(req,_245);
};
$A.submitForm=function(_246,url,_248,_249,_24a,_24b){
var _24c=$C.getFormQueryString(_246);
if(_24c==-1){
$C.handleError(_249,"ajax.submitform.formnotfound","http",[_246],-1,null,true);
return;
}
if(!_24a){
_24a="POST";
}
_24b=!(_24b===false);
var _24d=function(req){
$A.submitForm.callback(req,_246,_248,_249);
};
$L.info("ajax.submitform.submitting","http",[_246]);
var _24f=$A.sendMessage(url,_24a,_24c,_24b,_24d);
if(!_24b){
$L.info("ajax.submitform.success","http",[_246]);
return _24f.responseText;
}
};
$A.submitForm.callback=function(req,_251,_252,_253){
if($A.isRequestError(req)){
$C.handleError(_253,"ajax.submitform.error","http",[req.status,_251,req.statusText],req.status,req.statusText);
}else{
$L.info("ajax.submitform.success","http",[_251]);
if(_252){
_252(req.responseText);
}
}
};
$C.empty=function(){
};
$C.setSubmitClicked=function(_254,_255){
var el=$D.getElement(_255,_254);
el.cfinputbutton=true;
$C.setClickedProperty=function(){
el.clicked=true;
};
$E.addListener(el,"click",$C.setClickedProperty);
};
$C.getFormQueryString=function(_257,_258){
var _259;
if(typeof _257=="string"){
_259=(document.getElementById(_257)||document.forms[_257]);
}else{
if(typeof _257=="object"){
_259=_257;
}
}
if(!_259||null==_259.elements){
return -1;
}
var _25a,elementName,elementValue,elementDisabled;
var _25b=false;
var _25c=(_258)?{}:"";
for(var i=0;i<_259.elements.length;i++){
_25a=_259.elements[i];
elementDisabled=_25a.disabled;
elementName=_25a.name;
elementValue=_25a.value;
if(!elementDisabled&&elementName){
switch(_25a.type){
case "select-one":
case "select-multiple":
for(var j=0;j<_25a.options.length;j++){
if(_25a.options[j].selected){
if(window.ActiveXObject){
_25c=$C.getFormQueryString.processFormData(_25c,_258,elementName,_25a.options[j].attributes["value"].specified?_25a.options[j].value:_25a.options[j].text);
}else{
_25c=$C.getFormQueryString.processFormData(_25c,_258,elementName,_25a.options[j].hasAttribute("value")?_25a.options[j].value:_25a.options[j].text);
}
}
}
break;
case "radio":
case "checkbox":
if(_25a.checked){
_25c=$C.getFormQueryString.processFormData(_25c,_258,elementName,elementValue);
}
break;
case "file":
case undefined:
case "reset":
break;
case "button":
_25c=$C.getFormQueryString.processFormData(_25c,_258,elementName,elementValue);
break;
case "submit":
if(_25a.cfinputbutton){
if(_25b==false&&_25a.clicked){
_25c=$C.getFormQueryString.processFormData(_25c,_258,elementName,elementValue);
_25b=true;
}
}else{
_25c=$C.getFormQueryString.processFormData(_25c,_258,elementName,elementValue);
}
break;
case "textarea":
var _25f;
if(window.FCKeditorAPI&&(_25f=$C.objectCache[elementName])&&_25f.richtextid){
var _260=FCKeditorAPI.GetInstance(_25f.richtextid);
if(_260){
elementValue=_260.GetXHTML();
}
}
_25c=$C.getFormQueryString.processFormData(_25c,_258,elementName,elementValue);
break;
default:
_25c=$C.getFormQueryString.processFormData(_25c,_258,elementName,elementValue);
break;
}
}
}
if(!_258){
_25c=_25c.substr(0,_25c.length-1);
}
return _25c;
};
$C.getFormQueryString.processFormData=function(_261,_262,_263,_264){
if(_262){
if(_261[_263]){
_261[_263]+=","+_264;
}else{
_261[_263]=_264;
}
}else{
_261+=encodeURIComponent(_263)+"="+encodeURIComponent(_264)+"&";
}
return _261;
};
$A.importTag=function(_265){
$C.importedTags.push(_265);
};
$A.checkImportedTag=function(_266){
var _267=false;
for(var i=0;i<$C.importedTags.length;i++){
if($C.importedTags[i]==_266){
_267=true;
break;
}
}
if(!_267){
$C.handleError(null,"ajax.checkimportedtag.error","widget",[_266]);
}
};
$C.getElementValue=function(_269,_26a,_26b){
if(!_269){
$C.handleError(null,"getelementvalue.noelementname","bind",null,null,null,true);
return;
}
if(!_26b){
_26b="value";
}
var _26c=$B.getBindElementValue(_269,_26a,_26b);
if(typeof (_26c)=="undefined"){
_26c=null;
}
if(_26c==null){
$C.handleError(null,"getelementvalue.elnotfound","bind",[_269,_26b],null,null,true);
return;
}
return _26c;
};
$B.getBindElementValue=function(_26d,_26e,_26f,_270,_271){
var _272="";
if(window[_26d]){
var _273=eval(_26d);
if(_273&&_273._cf_getAttribute){
_272=_273._cf_getAttribute(_26f);
return _272;
}
}
var _274=$C.objectCache[_26d];
if(_274&&_274._cf_getAttribute){
_272=_274._cf_getAttribute(_26f);
return _272;
}
var el=$D.getElement(_26d,_26e);
var _276=(el&&((!el.length&&el.length!=0)||(el.length&&el.length>0)||el.tagName=="SELECT"));
if(!_276&&!_271){
$C.handleError(null,"bind.getbindelementvalue.elnotfound","bind",[_26d]);
return null;
}
if(el.tagName!="SELECT"){
if(el.length>1){
var _277=true;
for(var i=0;i<el.length;i++){
var _279=(el[i].getAttribute("type")=="radio"||el[i].getAttribute("type")=="checkbox");
if(!_279||(_279&&el[i].checked)){
if(!_277){
_272+=",";
}
_272+=$B.getBindElementValue.extract(el[i],_26f);
_277=false;
}
}
}else{
_272=$B.getBindElementValue.extract(el,_26f);
}
}else{
var _277=true;
for(var i=0;i<el.options.length;i++){
if(el.options[i].selected){
if(!_277){
_272+=",";
}
_272+=$B.getBindElementValue.extract(el.options[i],_26f);
_277=false;
}
}
}
if(typeof (_272)=="object"){
$C.handleError(null,"bind.getbindelementvalue.simplevalrequired","bind",[_26d,_26f]);
return null;
}
if(_270&&$C.required[_26d]&&_272.length==0){
return null;
}
return _272;
};
$B.getBindElementValue.extract=function(el,_27b){
var _27c=el[_27b];
if((_27c==null||typeof (_27c)=="undefined")&&el.getAttribute){
_27c=el.getAttribute(_27b);
}
return _27c;
};
$L.init=function(){
if(window.YAHOO&&YAHOO.widget&&YAHOO.widget.Logger){
YAHOO.widget.Logger.categories=[CFMessage["debug"],CFMessage["info"],CFMessage["error"],CFMessage["window"]];
YAHOO.widget.LogReader.prototype.formatMsg=function(_27d){
var _27e=_27d.category;
return "<p>"+"<span class='"+_27e+"'>"+_27e+"</span>:<i>"+_27d.source+"</i>: "+_27d.msg+"</p>";
};
var _27f=new YAHOO.widget.LogReader(null,{width:"30em",fontSize:"100%"});
_27f.setTitle(CFMessage["log.title"]||"ColdFusion AJAX Logger");
_27f._btnCollapse.value=CFMessage["log.collapse"]||"Collapse";
_27f._btnPause.value=CFMessage["log.pause"]||"Pause";
_27f._btnClear.value=CFMessage["log.clear"]||"Clear";
$L.isAvailable=true;
}
};
$L.log=function(_280,_281,_282,_283){
if(!$L.isAvailable){
return;
}
if(!_282){
_282="global";
}
_282=CFMessage[_282]||_282;
_281=CFMessage[_281]||_281;
_280=$L.format(_280,_283);
YAHOO.log(_280,_281,_282);
};
$L.format=function(code,_285){
var msg=CFMessage[code]||code;
if(_285){
for(i=0;i<_285.length;i++){
if(!_285[i].length){
_285[i]="";
}
var _287="{"+i+"}";
msg=msg.replace(_287,_285[i]);
}
}
return msg;
};
$L.debug=function(_288,_289,_28a){
$L.log(_288,"debug",_289,_28a);
};
$L.info=function(_28b,_28c,_28d){
$L.log(_28b,"info",_28c,_28d);
};
$L.error=function(_28e,_28f,_290){
$L.log(_28e,"error",_28f,_290);
};
$L.dump=function(_291,_292){
if($L.isAvailable){
var dump=(/string|number|undefined|boolean/.test(typeof (_291))||_291==null)?_291:recurse(_291,typeof _291,true);
$L.debug(dump,_292);
}
};
$X.invoke=function(_294,_295,_296,_297,_298){
var _299="method="+_295+"&_cf_ajaxproxytoken="+_296;
var _29a=_294.returnFormat||"json";
_299+="&returnFormat="+_29a;
if(_294.queryFormat){
_299+="&queryFormat="+_294.queryFormat;
}
if(_294.formId){
var _29b=$C.getFormQueryString(_294.formId,true);
if(_297!=null){
for(prop in _29b){
_297[prop]=_29b[prop];
}
}else{
_297=_29b;
}
_294.formId=null;
}
var _29c="";
if(_297!=null){
_29c=$X.JSON.encode(_297);
_299+="&argumentCollection="+encodeURIComponent(_29c);
}
$L.info("ajaxproxy.invoke.invoking","http",[_294.cfcPath,_295,_29c]);
if(_294.callHandler){
_294.callHandler.call(null,_294.callHandlerParams,_294.cfcPath,_299);
return;
}
var _29d;
if(_294.async){
_29d=function(req){
$X.callback(req,_294,_298);
};
}
var req=$A.sendMessage(_294.cfcPath,_294.httpMethod,_299,_294.async,_29d,null,true);
if(!_294.async){
return $X.processResponse(req,_294);
}
};
$X.callback=function(req,_2a1,_2a2){
if($A.isRequestError(req)){
$C.handleError(_2a1.errorHandler,"ajaxproxy.invoke.error","http",[req.status,_2a1.cfcPath,req.statusText],req.status,req.statusText,false,_2a2);
}else{
if(_2a1.callbackHandler){
var _2a3=$X.processResponse(req,_2a1);
_2a1.callbackHandler(_2a3,_2a2);
}
}
};
$X.processResponse=function(req,_2a5){
var _2a6=true;
for(var i=0;i<req.responseText.length;i++){
var c=req.responseText.charAt(i);
_2a6=(c==" "||c=="\n"||c=="\t"||c=="\r");
if(!_2a6){
break;
}
}
var _2a9=(req.responseXML&&req.responseXML.childNodes.length>0);
var _2aa=_2a9?"[XML Document]":req.responseText;
$L.info("ajaxproxy.invoke.response","http",[_2aa]);
var _2ab;
var _2ac=_2a5.returnFormat||"json";
if(_2ac=="json"){
_2ab=_2a6?null:$X.JSON.decode(req.responseText);
}else{
_2ab=_2a9?req.responseXML:(_2a6?null:req.responseText);
}
return _2ab;
};
$X.init=function(_2ad,_2ae){
var _2af=_2ae.split(".");
var ns=self;
for(i=0;i<_2af.length-1;i++){
if(_2af[i].length){
ns[_2af[i]]=ns[_2af[i]]||{};
ns=ns[_2af[i]];
}
}
var _2b1=_2af[_2af.length-1];
if(ns[_2b1]){
return ns[_2b1];
}
ns[_2b1]=function(){
this.httpMethod="GET";
this.async=false;
this.callbackHandler=null;
this.errorHandler=null;
this.formId=null;
};
ns[_2b1].prototype.cfcPath=_2ad;
ns[_2b1].prototype.setHTTPMethod=function(_2b2){
if(_2b2){
_2b2=_2b2.toUpperCase();
}
if(_2b2!="GET"&&_2b2!="POST"){
$C.handleError(null,"ajaxproxy.sethttpmethod.invalidmethod","http",[_2b2],null,null,true);
}
this.httpMethod=_2b2;
};
ns[_2b1].prototype.setSyncMode=function(){
this.async=false;
};
ns[_2b1].prototype.setAsyncMode=function(){
this.async=true;
};
ns[_2b1].prototype.setCallbackHandler=function(fn){
this.callbackHandler=fn;
this.setAsyncMode();
};
ns[_2b1].prototype.setErrorHandler=function(fn){
this.errorHandler=fn;
this.setAsyncMode();
};
ns[_2b1].prototype.setForm=function(fn){
this.formId=fn;
};
ns[_2b1].prototype.setQueryFormat=function(_2b6){
if(_2b6){
_2b6=_2b6.toLowerCase();
}
if(!_2b6||(_2b6!="column"&&_2b6!="row")){
$C.handleError(null,"ajaxproxy.setqueryformat.invalidformat","http",[_2b6],null,null,true);
}
this.queryFormat=_2b6;
};
ns[_2b1].prototype.setReturnFormat=function(_2b7){
if(_2b7){
_2b7=_2b7.toLowerCase();
}
if(!_2b7||(_2b7!="plain"&&_2b7!="json"&&_2b7!="wddx")){
$C.handleError(null,"ajaxproxy.setreturnformat.invalidformat","http",[_2b7],null,null,true);
}
this.returnFormat=_2b7;
};
$L.info("ajaxproxy.init.created","http",[_2ad]);
return ns[_2b1];
};
$U.isWhitespace=function(s){
var _2b9=true;
for(var i=0;i<s.length;i++){
var c=s.charAt(i);
_2b9=(c==" "||c=="\n"||c=="\t"||c=="\r");
if(!_2b9){
break;
}
}
return _2b9;
};
$U.getFirstNonWhitespaceIndex=function(s){
var _2bd=true;
for(var i=0;i<s.length;i++){
var c=s.charAt(i);
_2bd=(c==" "||c=="\n"||c=="\t"||c=="\r");
if(!_2bd){
break;
}
}
return i;
};
$C.trim=function(_2c0){
return _2c0.replace(/^\s+|\s+$/g,"");
};
$U.isInteger=function(n){
var _2c2=true;
if(typeof (n)=="number"){
_2c2=(n>=0);
}else{
for(i=0;i<n.length;i++){
if($U.isInteger.numberChars.indexOf(n.charAt(i))==-1){
_2c2=false;
break;
}
}
}
return _2c2;
};
$U.isInteger.numberChars="0123456789";
$U.isArray=function(a){
return (typeof (a.length)=="number"&&!a.toUpperCase);
};
$U.isBoolean=function(b){
if(b===true||b===false){
return true;
}else{
if(b.toLowerCase){
b=b.toLowerCase();
return (b==$U.isBoolean.trueChars||b==$U.isBoolean.falseChars);
}else{
return false;
}
}
};
$U.isBoolean.trueChars="true";
$U.isBoolean.falseChars="false";
$U.castBoolean=function(b){
if(b===true){
return true;
}else{
if(b===false){
return false;
}else{
if(b.toLowerCase){
b=b.toLowerCase();
if(b==$U.isBoolean.trueChars){
return true;
}else{
if(b==$U.isBoolean.falseChars){
return false;
}else{
return false;
}
}
}else{
return false;
}
}
}
};
$U.checkQuery=function(o){
var _2c7=null;
if(o&&o.COLUMNS&&$U.isArray(o.COLUMNS)&&o.DATA&&$U.isArray(o.DATA)&&(o.DATA.length==0||(o.DATA.length>0&&$U.isArray(o.DATA[0])))){
_2c7="row";
}else{
if(o&&o.COLUMNS&&$U.isArray(o.COLUMNS)&&o.ROWCOUNT&&$U.isInteger(o.ROWCOUNT)&&o.DATA){
_2c7="col";
for(var i=0;i<o.COLUMNS.length;i++){
var _2c9=o.DATA[o.COLUMNS[i]];
if(!_2c9||!$U.isArray(_2c9)){
_2c7=null;
break;
}
}
}
}
return _2c7;
};
$X.JSON=new function(){
var _2ca={}.hasOwnProperty?true:false;
var _2cb=/^("(\\.|[^"\\\n\r])*?"|[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t])+?$/;
var pad=function(n){
return n<10?"0"+n:n;
};
var m={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r","\"":"\\\"","\\":"\\\\"};
var _2cf=function(s){
if(/["\\\x00-\x1f]/.test(s)){
return "\""+s.replace(/([\x00-\x1f\\"])/g,function(a,b){
var c=m[b];
if(c){
return c;
}
c=b.charCodeAt();
return "\\u00"+Math.floor(c/16).toString(16)+(c%16).toString(16);
})+"\"";
}
return "\""+s+"\"";
};
var _2d4=function(o){
var a=["["],b,i,l=o.length,v;
for(i=0;i<l;i+=1){
v=o[i];
switch(typeof v){
case "undefined":
case "function":
case "unknown":
break;
default:
if(b){
a.push(",");
}
a.push(v===null?"null":$X.JSON.encode(v));
b=true;
}
}
a.push("]");
return a.join("");
};
var _2d7=function(o){
return "\""+o.getFullYear()+"-"+pad(o.getMonth()+1)+"-"+pad(o.getDate())+"T"+pad(o.getHours())+":"+pad(o.getMinutes())+":"+pad(o.getSeconds())+"\"";
};
this.encode=function(o){
if(typeof o=="undefined"||o===null){
return "null";
}else{
if(o instanceof Array){
return _2d4(o);
}else{
if(o instanceof Date){
return _2d7(o);
}else{
if(typeof o=="string"){
return _2cf(o);
}else{
if(typeof o=="number"){
return isFinite(o)?String(o):"null";
}else{
if(typeof o=="boolean"){
return String(o);
}else{
var a=["{"],b,i,v;
for(var i in o){
if(!_2ca||o.hasOwnProperty(i)){
v=o[i];
switch(typeof v){
case "undefined":
case "function":
case "unknown":
break;
default:
if(b){
a.push(",");
}
a.push(this.encode(i),":",v===null?"null":this.encode(v));
b=true;
}
}
}
a.push("}");
return a.join("");
}
}
}
}
}
}
};
this.decode=function(json){
if(typeof json=="object"){
return json;
}
if($U.isWhitespace(json)){
return null;
}
var _2dd=$U.getFirstNonWhitespaceIndex(json);
if(_2dd>0){
json=json.slice(_2dd);
}
if(window._cf_jsonprefix&&json.indexOf(_cf_jsonprefix)==0){
json=json.slice(_cf_jsonprefix.length);
}
try{
if(_2cb.test(json)){
return eval("("+json+")");
}
}
catch(e){
}
throw new SyntaxError("parseJSON");
};
}();
if(!$C.JSON){
$C.JSON={};
}
$C.JSON.encode=$X.JSON.encode;
$C.JSON.decode=$X.JSON.decode;
$C.navigate=function(url,_2df,_2e0,_2e1,_2e2,_2e3){
if(url==null){
$C.handleError(_2e1,"navigate.urlrequired","widget");
return;
}
if(_2e2){
_2e2=_2e2.toUpperCase();
if(_2e2!="GET"&&_2e2!="POST"){
$C.handleError(null,"navigate.invalidhttpmethod","http",[_2e2],null,null,true);
}
}else{
_2e2="GET";
}
var _2e4;
if(_2e3){
_2e4=$C.getFormQueryString(_2e3);
if(_2e4==-1){
$C.handleError(null,"navigate.formnotfound","http",[_2e3],null,null,true);
}
}
if(_2df==null){
if(_2e4){
if(url.indexOf("?")==-1){
url+="?"+_2e4;
}else{
url+="&"+_2e4;
}
}
$L.info("navigate.towindow","widget",[url]);
window.location.replace(url);
return;
}
$L.info("navigate.tocontainer","widget",[url,_2df]);
var obj=$C.objectCache[_2df];
if(obj!=null){
if(typeof (obj._cf_body)!="undefined"&&obj._cf_body!=null){
_2df=obj._cf_body;
}
}
$A.replaceHTML(_2df,url,_2e2,_2e4,_2e0,_2e1);
};
$A.checkForm=function(_2e6,_2e7,_2e8,_2e9,_2ea){
var _2eb=_2e7.call(null,_2e6);
if(_2eb==false){
return false;
}
var _2ec=$C.getFormQueryString(_2e6);
$L.info("ajax.submitform.submitting","http",[_2e6.name]);
$A.replaceHTML(_2e8,_2e6.action,_2e6.method,_2ec,_2e9,_2ea);
return false;
};
$A.replaceHTML=function(_2ed,url,_2ef,_2f0,_2f1,_2f2){
var _2f3=document.getElementById(_2ed);
if(!_2f3){
$C.handleError(_2f2,"ajax.replacehtml.elnotfound","http",[_2ed]);
return;
}
var _2f4="_cf_containerId="+encodeURIComponent(_2ed);
_2f0=(_2f0)?_2f0+"&"+_2f4:_2f4;
$L.info("ajax.replacehtml.replacing","http",[_2ed,url,_2f0]);
if(_cf_loadingtexthtml){
try{
_2f3.innerHTML=_cf_loadingtexthtml;
}
catch(e){
}
}
var _2f5=function(req,_2f7){
var _2f8=false;
if($A.isRequestError(req)){
$C.handleError(_2f2,"ajax.replacehtml.error","http",[req.status,_2f7.id,req.statusText],req.status,req.statusText);
_2f8=true;
}
var _2f9=new $E.CustomEvent("onReplaceHTML",_2f7);
var _2fa=new $E.CustomEvent("onReplaceHTMLUser",_2f7);
$E.loadEvents[_2f7.id]={system:_2f9,user:_2fa};
if(req.responseText.search(/<script/i)!=-1){
try{
_2f7.innerHTML="";
}
catch(e){
}
$A.replaceHTML.processResponseText(req.responseText,_2f7,_2f2);
}else{
try{
_2f7.innerHTML=req.responseText;
}
catch(e){
}
}
$E.loadEvents[_2f7.id]=null;
_2f9.fire();
_2f9.unsubscribe();
_2fa.fire();
_2fa.unsubscribe();
$L.info("ajax.replacehtml.success","http",[_2f7.id]);
if(_2f1&&!_2f8){
_2f1();
}
};
try{
$A.sendMessage(url,_2ef,_2f0,true,_2f5,_2f3);
}
catch(e){
try{
_2f3.innerHTML=$L.format(CFMessage["ajax.replacehtml.connectionerrordisplay"],[url,e]);
}
catch(e){
}
$C.handleError(_2f2,"ajax.replacehtml.connectionerror","http",[_2ed,url,e]);
}
};
$A.replaceHTML.processResponseText=function(text,_2fc,_2fd){
var pos=0;
var _2ff=0;
var _300=0;
_2fc._cf_innerHTML="";
while(pos<text.length){
var _301=text.indexOf("<s",pos);
if(_301==-1){
_301=text.indexOf("<S",pos);
}
if(_301==-1){
break;
}
pos=_301;
var _302=true;
var _303=$A.replaceHTML.processResponseText.scriptTagChars;
for(var i=1;i<_303.length;i++){
var _305=pos+i+1;
if(_305>text.length){
break;
}
var _306=text.charAt(_305);
if(_303[i][0]!=_306&&_303[i][1]!=_306){
pos+=i+1;
_302=false;
break;
}
}
if(!_302){
continue;
}
var _307=text.substring(_2ff,pos);
if(_307){
_2fc._cf_innerHTML+=_307;
}
var _308=text.indexOf(">",pos)+1;
if(_308==0){
pos++;
continue;
}else{
pos+=7;
}
var _309=_308;
while(_309<text.length&&_309!=-1){
_309=text.indexOf("</s",_309);
if(_309==-1){
_309=text.indexOf("</S",_309);
}
if(_309!=-1){
_302=true;
for(var i=1;i<_303.length;i++){
var _305=_309+2+i;
if(_305>text.length){
break;
}
var _306=text.charAt(_305);
if(_303[i][0]!=_306&&_303[i][1]!=_306){
_309=_305;
_302=false;
break;
}
}
if(_302){
break;
}
}
}
if(_309!=-1){
var _30a=text.substring(_308,_309);
var _30b=_30a.indexOf("<!--");
if(_30b!=-1){
_30a=_30a.substring(_30b+4);
}
var _30c=_30a.lastIndexOf("//-->");
if(_30c!=-1){
_30a=_30a.substring(0,_30c-1);
}
if(_30a.indexOf("document.write")!=-1||_30a.indexOf("CF_RunContent")!=-1){
if(_30a.indexOf("CF_RunContent")!=-1){
_30a=_30a.replace("CF_RunContent","document.write");
}
_30a="var _cfDomNode = document.getElementById('"+_2fc.id+"'); var _cfBuffer='';"+"if (!document._cf_write)"+"{document._cf_write = document.write;"+"document.write = function(str){if (_cfBuffer!=null){_cfBuffer+=str;}else{document._cf_write(str);}};};"+_30a+";_cfDomNode._cf_innerHTML += _cfBuffer; _cfBuffer=null;";
}
try{
eval(_30a);
}
catch(ex){
$C.handleError(_2fd,"ajax.replacehtml.jserror","http",[_2fc.id,ex]);
}
}
_301=text.indexOf(">",_309)+1;
if(_301==0){
_300=_309+1;
break;
}
_300=_301;
pos=_301;
_2ff=_301;
}
if(_300<text.length-1){
var _307=text.substring(_300,text.length);
if(_307){
_2fc._cf_innerHTML+=_307;
}
}
try{
_2fc.innerHTML=_2fc._cf_innerHTML;
}
catch(e){
}
_2fc._cf_innerHTML="";
};
$A.replaceHTML.processResponseText.scriptTagChars=[["s","S"],["c","C"],["r","R"],["i","I"],["p","P"],["t","T"]];
$D.getElement=function(_30d,_30e){
var _30f=function(_310){
return (_310.name==_30d||_310.id==_30d);
};
var _311=$D.getElementsBy(_30f,null,_30e);
if(_311.length==1){
return _311[0];
}else{
return _311;
}
};
$D.getElementsBy=function(_312,tag,root){
tag=tag||"*";
var _315=[];
if(root){
root=$D.get(root);
if(!root){
return _315;
}
}else{
root=document;
}
var _316=root.getElementsByTagName(tag);
if(!_316.length&&(tag=="*"&&root.all)){
_316=root.all;
}
for(var i=0,len=_316.length;i<len;++i){
if(_312(_316[i])){
_315[_315.length]=_316[i];
}
}
return _315;
};
$D.get=function(el){
if(!el){
return null;
}
if(typeof el!="string"&&!(el instanceof Array)){
return el;
}
if(typeof el=="string"){
return document.getElementById(el);
}else{
var _319=[];
for(var i=0,len=el.length;i<len;++i){
_319[_319.length]=$D.get(el[i]);
}
return _319;
}
return null;
};
$E.loadEvents={};
$E.CustomEvent=function(_31b,_31c){
return {name:_31b,domNode:_31c,subs:[],subscribe:function(func,_31e){
var dup=false;
for(var i=0;i<this.subs.length;i++){
var sub=this.subs[i];
if(sub.f==func&&sub.p==_31e){
dup=true;
break;
}
}
if(!dup){
this.subs.push({f:func,p:_31e});
}
},fire:function(){
for(var i=0;i<this.subs.length;i++){
var sub=this.subs[i];
sub.f.call(null,this,sub.p);
}
},unsubscribe:function(){
this.subscribers=[];
}};
};
$E.windowLoadImpEvent=new $E.CustomEvent("cfWindowLoadImp");
$E.windowLoadEvent=new $E.CustomEvent("cfWindowLoad");
$E.windowLoadUserEvent=new $E.CustomEvent("cfWindowLoadUser");
$E.listeners=[];
$E.addListener=function(el,ev,fn,_327){
var l={el:el,ev:ev,fn:fn,params:_327};
$E.listeners.push(l);
var _329=function(e){
if(!e){
var e=window.event;
}
fn.call(null,e,_327);
};
if(el.addEventListener){
el.addEventListener(ev,_329,false);
return true;
}else{
if(el.attachEvent){
el.attachEvent("on"+ev,_329);
return true;
}else{
return false;
}
}
};
$E.isListener=function(el,ev,fn,_32e){
var _32f=false;
var ls=$E.listeners;
for(var i=0;i<ls.length;i++){
if(ls[i].el==el&&ls[i].ev==ev&&ls[i].fn==fn&&ls[i].params==_32e){
_32f=true;
break;
}
}
return _32f;
};
$E.callBindHandlers=function(id,_333,ev){
var el=document.getElementById(id);
if(!el){
return;
}
var ls=$E.listeners;
for(var i=0;i<ls.length;i++){
if(ls[i].el==el&&ls[i].ev==ev&&ls[i].fn._cf_bindhandler){
ls[i].fn.call(null,null,ls[i].params);
}
}
};
$E.registerOnLoad=function(func,_339,_33a,user){
if($E.registerOnLoad.windowLoaded){
if(_339&&_339._cf_containerId&&$E.loadEvents[_339._cf_containerId]){
if(user){
$E.loadEvents[_339._cf_containerId].user.subscribe(func,_339);
}else{
$E.loadEvents[_339._cf_containerId].system.subscribe(func,_339);
}
}else{
func.call(null,null,_339);
}
}else{
if(user){
$E.windowLoadUserEvent.subscribe(func,_339);
}else{
if(_33a){
$E.windowLoadImpEvent.subscribe(func,_339);
}else{
$E.windowLoadEvent.subscribe(func,_339);
}
}
}
};
$E.registerOnLoad.windowLoaded=false;
$E.onWindowLoad=function(fn){
if(window.addEventListener){
window.addEventListener("load",fn,false);
}else{
if(window.attachEvent){
window.attachEvent("onload",fn);
}else{
if(document.getElementById){
window.onload=fn;
}
}
}
};
$C.addSpanToDom=function(){
var _33d=document.createElement("span");
document.body.insertBefore(_33d,document.body.firstChild);
};
$E.windowLoadHandler=function(e){
if(window.Ext){
Ext.BLANK_IMAGE_URL=_cf_contextpath+"/CFIDE/scripts/ajax/resources/ext/images/default/s.gif";
}
$C.addSpanToDom();
$L.init();
$E.registerOnLoad.windowLoaded=true;
$E.windowLoadImpEvent.fire();
$E.windowLoadImpEvent.unsubscribe();
$E.windowLoadEvent.fire();
$E.windowLoadEvent.unsubscribe();
$E.windowLoadUserEvent.fire();
$E.windowLoadUserEvent.unsubscribe();
};
$E.onWindowLoad($E.windowLoadHandler);
$B.register=function(_33f,_340,_341,_342){
for(var i=0;i<_33f.length;i++){
var _344=_33f[i][0];
var _345=_33f[i][1];
var _346=_33f[i][2];
if(window[_344]){
var _347=eval(_344);
if(_347&&_347._cf_register){
_347._cf_register(_346,_341,_340);
continue;
}
}
var _348=$C.objectCache[_344];
if(_348&&_348._cf_register){
_348._cf_register(_346,_341,_340);
continue;
}
var _349=$D.getElement(_344,_345);
var _34a=(_349&&((!_349.length&&_349.length!=0)||(_349.length&&_349.length>0)||_349.tagName=="SELECT"));
if(!_34a){
$C.handleError(null,"bind.register.elnotfound","bind",[_344]);
}
if(_349.length>1&&!_349.options){
for(var j=0;j<_349.length;j++){
$B.register.addListener(_349[j],_346,_341,_340);
}
}else{
$B.register.addListener(_349,_346,_341,_340);
}
}
if(!$C.bindHandlerCache[_340.bindTo]&&typeof (_340.bindTo)=="string"){
$C.bindHandlerCache[_340.bindTo]=function(){
_341.call(null,null,_340);
};
}
if(_342){
_341.call(null,null,_340);
}
};
$B.register.addListener=function(_34c,_34d,_34e,_34f){
if(!$E.isListener(_34c,_34d,_34e,_34f)){
$E.addListener(_34c,_34d,_34e,_34f);
}
};
$B.assignValue=function(_350,_351,_352,_353){
if(!_350){
return;
}
if(_350.call){
_350.call(null,_352,_353);
return;
}
var _354=$C.objectCache[_350];
if(_354&&_354._cf_setValue){
_354._cf_setValue(_352);
return;
}
var _355=document.getElementById(_350);
if(!_355){
$C.handleError(null,"bind.assignvalue.elnotfound","bind",[_350]);
}
if(_355.tagName=="SELECT"){
var _356=$U.checkQuery(_352);
var _357=$C.objectCache[_350];
if(_356){
if(!_357||(_357&&(!_357.valueCol||!_357.displayCol))){
$C.handleError(null,"bind.assignvalue.selboxmissingvaldisplay","bind",[_350]);
return;
}
}else{
if(typeof (_352.length)=="number"&&!_352.toUpperCase){
if(_352.length>0&&(typeof (_352[0].length)!="number"||_352[0].toUpperCase)){
$C.handleError(null,"bind.assignvalue.selboxerror","bind",[_350]);
return;
}
}else{
$C.handleError(null,"bind.assignvalue.selboxerror","bind",[_350]);
return;
}
}
_355.options.length=0;
var _358;
var _359=false;
if(_357){
_358=_357.selected;
if(_358&&_358.length>0){
_359=true;
}
}
if(!_356){
for(var i=0;i<_352.length;i++){
var opt=new Option(_352[i][1],_352[i][0]);
_355.options[i]=opt;
if(_359){
for(var j=0;j<_358.length;j++){
if(_358[j]==opt.value){
opt.selected=true;
}
}
}
}
}else{
if(_356=="col"){
var _35d=_352.DATA[_357.valueCol];
var _35e=_352.DATA[_357.displayCol];
if(!_35d||!_35e){
$C.handleError(null,"bind.assignvalue.selboxinvalidvaldisplay","bind",[_350]);
return;
}
for(var i=0;i<_35d.length;i++){
var opt=new Option(_35e[i],_35d[i]);
_355.options[i]=opt;
if(_359){
for(var j=0;j<_358.length;j++){
if(_358[j]==opt.value){
opt.selected=true;
}
}
}
}
}else{
if(_356=="row"){
var _35f=-1;
var _360=-1;
for(var i=0;i<_352.COLUMNS.length;i++){
var col=_352.COLUMNS[i];
if(col==_357.valueCol){
_35f=i;
}
if(col==_357.displayCol){
_360=i;
}
if(_35f!=-1&&_360!=-1){
break;
}
}
if(_35f==-1||_360==-1){
$C.handleError(null,"bind.assignvalue.selboxinvalidvaldisplay","bind",[_350]);
return;
}
for(var i=0;i<_352.DATA.length;i++){
var opt=new Option(_352.DATA[i][_360],_352.DATA[i][_35f]);
_355.options[i]=opt;
if(_359){
for(var j=0;j<_358.length;j++){
if(_358[j]==opt.value){
opt.selected=true;
}
}
}
}
}
}
}
}else{
_355[_351]=_352;
}
$E.callBindHandlers(_350,null,"change");
$L.info("bind.assignvalue.success","bind",[_352,_350,_351]);
};
$B.localBindHandler=function(e,_363){
var _364=document.getElementById(_363.bindTo);
var _365=$B.evaluateBindTemplate(_363,true);
$B.assignValue(_363.bindTo,_363.bindToAttr,_365);
};
$B.localBindHandler._cf_bindhandler=true;
$B.evaluateBindTemplate=function(_366,_367,_368,_369,_36a){
var _36b=_366.bindExpr;
var _36c="";
if(typeof _36a=="undefined"){
_36a=false;
}
for(var i=0;i<_36b.length;i++){
if(typeof (_36b[i])=="object"){
var _36e=null;
if(!_36b[i].length||typeof _36b[i][0]=="object"){
_36e=$X.JSON.encode(_36b[i]);
}else{
var _36e=$B.getBindElementValue(_36b[i][0],_36b[i][1],_36b[i][2],_367,_369);
if(_36e==null){
if(_367){
_36c="";
break;
}else{
_36e="";
}
}
}
if(_368){
_36e=encodeURIComponent(_36e);
}
_36c+=_36e;
}else{
var _36f=_36b[i];
if(_36a==true&&i>0){
if(typeof (_36f)=="string"&&_36f.indexOf("&")!=0){
_36f=encodeURIComponent(_36f);
}
}
_36c+=_36f;
}
}
return _36c;
};
$B.jsBindHandler=function(e,_371){
var _372=_371.bindExpr;
var _373=new Array();
var _374=_371.callFunction+"(";
for(var i=0;i<_372.length;i++){
var _376;
if(typeof (_372[i])=="object"){
if(_372[i].length){
if(typeof _372[i][0]=="object"){
_376=_372[i];
}else{
_376=$B.getBindElementValue(_372[i][0],_372[i][1],_372[i][2],false);
}
}else{
_376=_372[i];
}
}else{
_376=_372[i];
}
if(i!=0){
_374+=",";
}
_373[i]=_376;
_374+="'"+_376+"'";
}
_374+=")";
var _377=_371.callFunction.apply(null,_373);
$B.assignValue(_371.bindTo,_371.bindToAttr,_377,_371.bindToParams);
};
$B.jsBindHandler._cf_bindhandler=true;
$B.urlBindHandler=function(e,_379){
var _37a=_379.bindTo;
if($C.objectCache[_37a]&&$C.objectCache[_37a]._cf_visible===false){
$C.objectCache[_37a]._cf_dirtyview=true;
return;
}
var url=$B.evaluateBindTemplate(_379,false,true,false,true);
var _37c=$U.extractReturnFormat(url);
if(_37c==null||typeof _37c=="undefined"){
_37c="JSON";
}
if(_379.bindToAttr||typeof _379.bindTo=="undefined"||typeof _379.bindTo=="function"){
var _379={"bindTo":_379.bindTo,"bindToAttr":_379.bindToAttr,"bindToParams":_379.bindToParams,"errorHandler":_379.errorHandler,"url":url,returnFormat:_37c};
try{
$A.sendMessage(url,"GET",null,true,$B.urlBindHandler.callback,_379);
}
catch(e){
$C.handleError(_379.errorHandler,"ajax.urlbindhandler.connectionerror","http",[url,e]);
}
}else{
$A.replaceHTML(_37a,url,null,null,null,_379.errorHandler);
}
};
$B.urlBindHandler._cf_bindhandler=true;
$B.urlBindHandler.callback=function(req,_37e){
if($A.isRequestError(req)){
$C.handleError(_37e.errorHandler,"bind.urlbindhandler.httperror","http",[req.status,_37e.url,req.statusText],req.status,req.statusText);
}else{
$L.info("bind.urlbindhandler.response","http",[req.responseText]);
var _37f;
try{
if(_37e.returnFormat==null||_37e.returnFormat==="JSON"){
_37f=$X.JSON.decode(req.responseText);
}else{
_37f=req.responseText;
}
}
catch(e){
if(req.responseText!=null&&typeof req.responseText=="string"){
_37f=req.responseText;
}else{
$C.handleError(_37e.errorHandler,"bind.urlbindhandler.jsonerror","http",[req.responseText]);
}
}
$B.assignValue(_37e.bindTo,_37e.bindToAttr,_37f,_37e.bindToParams);
}
};
$A.initSelect=function(_380,_381,_382,_383){
$C.objectCache[_380]={"valueCol":_381,"displayCol":_382,selected:_383};
};
$S.setupSpry=function(){
if(typeof (Spry)!="undefined"&&Spry.Data){
Spry.Data.DataSet.prototype._cf_getAttribute=function(_384){
var val;
var row=this.getCurrentRow();
if(row){
val=row[_384];
}
return val;
};
Spry.Data.DataSet.prototype._cf_register=function(_387,_388,_389){
var obs={bindParams:_389};
obs.onCurrentRowChanged=function(){
_388.call(null,null,this.bindParams);
};
obs.onDataChanged=function(){
_388.call(null,null,this.bindParams);
};
this.addObserver(obs);
};
if(Spry.Debug.trace){
var _38b=Spry.Debug.trace;
Spry.Debug.trace=function(str){
$L.info(str,"spry");
_38b(str);
};
}
if(Spry.Debug.reportError){
var _38d=Spry.Debug.reportError;
Spry.Debug.reportError=function(str){
$L.error(str,"spry");
_38d(str);
};
}
$L.info("spry.setupcomplete","bind");
}
};
$E.registerOnLoad($S.setupSpry,null,true);
$S.bindHandler=function(_38f,_390){
var url;
var _392="_cf_nodebug=true&_cf_nocache=true";
if(window._cf_clientid){
_392+="&_cf_clientid="+_cf_clientid;
}
var _393=window[_390.bindTo];
var _394=(typeof (_393)=="undefined");
if(_390.cfc){
var _395={};
var _396=_390.bindExpr;
for(var i=0;i<_396.length;i++){
var _398;
if(_396[i].length==2){
_398=_396[i][1];
}else{
_398=$B.getBindElementValue(_396[i][1],_396[i][2],_396[i][3],false,_394);
}
_395[_396[i][0]]=_398;
}
_395=$X.JSON.encode(_395);
_392+="&method="+_390.cfcFunction;
_392+="&argumentCollection="+encodeURIComponent(_395);
$L.info("spry.bindhandler.loadingcfc","http",[_390.bindTo,_390.cfc,_390.cfcFunction,_395]);
url=_390.cfc;
}else{
url=$B.evaluateBindTemplate(_390,false,true,_394);
$L.info("spry.bindhandler.loadingurl","http",[_390.bindTo,url]);
}
var _399=_390.options||{};
if((_393&&_393._cf_type=="json")||_390.dsType=="json"){
_392+="&returnformat=json";
}
if(_393){
if(_393.requestInfo.method=="GET"){
_399.method="GET";
if(url.indexOf("?")==-1){
url+="?"+_392;
}else{
url+="&"+_392;
}
}else{
_399.postData=_392;
_399.method="POST";
_393.setURL("");
}
_393.setURL(url,_399);
_393.loadData();
}else{
if(!_399.method||_399.method=="GET"){
if(url.indexOf("?")==-1){
url+="?"+_392;
}else{
url+="&"+_392;
}
}else{
_399.postData=_392;
_399.useCache=false;
}
var ds;
if(_390.dsType=="xml"){
ds=new Spry.Data.XMLDataSet(url,_390.xpath,_399);
}else{
ds=new Spry.Data.JSONDataSet(url,_399);
ds.preparseFunc=$S.preparseData;
}
ds._cf_type=_390.dsType;
var _39b={onLoadError:function(req){
$C.handleError(_390.errorHandler,"spry.bindhandler.error","http",[_390.bindTo,req.url,req.requestInfo.postData]);
}};
ds.addObserver(_39b);
window[_390.bindTo]=ds;
}
};
$S.bindHandler._cf_bindhandler=true;
$S.preparseData=function(ds,_39e){
var _39f=$U.getFirstNonWhitespaceIndex(_39e);
if(_39f>0){
_39e=_39e.slice(_39f);
}
if(window._cf_jsonprefix&&_39e.indexOf(_cf_jsonprefix)==0){
_39e=_39e.slice(_cf_jsonprefix.length);
}
return _39e;
};
$P.init=function(_3a0){
$L.info("pod.init.creating","widget",[_3a0]);
var _3a1={};
_3a1._cf_body=_3a0+"_body";
$C.objectCache[_3a0]=_3a1;
};
$B.cfcBindHandler=function(e,_3a3){
var _3a4=(_3a3.httpMethod)?_3a3.httpMethod:"GET";
var _3a5={};
var _3a6=_3a3.bindExpr;
for(var i=0;i<_3a6.length;i++){
var _3a8;
if(_3a6[i].length==2){
_3a8=_3a6[i][1];
}else{
_3a8=$B.getBindElementValue(_3a6[i][1],_3a6[i][2],_3a6[i][3],false);
}
_3a5[_3a6[i][0]]=_3a8;
}
var _3a9=function(_3aa,_3ab){
$B.assignValue(_3ab.bindTo,_3ab.bindToAttr,_3aa,_3ab.bindToParams);
};
var _3ac={"bindTo":_3a3.bindTo,"bindToAttr":_3a3.bindToAttr,"bindToParams":_3a3.bindToParams};
var _3ad={"async":true,"cfcPath":_3a3.cfc,"httpMethod":_3a4,"callbackHandler":_3a9,"errorHandler":_3a3.errorHandler};
if(_3a3.proxyCallHandler){
_3ad.callHandler=_3a3.proxyCallHandler;
_3ad.callHandlerParams=_3a3;
}
$X.invoke(_3ad,_3a3.cfcFunction,_3a3._cf_ajaxproxytoken,_3a5,_3ac);
};
$B.cfcBindHandler._cf_bindhandler=true;
$U.extractReturnFormat=function(url){
var _3af;
var _3b0=url.toUpperCase();
var _3b1=_3b0.indexOf("RETURNFORMAT");
if(_3b1>0){
var _3b2=_3b0.indexOf("&",_3b1+13);
if(_3b2<0){
_3b2=_3b0.length;
}
_3af=_3b0.substring(_3b1+13,_3b2);
}
return _3af;
};
$U.replaceAll=function(_3b3,_3b4,_3b5){
var _3b6=_3b3.indexOf(_3b4);
while(_3b6>-1){
_3b3=_3b3.replace(_3b4,_3b5);
_3b6=_3b3.indexOf(_3b4);
}
return _3b3;
};
$U.cloneObject=function(obj){
var _3b8={};
for(key in obj){
var _3b9=obj[key];
if(typeof _3b9=="object"){
_3b9=$U.cloneObject(_3b9);
}
_3b8.key=_3b9;
}
return _3b8;
};
$C.clone=function(obj,_3bb){
if(typeof (obj)!="object"){
return obj;
}
if(obj==null){
return obj;
}
var _3bc=new Object();
for(var i in obj){
if(_3bb===true){
_3bc[i]=$C.clone(obj[i]);
}else{
_3bc[i]=obj[i];
}
}
return _3bc;
};
$C.printObject=function(obj){
var str="";
for(key in obj){
str=str+"  "+key+"=";
value=obj[key];
if(typeof (value)=="object"){
value=$C.printObject(value);
}
str+=value;
}
return str;
};
}
}
cfinit();
