/*ADOBE SYSTEMS INCORPORATED
Copyright 2007 Adobe Systems Incorporated
All Rights Reserved.

NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the
terms of the Adobe license agreement accompanying it.  If you have received this file from a
source other than Adobe, then your use, modification, or distribution of it requires the prior
written permission of Adobe.*/
if(!ColdFusion.ProgressBar){
ColdFusion.ProgressBar={};
}
var $P=ColdFusion.ProgressBar;
ColdFusion.ProgressBar.create=function(_12b,_12c,_12d,_12e,_12f,_130,_131,_132,_133,_134){
var _135={renderTo:_12b,interval:_12e,onComplete:_132,autodisplay:_131,onError:_134};
var _136={renderTo:_12b};
if(_130!=null&&typeof (_130)!=undefined){
_135.width=_130;
_136.width=_130;
}else{
_136.width=400;
}
if(_12f!=null&&typeof (_12f)!=undefined){
_135.height=_12f;
_136.height=_12f;
}else{
_135.autoHeight=true;
_136.autoHeight=true;
}
if(_12c!=null){
_135.manual=true;
_135.status_retrieval_fn=_12c;
}else{
_135.manual=false;
_135.duration=_12d;
}
_135.hidden=!_131;
_136.hidden=_135.hidden;
if(_133!=null&&typeof _133!="undefined"){
_135.cls=_133;
_136.cls=_133;
}
var _137=new Ext.ProgressBar(_136);
_135.progressBarComp=_137;
ColdFusion.objectCache[_12b]=_135;
ColdFusion.Log.info("progressbar.create.created","widget",[_12b]);
};
$P.start=function(_138){
var _139=$P.getProgressBarObject(_138);
var _13a=ColdFusion.objectCache[_138];
if(!_139.isVisible()){
_139=_139.show();
}
_13a.started=true;
if(_13a.manual==false){
var _13b=_13a.interval;
var _13c=_13a.duration;
var _13d=_13c/_13b;
_139.wait({interval:_13b,duration:_13c,increment:_13d,fn:$P.automaticPBCompleteHandler,scope:_13a});
}else{
var _13e=setInterval(_13a.status_retrieval_fn,_13a.interval);
_13a.processId=_13e;
}
ColdFusion.Log.info("progressbar.start.started","widget",[_138]);
};
$P.stop=function(_13f,_140){
var pBar=$P.getProgressBarObject(_13f);
var _142=ColdFusion.objectCache[_13f];
var _143=_142.processId;
if(typeof _142.started!="undefined"&&_142.started==true){
_142.started=false;
}else{
ColdFusion.Log.info("progressbar.stop.nonrunning","widget",[_13f]);
return;
}
if(_143!=null&&typeof (_143)!="undefined"){
clearInterval(_143);
}
if(typeof _142.manual!="undefined"&&_142.manual==false){
pBar.reset();
}
if(_140&&_140==true){
var _144=_142.onComplete;
if(_144!=null&&_144.call){
_144.call();
}
}
ColdFusion.Log.info("progressbar.stop.stopped","widget",[_13f]);
};
$P.hide=function(_145){
var pBar=$P.getProgressBarObject(_145);
if(pBar.isVisible()){
pBar.hide();
}
ColdFusion.Log.info("progressbar.hide.hidden","widget",[_145]);
};
$P.show=function(_147){
var pBar=$P.getProgressBarObject(_147);
if(!pBar.isVisible()){
pBar.show();
}
ColdFusion.Log.info("progressbar.show.shown","widget",[_147]);
};
$P.reset=function(_149){
var pBar=$P.getProgressBarObject(_149);
if(typeof pBar!="undefined"){
pBar.reset();
}
ColdFusion.Log.info("progressbar.reset.reset","widget",[_149]);
};
$P.updateStatus=function(_14b,_14c,_14d){
var pBar=$P.getProgressBarObject(_14b);
if(typeof (_14c)=="undefined"||typeof (_14c)!="number"){
ColdFusion.handleError(null,"progressbar.updatestatus.invalidstatus","widget",[_14b,_14c],null,null,true);
return;
}
if(typeof pBar!="undefined"){
pBar.updateProgress(_14c,_14d);
}
ColdFusion.Log.info("progressbar.updatestatus.updated","widget",[_14b]);
};
$P.update=function(_14f,_150){
var _151={};
var _152=ColdFusion.objectCache[_14f];
if(_152==null||typeof (_152)=="undefined"){
ColdFusion.handleError(null,"progressbar.update.notfound","widget",[_14f],null,null,true);
return;
}
if(_150.duration){
if(typeof _150.duration==="number"||typeof _150.duration=="object"){
_151.duration=_150.duration;
}else{
ColdFusion.handleError(null,"progressbar.update.invalidduration","widget",[_14f],null,null,true);
return;
}
}
if(_150.interval){
if(typeof _150.interval==="number"||typeof _150.interval=="object"){
_151.interval=_150.interval;
}else{
ColdFusion.handleError(null,"progressbar.update.invalidinterval","widget",[_14f],null,null,true);
return;
}
}
if(_150.oncomplete){
if(typeof _150.oncomplete==="function"||typeof _150.oncomplete=="object"){
_151.onComplete=_150.oncomplete;
}else{
ColdFusion.handleError(null,"progressbar.update.invalidoncomplete","widget",[_14f],null,null,true);
return;
}
}
for(key in _151){
_152[key]=_151[key];
}
ColdFusion.Log.info("progressbar.update.updated","widget",[_14f]);
};
$P.loadStatus=function(data,_154){
var _155=ColdFusion.AjaxProxy.JSON.decode(data);
var _156=_155.MESSAGE;
var _157=_155.STATUS;
var pBar=$P.getProgressBarObject(_154._cf_progressbarid);
pBar.updateProgress(_157,_156);
if(_157&&(_157===1||_157==1||_157>1)){
$P.stop(_154._cf_progressbarid,true);
}
};
$P.automaticPBCompleteHandler=function(){
var _159=this.progressBarComp;
_159.updateProgress(1);
if(this.onComplete&&typeof this.onComplete=="function"){
this.onComplete.call(_159,_159);
}
};
$P.errorHandler=function(_15a,_15b,_15c){
var pbId=_15c.bindToParams._cf_progressbarid;
var _15e=ColdFusion.objectCache[pbId];
var _15f=_15e.onError;
if(_15f!=null&&typeof _15f==="function"){
_15f.call(null,_15a,_15b);
}
$P.stop(pbId);
};
$P.getProgressBarObject=function(_160){
var _161=ColdFusion.objectCache[_160];
if(_161==null||typeof (_161)=="undefined"){
ColdFusion.handleError(null,"progressbar.getProgressBarObject.missingprogressbarid","widget",[_160],null,null,true);
return;
}
if(_161.progressBarComp&&typeof _161.progressBarComp!="undefined"){
return _161.progressBarComp;
}else{
ColdFusion.handleError(null,"progressbar.getProgressBarObject.missingprogressbarcomponent","widget",[_160],null,null,true);
return;
}
};
