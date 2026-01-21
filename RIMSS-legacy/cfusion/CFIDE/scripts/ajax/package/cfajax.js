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
$C.globalErrorHandler=function(_d8,_d9){
if($L.isAvailable){
$L.error(_d8,_d9);
}
if($C.userGlobalErrorHandler){
$C.userGlobalErrorHandler(_d8);
}
if(!$L.isAvailable&&!$C.userGlobalErrorHandler){
alert(_d8+CFMessage["globalErrorHandler.alert"]);
}
};
$C.handleError=function(_da,_db,_dc,_dd,_de,_df,_e0,_e1){
var msg=$L.format(_db,_dd);
if(_da){
$L.error(msg,"http");
if(!_de){
_de=-1;
}
if(!_df){
_df=msg;
}
_da(_de,_df,_e1);
}else{
if(_e0){
$L.error(msg,"http");
throw msg;
}else{
$C.globalErrorHandler(msg,_dc);
}
}
};
$C.setGlobalErrorHandler=function(_e3){
$C.userGlobalErrorHandler=_e3;
};
$A.createXMLHttpRequest=function(){
try{
return new XMLHttpRequest();
}
catch(e){
}
var _e4=["Microsoft.XMLHTTP","MSXML2.XMLHTTP.5.0","MSXML2.XMLHTTP.4.0","MSXML2.XMLHTTP.3.0","MSXML2.XMLHTTP"];
for(var i=0;i<_e4.length;i++){
try{
return new ActiveXObject(_e4[i]);
}
catch(e){
}
}
return false;
};
$A.isRequestError=function(req){
return ((req.status!=0&&req.status!=200)||req.getResponseHeader("server-error"));
};
$A.sendMessage=function(url,_e8,_e9,_ea,_eb,_ec,_ed){
var req=$A.createXMLHttpRequest();
if(!_e8){
_e8="GET";
}
if(_ea&&_eb){
req.onreadystatechange=function(){
$A.callback(req,_eb,_ec);
};
}
if(_e9){
_e9+="&_cf_nodebug=true&_cf_nocache=true";
}else{
_e9="_cf_nodebug=true&_cf_nocache=true";
}
if(window._cf_clientid){
_e9+="&_cf_clientid="+_cf_clientid;
}
if(_e8=="GET"){
if(_e9){
_e9+="&_cf_rc="+($C.requestCounter++);
if(url.indexOf("?")==-1){
url+="?"+_e9;
}else{
url+="&"+_e9;
}
}
$L.info("ajax.sendmessage.get","http",[url]);
req.open(_e8,url,_ea);
req.send(null);
}else{
$L.info("ajax.sendmessage.post","http",[url,_e9]);
req.open(_e8,url,_ea);
req.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
if(_e9){
req.send(_e9);
}else{
req.send(null);
}
}
if(!_ea){
while(req.readyState!=4){
}
if($A.isRequestError(req)){
$C.handleError(null,"ajax.sendmessage.error","http",[req.status,req.statusText],req.status,req.statusText,_ed);
}else{
return req;
}
}
};
$A.callback=function(req,_f0,_f1){
if(req.readyState!=4){
return;
}
req.onreadystatechange=new Function;
_f0(req,_f1);
};
$A.submitForm=function(_f2,url,_f4,_f5,_f6,_f7){
var _f8=$C.getFormQueryString(_f2);
if(_f8==-1){
$C.handleError(_f5,"ajax.submitform.formnotfound","http",[_f2],-1,null,true);
return;
}
if(!_f6){
_f6="POST";
}
_f7=!(_f7===false);
var _f9=function(req){
$A.submitForm.callback(req,_f2,_f4,_f5);
};
$L.info("ajax.submitform.submitting","http",[_f2]);
var _fb=$A.sendMessage(url,_f6,_f8,_f7,_f9);
if(!_f7){
$L.info("ajax.submitform.success","http",[_f2]);
return _fb.responseText;
}
};
$A.submitForm.callback=function(req,_fd,_fe,_ff){
if($A.isRequestError(req)){
$C.handleError(_ff,"ajax.submitform.error","http",[req.status,_fd,req.statusText],req.status,req.statusText);
}else{
$L.info("ajax.submitform.success","http",[_fd]);
if(_fe){
_fe(req.responseText);
}
}
};
$C.empty=function(){
};
$C.setSubmitClicked=function(_100,_101){
var el=$D.getElement(_101,_100);
el.cfinputbutton=true;
$C.setClickedProperty=function(){
el.clicked=true;
};
$E.addListener(el,"click",$C.setClickedProperty);
};
$C.getFormQueryString=function(_103,_104){
var _105;
if(typeof _103=="string"){
_105=(document.getElementById(_103)||document.forms[_103]);
}else{
if(typeof _103=="object"){
_105=_103;
}
}
if(!_105||null==_105.elements){
return -1;
}
var _106,elementName,elementValue,elementDisabled;
var _107=false;
var _108=(_104)?{}:"";
for(var i=0;i<_105.elements.length;i++){
_106=_105.elements[i];
elementDisabled=_106.disabled;
elementName=_106.name;
elementValue=_106.value;
if(!elementDisabled&&elementName){
switch(_106.type){
case "select-one":
case "select-multiple":
for(var j=0;j<_106.options.length;j++){
if(_106.options[j].selected){
if(window.ActiveXObject){
_108=$C.getFormQueryString.processFormData(_108,_104,elementName,_106.options[j].attributes["value"].specified?_106.options[j].value:_106.options[j].text);
}else{
_108=$C.getFormQueryString.processFormData(_108,_104,elementName,_106.options[j].hasAttribute("value")?_106.options[j].value:_106.options[j].text);
}
}
}
break;
case "radio":
case "checkbox":
if(_106.checked){
_108=$C.getFormQueryString.processFormData(_108,_104,elementName,elementValue);
}
break;
case "file":
case undefined:
case "reset":
break;
case "button":
_108=$C.getFormQueryString.processFormData(_108,_104,elementName,elementValue);
break;
case "submit":
if(_106.cfinputbutton){
if(_107==false&&_106.clicked){
_108=$C.getFormQueryString.processFormData(_108,_104,elementName,elementValue);
_107=true;
}
}else{
_108=$C.getFormQueryString.processFormData(_108,_104,elementName,elementValue);
}
break;
case "textarea":
var _10b;
if(window.FCKeditorAPI&&(_10b=$C.objectCache[elementName])&&_10b.richtextid){
var _10c=FCKeditorAPI.GetInstance(_10b.richtextid);
if(_10c){
elementValue=_10c.GetXHTML();
}
}
_108=$C.getFormQueryString.processFormData(_108,_104,elementName,elementValue);
break;
default:
_108=$C.getFormQueryString.processFormData(_108,_104,elementName,elementValue);
break;
}
}
}
if(!_104){
_108=_108.substr(0,_108.length-1);
}
return _108;
};
$C.getFormQueryString.processFormData=function(_10d,_10e,_10f,_110){
if(_10e){
if(_10d[_10f]){
_10d[_10f]+=","+_110;
}else{
_10d[_10f]=_110;
}
}else{
_10d+=encodeURIComponent(_10f)+"="+encodeURIComponent(_110)+"&";
}
return _10d;
};
$A.importTag=function(_111){
$C.importedTags.push(_111);
};
$A.checkImportedTag=function(_112){
var _113=false;
for(var i=0;i<$C.importedTags.length;i++){
if($C.importedTags[i]==_112){
_113=true;
break;
}
}
if(!_113){
$C.handleError(null,"ajax.checkimportedtag.error","widget",[_112]);
}
};
$C.getElementValue=function(_115,_116,_117){
if(!_115){
$C.handleError(null,"getelementvalue.noelementname","bind",null,null,null,true);
return;
}
if(!_117){
_117="value";
}
var _118=$B.getBindElementValue(_115,_116,_117);
if(typeof (_118)=="undefined"){
_118=null;
}
if(_118==null){
$C.handleError(null,"getelementvalue.elnotfound","bind",[_115,_117],null,null,true);
return;
}
return _118;
};
$B.getBindElementValue=function(_119,_11a,_11b,_11c,_11d){
var _11e="";
if(window[_119]){
var _11f=eval(_119);
if(_11f&&_11f._cf_getAttribute){
_11e=_11f._cf_getAttribute(_11b);
return _11e;
}
}
var _120=$C.objectCache[_119];
if(_120&&_120._cf_getAttribute){
_11e=_120._cf_getAttribute(_11b);
return _11e;
}
var el=$D.getElement(_119,_11a);
var _122=(el&&((!el.length&&el.length!=0)||(el.length&&el.length>0)||el.tagName=="SELECT"));
if(!_122&&!_11d){
$C.handleError(null,"bind.getbindelementvalue.elnotfound","bind",[_119]);
return null;
}
if(el.tagName!="SELECT"){
if(el.length>1){
var _123=true;
for(var i=0;i<el.length;i++){
var _125=(el[i].getAttribute("type")=="radio"||el[i].getAttribute("type")=="checkbox");
if(!_125||(_125&&el[i].checked)){
if(!_123){
_11e+=",";
}
_11e+=$B.getBindElementValue.extract(el[i],_11b);
_123=false;
}
}
}else{
_11e=$B.getBindElementValue.extract(el,_11b);
}
}else{
var _123=true;
for(var i=0;i<el.options.length;i++){
if(el.options[i].selected){
if(!_123){
_11e+=",";
}
_11e+=$B.getBindElementValue.extract(el.options[i],_11b);
_123=false;
}
}
}
if(typeof (_11e)=="object"){
$C.handleError(null,"bind.getbindelementvalue.simplevalrequired","bind",[_119,_11b]);
return null;
}
if(_11c&&$C.required[_119]&&_11e.length==0){
return null;
}
return _11e;
};
$B.getBindElementValue.extract=function(el,_127){
var _128=el[_127];
if((_128==null||typeof (_128)=="undefined")&&el.getAttribute){
_128=el.getAttribute(_127);
}
return _128;
};
$L.init=function(){
if(window.YAHOO&&YAHOO.widget&&YAHOO.widget.Logger){
YAHOO.widget.Logger.categories=[CFMessage["debug"],CFMessage["info"],CFMessage["error"],CFMessage["window"]];
YAHOO.widget.LogReader.prototype.formatMsg=function(_129){
var _12a=_129.category;
return "<p>"+"<span class='"+_12a+"'>"+_12a+"</span>:<i>"+_129.source+"</i>: "+_129.msg+"</p>";
};
var _12b=new YAHOO.widget.LogReader(null,{width:"30em",fontSize:"100%"});
_12b.setTitle(CFMessage["log.title"]||"ColdFusion AJAX Logger");
_12b._btnCollapse.value=CFMessage["log.collapse"]||"Collapse";
_12b._btnPause.value=CFMessage["log.pause"]||"Pause";
_12b._btnClear.value=CFMessage["log.clear"]||"Clear";
$L.isAvailable=true;
}
};
$L.log=function(_12c,_12d,_12e,_12f){
if(!$L.isAvailable){
return;
}
if(!_12e){
_12e="global";
}
_12e=CFMessage[_12e]||_12e;
_12d=CFMessage[_12d]||_12d;
_12c=$L.format(_12c,_12f);
YAHOO.log(_12c,_12d,_12e);
};
$L.format=function(code,_131){
var msg=CFMessage[code]||code;
if(_131){
for(i=0;i<_131.length;i++){
if(!_131[i].length){
_131[i]="";
}
var _133="{"+i+"}";
msg=msg.replace(_133,_131[i]);
}
}
return msg;
};
$L.debug=function(_134,_135,_136){
$L.log(_134,"debug",_135,_136);
};
$L.info=function(_137,_138,_139){
$L.log(_137,"info",_138,_139);
};
$L.error=function(_13a,_13b,_13c){
$L.log(_13a,"error",_13b,_13c);
};
$L.dump=function(_13d,_13e){
if($L.isAvailable){
var dump=(/string|number|undefined|boolean/.test(typeof (_13d))||_13d==null)?_13d:recurse(_13d,typeof _13d,true);
$L.debug(dump,_13e);
}
};
$X.invoke=function(_140,_141,_142,_143,_144){
var _145="method="+_141+"&_cf_ajaxproxytoken="+_142;
var _146=_140.returnFormat||"json";
_145+="&returnFormat="+_146;
if(_140.queryFormat){
_145+="&queryFormat="+_140.queryFormat;
}
if(_140.formId){
var _147=$C.getFormQueryString(_140.formId,true);
if(_143!=null){
for(prop in _147){
_143[prop]=_147[prop];
}
}else{
_143=_147;
}
_140.formId=null;
}
var _148="";
if(_143!=null){
_148=$X.JSON.encode(_143);
_145+="&argumentCollection="+encodeURIComponent(_148);
}
$L.info("ajaxproxy.invoke.invoking","http",[_140.cfcPath,_141,_148]);
if(_140.callHandler){
_140.callHandler.call(null,_140.callHandlerParams,_140.cfcPath,_145);
return;
}
var _149;
if(_140.async){
_149=function(req){
$X.callback(req,_140,_144);
};
}
var req=$A.sendMessage(_140.cfcPath,_140.httpMethod,_145,_140.async,_149,null,true);
if(!_140.async){
return $X.processResponse(req,_140);
}
};
$X.callback=function(req,_14d,_14e){
if($A.isRequestError(req)){
$C.handleError(_14d.errorHandler,"ajaxproxy.invoke.error","http",[req.status,_14d.cfcPath,req.statusText],req.status,req.statusText,false,_14e);
}else{
if(_14d.callbackHandler){
var _14f=$X.processResponse(req,_14d);
_14d.callbackHandler(_14f,_14e);
}
}
};
$X.processResponse=function(req,_151){
var _152=true;
for(var i=0;i<req.responseText.length;i++){
var c=req.responseText.charAt(i);
_152=(c==" "||c=="\n"||c=="\t"||c=="\r");
if(!_152){
break;
}
}
var _155=(req.responseXML&&req.responseXML.childNodes.length>0);
var _156=_155?"[XML Document]":req.responseText;
$L.info("ajaxproxy.invoke.response","http",[_156]);
var _157;
var _158=_151.returnFormat||"json";
if(_158=="json"){
_157=_152?null:$X.JSON.decode(req.responseText);
}else{
_157=_155?req.responseXML:(_152?null:req.responseText);
}
return _157;
};
$X.init=function(_159,_15a){
var _15b=_15a.split(".");
var ns=self;
for(i=0;i<_15b.length-1;i++){
if(_15b[i].length){
ns[_15b[i]]=ns[_15b[i]]||{};
ns=ns[_15b[i]];
}
}
var _15d=_15b[_15b.length-1];
if(ns[_15d]){
return ns[_15d];
}
ns[_15d]=function(){
this.httpMethod="GET";
this.async=false;
this.callbackHandler=null;
this.errorHandler=null;
this.formId=null;
};
ns[_15d].prototype.cfcPath=_159;
ns[_15d].prototype.setHTTPMethod=function(_15e){
if(_15e){
_15e=_15e.toUpperCase();
}
if(_15e!="GET"&&_15e!="POST"){
$C.handleError(null,"ajaxproxy.sethttpmethod.invalidmethod","http",[_15e],null,null,true);
}
this.httpMethod=_15e;
};
ns[_15d].prototype.setSyncMode=function(){
this.async=false;
};
ns[_15d].prototype.setAsyncMode=function(){
this.async=true;
};
ns[_15d].prototype.setCallbackHandler=function(fn){
this.callbackHandler=fn;
this.setAsyncMode();
};
ns[_15d].prototype.setErrorHandler=function(fn){
this.errorHandler=fn;
this.setAsyncMode();
};
ns[_15d].prototype.setForm=function(fn){
this.formId=fn;
};
ns[_15d].prototype.setQueryFormat=function(_162){
if(_162){
_162=_162.toLowerCase();
}
if(!_162||(_162!="column"&&_162!="row")){
$C.handleError(null,"ajaxproxy.setqueryformat.invalidformat","http",[_162],null,null,true);
}
this.queryFormat=_162;
};
ns[_15d].prototype.setReturnFormat=function(_163){
if(_163){
_163=_163.toLowerCase();
}
if(!_163||(_163!="plain"&&_163!="json"&&_163!="wddx")){
$C.handleError(null,"ajaxproxy.setreturnformat.invalidformat","http",[_163],null,null,true);
}
this.returnFormat=_163;
};
$L.info("ajaxproxy.init.created","http",[_159]);
return ns[_15d];
};
$U.isWhitespace=function(s){
var _165=true;
for(var i=0;i<s.length;i++){
var c=s.charAt(i);
_165=(c==" "||c=="\n"||c=="\t"||c=="\r");
if(!_165){
break;
}
}
return _165;
};
$U.getFirstNonWhitespaceIndex=function(s){
var _169=true;
for(var i=0;i<s.length;i++){
var c=s.charAt(i);
_169=(c==" "||c=="\n"||c=="\t"||c=="\r");
if(!_169){
break;
}
}
return i;
};
$C.trim=function(_16c){
return _16c.replace(/^\s+|\s+$/g,"");
};
$U.isInteger=function(n){
var _16e=true;
if(typeof (n)=="number"){
_16e=(n>=0);
}else{
for(i=0;i<n.length;i++){
if($U.isInteger.numberChars.indexOf(n.charAt(i))==-1){
_16e=false;
break;
}
}
}
return _16e;
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
var _173=null;
if(o&&o.COLUMNS&&$U.isArray(o.COLUMNS)&&o.DATA&&$U.isArray(o.DATA)&&(o.DATA.length==0||(o.DATA.length>0&&$U.isArray(o.DATA[0])))){
_173="row";
}else{
if(o&&o.COLUMNS&&$U.isArray(o.COLUMNS)&&o.ROWCOUNT&&$U.isInteger(o.ROWCOUNT)&&o.DATA){
_173="col";
for(var i=0;i<o.COLUMNS.length;i++){
var _175=o.DATA[o.COLUMNS[i]];
if(!_175||!$U.isArray(_175)){
_173=null;
break;
}
}
}
}
return _173;
};
$X.JSON=new function(){
var _176={}.hasOwnProperty?true:false;
var _177=/^("(\\.|[^"\\\n\r])*?"|[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t])+?$/;
var pad=function(n){
return n<10?"0"+n:n;
};
var m={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r","\"":"\\\"","\\":"\\\\"};
var _17b=function(s){
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
var _180=function(o){
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
var _183=function(o){
return "\""+o.getFullYear()+"-"+pad(o.getMonth()+1)+"-"+pad(o.getDate())+"T"+pad(o.getHours())+":"+pad(o.getMinutes())+":"+pad(o.getSeconds())+"\"";
};
this.encode=function(o){
if(typeof o=="undefined"||o===null){
return "null";
}else{
if(o instanceof Array){
return _180(o);
}else{
if(o instanceof Date){
return _183(o);
}else{
if(typeof o=="string"){
return _17b(o);
}else{
if(typeof o=="number"){
return isFinite(o)?String(o):"null";
}else{
if(typeof o=="boolean"){
return String(o);
}else{
var a=["{"],b,i,v;
for(var i in o){
if(!_176||o.hasOwnProperty(i)){
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
var _189=$U.getFirstNonWhitespaceIndex(json);
if(_189>0){
json=json.slice(_189);
}
if(window._cf_jsonprefix&&json.indexOf(_cf_jsonprefix)==0){
json=json.slice(_cf_jsonprefix.length);
}
try{
if(_177.test(json)){
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
$C.navigate=function(url,_18b,_18c,_18d,_18e,_18f){
if(url==null){
$C.handleError(_18d,"navigate.urlrequired","widget");
return;
}
if(_18e){
_18e=_18e.toUpperCase();
if(_18e!="GET"&&_18e!="POST"){
$C.handleError(null,"navigate.invalidhttpmethod","http",[_18e],null,null,true);
}
}else{
_18e="GET";
}
var _190;
if(_18f){
_190=$C.getFormQueryString(_18f);
if(_190==-1){
$C.handleError(null,"navigate.formnotfound","http",[_18f],null,null,true);
}
}
if(_18b==null){
if(_190){
if(url.indexOf("?")==-1){
url+="?"+_190;
}else{
url+="&"+_190;
}
}
$L.info("navigate.towindow","widget",[url]);
window.location.replace(url);
return;
}
$L.info("navigate.tocontainer","widget",[url,_18b]);
var obj=$C.objectCache[_18b];
if(obj!=null){
if(typeof (obj._cf_body)!="undefined"&&obj._cf_body!=null){
_18b=obj._cf_body;
}
}
$A.replaceHTML(_18b,url,_18e,_190,_18c,_18d);
};
$A.checkForm=function(_192,_193,_194,_195,_196){
var _197=_193.call(null,_192);
if(_197==false){
return false;
}
var _198=$C.getFormQueryString(_192);
$L.info("ajax.submitform.submitting","http",[_192.name]);
$A.replaceHTML(_194,_192.action,_192.method,_198,_195,_196);
return false;
};
$A.replaceHTML=function(_199,url,_19b,_19c,_19d,_19e){
var _19f=document.getElementById(_199);
if(!_19f){
$C.handleError(_19e,"ajax.replacehtml.elnotfound","http",[_199]);
return;
}
var _1a0="_cf_containerId="+encodeURIComponent(_199);
_19c=(_19c)?_19c+"&"+_1a0:_1a0;
$L.info("ajax.replacehtml.replacing","http",[_199,url,_19c]);
if(_cf_loadingtexthtml){
try{
_19f.innerHTML=_cf_loadingtexthtml;
}
catch(e){
}
}
var _1a1=function(req,_1a3){
var _1a4=false;
if($A.isRequestError(req)){
$C.handleError(_19e,"ajax.replacehtml.error","http",[req.status,_1a3.id,req.statusText],req.status,req.statusText);
_1a4=true;
}
var _1a5=new $E.CustomEvent("onReplaceHTML",_1a3);
var _1a6=new $E.CustomEvent("onReplaceHTMLUser",_1a3);
$E.loadEvents[_1a3.id]={system:_1a5,user:_1a6};
if(req.responseText.search(/<script/i)!=-1){
try{
_1a3.innerHTML="";
}
catch(e){
}
$A.replaceHTML.processResponseText(req.responseText,_1a3,_19e);
}else{
try{
_1a3.innerHTML=req.responseText;
}
catch(e){
}
}
$E.loadEvents[_1a3.id]=null;
_1a5.fire();
_1a5.unsubscribe();
_1a6.fire();
_1a6.unsubscribe();
$L.info("ajax.replacehtml.success","http",[_1a3.id]);
if(_19d&&!_1a4){
_19d();
}
};
try{
$A.sendMessage(url,_19b,_19c,true,_1a1,_19f);
}
catch(e){
try{
_19f.innerHTML=$L.format(CFMessage["ajax.replacehtml.connectionerrordisplay"],[url,e]);
}
catch(e){
}
$C.handleError(_19e,"ajax.replacehtml.connectionerror","http",[_199,url,e]);
}
};
$A.replaceHTML.processResponseText=function(text,_1a8,_1a9){
var pos=0;
var _1ab=0;
var _1ac=0;
_1a8._cf_innerHTML="";
while(pos<text.length){
var _1ad=text.indexOf("<s",pos);
if(_1ad==-1){
_1ad=text.indexOf("<S",pos);
}
if(_1ad==-1){
break;
}
pos=_1ad;
var _1ae=true;
var _1af=$A.replaceHTML.processResponseText.scriptTagChars;
for(var i=1;i<_1af.length;i++){
var _1b1=pos+i+1;
if(_1b1>text.length){
break;
}
var _1b2=text.charAt(_1b1);
if(_1af[i][0]!=_1b2&&_1af[i][1]!=_1b2){
pos+=i+1;
_1ae=false;
break;
}
}
if(!_1ae){
continue;
}
var _1b3=text.substring(_1ab,pos);
if(_1b3){
_1a8._cf_innerHTML+=_1b3;
}
var _1b4=text.indexOf(">",pos)+1;
if(_1b4==0){
pos++;
continue;
}else{
pos+=7;
}
var _1b5=_1b4;
while(_1b5<text.length&&_1b5!=-1){
_1b5=text.indexOf("</s",_1b5);
if(_1b5==-1){
_1b5=text.indexOf("</S",_1b5);
}
if(_1b5!=-1){
_1ae=true;
for(var i=1;i<_1af.length;i++){
var _1b1=_1b5+2+i;
if(_1b1>text.length){
break;
}
var _1b2=text.charAt(_1b1);
if(_1af[i][0]!=_1b2&&_1af[i][1]!=_1b2){
_1b5=_1b1;
_1ae=false;
break;
}
}
if(_1ae){
break;
}
}
}
if(_1b5!=-1){
var _1b6=text.substring(_1b4,_1b5);
var _1b7=_1b6.indexOf("<!--");
if(_1b7!=-1){
_1b6=_1b6.substring(_1b7+4);
}
var _1b8=_1b6.lastIndexOf("//-->");
if(_1b8!=-1){
_1b6=_1b6.substring(0,_1b8-1);
}
if(_1b6.indexOf("document.write")!=-1||_1b6.indexOf("CF_RunContent")!=-1){
if(_1b6.indexOf("CF_RunContent")!=-1){
_1b6=_1b6.replace("CF_RunContent","document.write");
}
_1b6="var _cfDomNode = document.getElementById('"+_1a8.id+"'); var _cfBuffer='';"+"if (!document._cf_write)"+"{document._cf_write = document.write;"+"document.write = function(str){if (_cfBuffer!=null){_cfBuffer+=str;}else{document._cf_write(str);}};};"+_1b6+";_cfDomNode._cf_innerHTML += _cfBuffer; _cfBuffer=null;";
}
try{
eval(_1b6);
}
catch(ex){
$C.handleError(_1a9,"ajax.replacehtml.jserror","http",[_1a8.id,ex]);
}
}
_1ad=text.indexOf(">",_1b5)+1;
if(_1ad==0){
_1ac=_1b5+1;
break;
}
_1ac=_1ad;
pos=_1ad;
_1ab=_1ad;
}
if(_1ac<text.length-1){
var _1b3=text.substring(_1ac,text.length);
if(_1b3){
_1a8._cf_innerHTML+=_1b3;
}
}
try{
_1a8.innerHTML=_1a8._cf_innerHTML;
}
catch(e){
}
_1a8._cf_innerHTML="";
};
$A.replaceHTML.processResponseText.scriptTagChars=[["s","S"],["c","C"],["r","R"],["i","I"],["p","P"],["t","T"]];
$D.getElement=function(_1b9,_1ba){
var _1bb=function(_1bc){
return (_1bc.name==_1b9||_1bc.id==_1b9);
};
var _1bd=$D.getElementsBy(_1bb,null,_1ba);
if(_1bd.length==1){
return _1bd[0];
}else{
return _1bd;
}
};
$D.getElementsBy=function(_1be,tag,root){
tag=tag||"*";
var _1c1=[];
if(root){
root=$D.get(root);
if(!root){
return _1c1;
}
}else{
root=document;
}
var _1c2=root.getElementsByTagName(tag);
if(!_1c2.length&&(tag=="*"&&root.all)){
_1c2=root.all;
}
for(var i=0,len=_1c2.length;i<len;++i){
if(_1be(_1c2[i])){
_1c1[_1c1.length]=_1c2[i];
}
}
return _1c1;
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
var _1c5=[];
for(var i=0,len=el.length;i<len;++i){
_1c5[_1c5.length]=$D.get(el[i]);
}
return _1c5;
}
return null;
};
$E.loadEvents={};
$E.CustomEvent=function(_1c7,_1c8){
return {name:_1c7,domNode:_1c8,subs:[],subscribe:function(func,_1ca){
var dup=false;
for(var i=0;i<this.subs.length;i++){
var sub=this.subs[i];
if(sub.f==func&&sub.p==_1ca){
dup=true;
break;
}
}
if(!dup){
this.subs.push({f:func,p:_1ca});
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
$E.addListener=function(el,ev,fn,_1d3){
var l={el:el,ev:ev,fn:fn,params:_1d3};
$E.listeners.push(l);
var _1d5=function(e){
if(!e){
var e=window.event;
}
fn.call(null,e,_1d3);
};
if(el.addEventListener){
el.addEventListener(ev,_1d5,false);
return true;
}else{
if(el.attachEvent){
el.attachEvent("on"+ev,_1d5);
return true;
}else{
return false;
}
}
};
$E.isListener=function(el,ev,fn,_1da){
var _1db=false;
var ls=$E.listeners;
for(var i=0;i<ls.length;i++){
if(ls[i].el==el&&ls[i].ev==ev&&ls[i].fn==fn&&ls[i].params==_1da){
_1db=true;
break;
}
}
return _1db;
};
$E.callBindHandlers=function(id,_1df,ev){
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
$E.registerOnLoad=function(func,_1e5,_1e6,user){
if($E.registerOnLoad.windowLoaded){
if(_1e5&&_1e5._cf_containerId&&$E.loadEvents[_1e5._cf_containerId]){
if(user){
$E.loadEvents[_1e5._cf_containerId].user.subscribe(func,_1e5);
}else{
$E.loadEvents[_1e5._cf_containerId].system.subscribe(func,_1e5);
}
}else{
func.call(null,null,_1e5);
}
}else{
if(user){
$E.windowLoadUserEvent.subscribe(func,_1e5);
}else{
if(_1e6){
$E.windowLoadImpEvent.subscribe(func,_1e5);
}else{
$E.windowLoadEvent.subscribe(func,_1e5);
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
var _1e9=document.createElement("span");
document.body.insertBefore(_1e9,document.body.firstChild);
};
$E.windowLoadHandler=function(e){
if(window.Ext){
Ext.BLANK_IMAGE_URL=_cf_ajaxscriptsrc+"/ajax/resources/ext/images/default/s.gif";
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
$B.register=function(_1eb,_1ec,_1ed,_1ee){
for(var i=0;i<_1eb.length;i++){
var _1f0=_1eb[i][0];
var _1f1=_1eb[i][1];
var _1f2=_1eb[i][2];
if(window[_1f0]){
var _1f3=eval(_1f0);
if(_1f3&&_1f3._cf_register){
_1f3._cf_register(_1f2,_1ed,_1ec);
continue;
}
}
var _1f4=$C.objectCache[_1f0];
if(_1f4&&_1f4._cf_register){
_1f4._cf_register(_1f2,_1ed,_1ec);
continue;
}
var _1f5=$D.getElement(_1f0,_1f1);
var _1f6=(_1f5&&((!_1f5.length&&_1f5.length!=0)||(_1f5.length&&_1f5.length>0)||_1f5.tagName=="SELECT"));
if(!_1f6){
$C.handleError(null,"bind.register.elnotfound","bind",[_1f0]);
}
if(_1f5.length>1&&!_1f5.options){
for(var j=0;j<_1f5.length;j++){
$B.register.addListener(_1f5[j],_1f2,_1ed,_1ec);
}
}else{
$B.register.addListener(_1f5,_1f2,_1ed,_1ec);
}
}
if(!$C.bindHandlerCache[_1ec.bindTo]&&typeof (_1ec.bindTo)=="string"){
$C.bindHandlerCache[_1ec.bindTo]=function(){
_1ed.call(null,null,_1ec);
};
}
if(_1ee){
_1ed.call(null,null,_1ec);
}
};
$B.register.addListener=function(_1f8,_1f9,_1fa,_1fb){
if(!$E.isListener(_1f8,_1f9,_1fa,_1fb)){
$E.addListener(_1f8,_1f9,_1fa,_1fb);
}
};
$B.assignValue=function(_1fc,_1fd,_1fe,_1ff){
if(!_1fc){
return;
}
if(_1fc.call){
_1fc.call(null,_1fe,_1ff);
return;
}
var _200=$C.objectCache[_1fc];
if(_200&&_200._cf_setValue){
_200._cf_setValue(_1fe);
return;
}
var _201=document.getElementById(_1fc);
if(!_201){
$C.handleError(null,"bind.assignvalue.elnotfound","bind",[_1fc]);
}
if(_201.tagName=="SELECT"){
var _202=$U.checkQuery(_1fe);
var _203=$C.objectCache[_1fc];
if(_202){
if(!_203||(_203&&(!_203.valueCol||!_203.displayCol))){
$C.handleError(null,"bind.assignvalue.selboxmissingvaldisplay","bind",[_1fc]);
return;
}
}else{
if(typeof (_1fe.length)=="number"&&!_1fe.toUpperCase){
if(_1fe.length>0&&(typeof (_1fe[0].length)!="number"||_1fe[0].toUpperCase)){
$C.handleError(null,"bind.assignvalue.selboxerror","bind",[_1fc]);
return;
}
}else{
$C.handleError(null,"bind.assignvalue.selboxerror","bind",[_1fc]);
return;
}
}
_201.options.length=0;
var _204;
var _205=false;
if(_203){
_204=_203.selected;
if(_204&&_204.length>0){
_205=true;
}
}
if(!_202){
for(var i=0;i<_1fe.length;i++){
var opt=new Option(_1fe[i][1],_1fe[i][0]);
_201.options[i]=opt;
if(_205){
for(var j=0;j<_204.length;j++){
if(_204[j]==opt.value){
opt.selected=true;
}
}
}
}
}else{
if(_202=="col"){
var _209=_1fe.DATA[_203.valueCol];
var _20a=_1fe.DATA[_203.displayCol];
if(!_209||!_20a){
$C.handleError(null,"bind.assignvalue.selboxinvalidvaldisplay","bind",[_1fc]);
return;
}
for(var i=0;i<_209.length;i++){
var opt=new Option(_20a[i],_209[i]);
_201.options[i]=opt;
if(_205){
for(var j=0;j<_204.length;j++){
if(_204[j]==opt.value){
opt.selected=true;
}
}
}
}
}else{
if(_202=="row"){
var _20b=-1;
var _20c=-1;
for(var i=0;i<_1fe.COLUMNS.length;i++){
var col=_1fe.COLUMNS[i];
if(col==_203.valueCol){
_20b=i;
}
if(col==_203.displayCol){
_20c=i;
}
if(_20b!=-1&&_20c!=-1){
break;
}
}
if(_20b==-1||_20c==-1){
$C.handleError(null,"bind.assignvalue.selboxinvalidvaldisplay","bind",[_1fc]);
return;
}
for(var i=0;i<_1fe.DATA.length;i++){
var opt=new Option(_1fe.DATA[i][_20c],_1fe.DATA[i][_20b]);
_201.options[i]=opt;
if(_205){
for(var j=0;j<_204.length;j++){
if(_204[j]==opt.value){
opt.selected=true;
}
}
}
}
}
}
}
}else{
_201[_1fd]=_1fe;
}
$E.callBindHandlers(_1fc,null,"change");
$L.info("bind.assignvalue.success","bind",[_1fe,_1fc,_1fd]);
};
$B.localBindHandler=function(e,_20f){
var _210=document.getElementById(_20f.bindTo);
var _211=$B.evaluateBindTemplate(_20f,true);
$B.assignValue(_20f.bindTo,_20f.bindToAttr,_211);
};
$B.localBindHandler._cf_bindhandler=true;
$B.evaluateBindTemplate=function(_212,_213,_214,_215,_216){
var _217=_212.bindExpr;
var _218="";
if(typeof _216=="undefined"){
_216=false;
}
for(var i=0;i<_217.length;i++){
if(typeof (_217[i])=="object"){
var _21a=null;
if(!_217[i].length||typeof _217[i][0]=="object"){
_21a=$X.JSON.encode(_217[i]);
}else{
var _21a=$B.getBindElementValue(_217[i][0],_217[i][1],_217[i][2],_213,_215);
if(_21a==null){
if(_213){
_218="";
break;
}else{
_21a="";
}
}
}
if(_214){
_21a=encodeURIComponent(_21a);
}
_218+=_21a;
}else{
var _21b=_217[i];
if(_216==true&&i>0){
if(typeof (_21b)=="string"&&_21b.indexOf("&")!=0){
_21b=encodeURIComponent(_21b);
}
}
_218+=_21b;
}
}
return _218;
};
$B.jsBindHandler=function(e,_21d){
var _21e=_21d.bindExpr;
var _21f=new Array();
var _220=_21d.callFunction+"(";
for(var i=0;i<_21e.length;i++){
var _222;
if(typeof (_21e[i])=="object"){
if(_21e[i].length){
if(typeof _21e[i][0]=="object"){
_222=_21e[i];
}else{
_222=$B.getBindElementValue(_21e[i][0],_21e[i][1],_21e[i][2],false);
}
}else{
_222=_21e[i];
}
}else{
_222=_21e[i];
}
if(i!=0){
_220+=",";
}
_21f[i]=_222;
_220+="'"+_222+"'";
}
_220+=")";
var _223=_21d.callFunction.apply(null,_21f);
$B.assignValue(_21d.bindTo,_21d.bindToAttr,_223,_21d.bindToParams);
};
$B.jsBindHandler._cf_bindhandler=true;
$B.urlBindHandler=function(e,_225){
var _226=_225.bindTo;
if($C.objectCache[_226]&&$C.objectCache[_226]._cf_visible===false){
$C.objectCache[_226]._cf_dirtyview=true;
return;
}
var url=$B.evaluateBindTemplate(_225,false,true,false,true);
var _228=$U.extractReturnFormat(url);
if(_228==null||typeof _228=="undefined"){
_228="JSON";
}
if(_225.bindToAttr||typeof _225.bindTo=="undefined"||typeof _225.bindTo=="function"){
var _225={"bindTo":_225.bindTo,"bindToAttr":_225.bindToAttr,"bindToParams":_225.bindToParams,"errorHandler":_225.errorHandler,"url":url,returnFormat:_228};
try{
$A.sendMessage(url,"GET",null,true,$B.urlBindHandler.callback,_225);
}
catch(e){
$C.handleError(_225.errorHandler,"ajax.urlbindhandler.connectionerror","http",[url,e]);
}
}else{
$A.replaceHTML(_226,url,null,null,null,_225.errorHandler);
}
};
$B.urlBindHandler._cf_bindhandler=true;
$B.urlBindHandler.callback=function(req,_22a){
if($A.isRequestError(req)){
$C.handleError(_22a.errorHandler,"bind.urlbindhandler.httperror","http",[req.status,_22a.url,req.statusText],req.status,req.statusText);
}else{
$L.info("bind.urlbindhandler.response","http",[req.responseText]);
var _22b;
try{
if(_22a.returnFormat==null||_22a.returnFormat==="JSON"){
_22b=$X.JSON.decode(req.responseText);
}else{
_22b=req.responseText;
}
}
catch(e){
if(req.responseText!=null&&typeof req.responseText=="string"){
_22b=req.responseText;
}else{
$C.handleError(_22a.errorHandler,"bind.urlbindhandler.jsonerror","http",[req.responseText]);
}
}
$B.assignValue(_22a.bindTo,_22a.bindToAttr,_22b,_22a.bindToParams);
}
};
$A.initSelect=function(_22c,_22d,_22e,_22f){
$C.objectCache[_22c]={"valueCol":_22d,"displayCol":_22e,selected:_22f};
};
$S.setupSpry=function(){
if(typeof (Spry)!="undefined"&&Spry.Data){
Spry.Data.DataSet.prototype._cf_getAttribute=function(_230){
var val;
var row=this.getCurrentRow();
if(row){
val=row[_230];
}
return val;
};
Spry.Data.DataSet.prototype._cf_register=function(_233,_234,_235){
var obs={bindParams:_235};
obs.onCurrentRowChanged=function(){
_234.call(null,null,this.bindParams);
};
obs.onDataChanged=function(){
_234.call(null,null,this.bindParams);
};
this.addObserver(obs);
};
if(Spry.Debug.trace){
var _237=Spry.Debug.trace;
Spry.Debug.trace=function(str){
$L.info(str,"spry");
_237(str);
};
}
if(Spry.Debug.reportError){
var _239=Spry.Debug.reportError;
Spry.Debug.reportError=function(str){
$L.error(str,"spry");
_239(str);
};
}
$L.info("spry.setupcomplete","bind");
}
};
$E.registerOnLoad($S.setupSpry,null,true);
$S.bindHandler=function(_23b,_23c){
var url;
var _23e="_cf_nodebug=true&_cf_nocache=true";
if(window._cf_clientid){
_23e+="&_cf_clientid="+_cf_clientid;
}
var _23f=window[_23c.bindTo];
var _240=(typeof (_23f)=="undefined");
if(_23c.cfc){
var _241={};
var _242=_23c.bindExpr;
for(var i=0;i<_242.length;i++){
var _244;
if(_242[i].length==2){
_244=_242[i][1];
}else{
_244=$B.getBindElementValue(_242[i][1],_242[i][2],_242[i][3],false,_240);
}
_241[_242[i][0]]=_244;
}
_241=$X.JSON.encode(_241);
_23e+="&method="+_23c.cfcFunction;
_23e+="&argumentCollection="+encodeURIComponent(_241);
$L.info("spry.bindhandler.loadingcfc","http",[_23c.bindTo,_23c.cfc,_23c.cfcFunction,_241]);
url=_23c.cfc;
}else{
url=$B.evaluateBindTemplate(_23c,false,true,_240);
$L.info("spry.bindhandler.loadingurl","http",[_23c.bindTo,url]);
}
var _245=_23c.options||{};
if((_23f&&_23f._cf_type=="json")||_23c.dsType=="json"){
_23e+="&returnformat=json";
}
if(_23f){
if(_23f.requestInfo.method=="GET"){
_245.method="GET";
if(url.indexOf("?")==-1){
url+="?"+_23e;
}else{
url+="&"+_23e;
}
}else{
_245.postData=_23e;
_245.method="POST";
_23f.setURL("");
}
_23f.setURL(url,_245);
_23f.loadData();
}else{
if(!_245.method||_245.method=="GET"){
if(url.indexOf("?")==-1){
url+="?"+_23e;
}else{
url+="&"+_23e;
}
}else{
_245.postData=_23e;
_245.useCache=false;
}
var ds;
if(_23c.dsType=="xml"){
ds=new Spry.Data.XMLDataSet(url,_23c.xpath,_245);
}else{
ds=new Spry.Data.JSONDataSet(url,_245);
ds.preparseFunc=$S.preparseData;
}
ds._cf_type=_23c.dsType;
var _247={onLoadError:function(req){
$C.handleError(_23c.errorHandler,"spry.bindhandler.error","http",[_23c.bindTo,req.url,req.requestInfo.postData]);
}};
ds.addObserver(_247);
window[_23c.bindTo]=ds;
}
};
$S.bindHandler._cf_bindhandler=true;
$S.preparseData=function(ds,_24a){
var _24b=$U.getFirstNonWhitespaceIndex(_24a);
if(_24b>0){
_24a=_24a.slice(_24b);
}
if(window._cf_jsonprefix&&_24a.indexOf(_cf_jsonprefix)==0){
_24a=_24a.slice(_cf_jsonprefix.length);
}
return _24a;
};
$P.init=function(_24c){
$L.info("pod.init.creating","widget",[_24c]);
var _24d={};
_24d._cf_body=_24c+"_body";
$C.objectCache[_24c]=_24d;
};
$B.cfcBindHandler=function(e,_24f){
var _250=(_24f.httpMethod)?_24f.httpMethod:"GET";
var _251={};
var _252=_24f.bindExpr;
for(var i=0;i<_252.length;i++){
var _254;
if(_252[i].length==2){
_254=_252[i][1];
}else{
_254=$B.getBindElementValue(_252[i][1],_252[i][2],_252[i][3],false);
}
_251[_252[i][0]]=_254;
}
var _255=function(_256,_257){
$B.assignValue(_257.bindTo,_257.bindToAttr,_256,_257.bindToParams);
};
var _258={"bindTo":_24f.bindTo,"bindToAttr":_24f.bindToAttr,"bindToParams":_24f.bindToParams};
var _259={"async":true,"cfcPath":_24f.cfc,"httpMethod":_250,"callbackHandler":_255,"errorHandler":_24f.errorHandler};
if(_24f.proxyCallHandler){
_259.callHandler=_24f.proxyCallHandler;
_259.callHandlerParams=_24f;
}
$X.invoke(_259,_24f.cfcFunction,_24f._cf_ajaxproxytoken,_251,_258);
};
$B.cfcBindHandler._cf_bindhandler=true;
$U.extractReturnFormat=function(url){
var _25b;
var _25c=url.toUpperCase();
var _25d=_25c.indexOf("RETURNFORMAT");
if(_25d>0){
var _25e=_25c.indexOf("&",_25d+13);
if(_25e<0){
_25e=_25c.length;
}
_25b=_25c.substring(_25d+13,_25e);
}
return _25b;
};
$U.replaceAll=function(_25f,_260,_261){
var _262=_25f.indexOf(_260);
while(_262>-1){
_25f=_25f.replace(_260,_261);
_262=_25f.indexOf(_260);
}
return _25f;
};
$U.cloneObject=function(obj){
var _264={};
for(key in obj){
var _265=obj[key];
if(typeof _265=="object"){
_265=$U.cloneObject(_265);
}
_264.key=_265;
}
return _264;
};
$C.clone=function(obj,_267){
if(typeof (obj)!="object"){
return obj;
}
if(obj==null){
return obj;
}
var _268=new Object();
for(var i in obj){
if(_267===true){
_268[i]=$C.clone(obj[i]);
}else{
_268[i]=obj[i];
}
}
return _268;
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
