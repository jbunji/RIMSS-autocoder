/*ADOBE SYSTEMS INCORPORATED
Copyright 2007 Adobe Systems Incorporated
All Rights Reserved.

NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the
terms of the Adobe license agreement accompanying it.  If you have received this file from a
source other than Adobe, then your use, modification, or distribution of it requires the prior
written permission of Adobe.*/
if(!ColdFusion.Autosuggest){
ColdFusion.Autosuggest={};
}
var staticgifpath=_cf_ajaxscriptsrc+"/resources/cf/images/static.gif";
var dynamicgifpath=_cf_ajaxscriptsrc+"/resources/cf/images/loading.gif";
ColdFusion.Autosuggest.loadAutoSuggest=function(_440,_441){
var _442=ColdFusion.objectCache[_441.autosuggestid];
if(typeof (_440)=="string"){
_440=_440.split(",");
}else{
var _443=false;
if(_440&&ColdFusion.Util.isArray(_440)){
_443=true;
if(_440.length>0&&(typeof (_440[0])!="string"&&typeof (_440[0])!="number")){
_443=false;
}
}
if(!_443){
ColdFusion.handleError(_442.onbinderror,"autosuggest.loadautosuggest.invalidvalue","widget",[_441.autosuggestid]);
return;
}
}
var _444=document.getElementById(_441.autosuggestid).value;
if(_444.length==1&&_440.length==0){
var _445=new Array();
_442.dataSource.flushCache();
_442.dataSource=new YAHOO.widget.DS_JSArray(_445);
_442.autosuggestitems=_445;
}
if(_440.length>0){
var i=0;
var _447=false;
var _445=new Array();
for(i=0;i<_440.length;i++){
if(_440[i]){
if(typeof (_440[i])=="string"){
_445[i]=_440[i];
}else{
if(typeof (_440[i])=="number"){
_445[i]=_440[i]+"";
}else{
_445[i]=new String(_440[i]);
}
}
if(_445[i].indexOf(_444)==0){
_447=true;
}
}
}
if(_447==false&&_442.showloadingicon==true){
document.getElementById(_441.autosuggestid+"_cf_button").src=staticgifpath;
}
_442.dataSource.flushCache();
_442.dataSource=new YAHOO.widget.DS_JSArray(_445);
_442.autosuggestitems=_445;
if(_442.queryMatchContains){
_442.dataSource.queryMatchContains=_442.queryMatchContains;
}
_442._sendQuery(_444);
}else{
if(_442.showloadingicon==true){
document.getElementById(_441.autosuggestid+"_cf_button").src=staticgifpath;
_442.showloadingicon==false;
}
}
};
ColdFusion.Autosuggest.checkToMakeBindCall=function(arg,_449,_44a,_44b,_44c){
var _44b=document.getElementById(_449).value;
if(!_44a.isContainerOpen()&&_44b.length>0&&arg.keyCode!=39&&(arg.keyCode>31||(arg.keyCode==8&&_44a.valuePresent==true))){
_44a.valuePresent=false;
if(_44a.showloadingicon==true){
document.getElementById(_449+"_cf_button").src=dynamicgifpath;
}
ColdFusion.Log.info("autosuggest.checktomakebindcall.fetching","widget",[_449,_44b]);
if(_44a.cfqueryDelay>0){
var _44d=setTimeout(_44c,_44a.cfqueryDelay*1000,this);
if(_44a._nDelayID!=-1){
clearTimeout(_44a._cf_nDelayID);
}
_44a._cf_nDelayID=_44d;
}else{
_44c.call(this);
}
}
};
ColdFusion.Autosuggest.checkValueNotInAutosuggest=function(_44e,_44f){
if(_44e.autosuggestitems){
for(var i=0;i<_44e.autosuggestitems.length;i++){
if(_44f==_44e.autosuggestitems[i]){
return false;
}
}
}
return true;
};
ColdFusion.Autosuggest.triggerOnChange=function(type,args){
var _453=args[0];
var _454=document.getElementById(_453.id);
ColdFusion.Event.callBindHandlers(_453.id,null,"change");
};
ColdFusion.Autosuggest.init=function(_455,_456,_457){
return new YAHOO.widget.AutoComplete(_455,_456,_457);
};
ColdFusion.Autosuggest.getAutosuggestObject=function(_458){
var _459=ColdFusion.objectCache[_458];
if(_459==null||typeof (_459)=="undefined"){
ColdFusion.handleError(null,"autosuggest.getAutosuggestObject.notfound","widget",[_458],null,null,true);
}
return _459;
};
ColdFusion.Autosuggest.initJS_ARRAY=function(_45a){
return new YAHOO.widget.DS_JSArray(_45a);
};
