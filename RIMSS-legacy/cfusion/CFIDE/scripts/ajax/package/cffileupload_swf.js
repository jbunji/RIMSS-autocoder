/*ADOBE SYSTEMS INCORPORATED
Copyright 2007 Adobe Systems Incorporated
All Rights Reserved.

NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the
terms of the Adobe license agreement accompanying it.  If you have received this file from a
source other than Adobe, then your use, modification, or distribution of it requires the prior
written permission of Adobe.*/
if(!ColdFusion.FileUpload){
ColdFusion.FileUpload={};
}
var $FS=ColdFusion.FileUpload;
$FS.defaultSWFLocation=_cf_ajaxscriptsrc+"/resources/cf/assets/MultiFileUpload.swf";
var isIE=(navigator.appVersion.indexOf("MSIE")!=-1)?true:false;
var isWin=(navigator.appVersion.toLowerCase().indexOf("win")!=-1)?true:false;
var isOpera=(navigator.userAgent.indexOf("Opera")!=-1)?true:false;
var defaultAddButtonLabel="Add Files";
var defaultUploadButtonLabel="Upload";
var defaultClearButtonLabel="Clear All";
var defaultDeleteButtonLabel="Delete";
var defaultAddIcon=_cf_ajaxscriptsrc+"/resources/cf/images/fileupload/addfile.png";
var defaultUploadIcon=_cf_ajaxscriptsrc+"/resources/cf/images/fileupload/upload.png";
var defaultClearIcon=_cf_ajaxscriptsrc+"/resources/cf/images/fileupload/clear.gif";
var defaultDeleteIcon=_cf_ajaxscriptsrc+"/resources/cf/images/fileupload/delete.png";
var defaultUploadSize=10*1024*1024;
var fileUploadPrefix="cf_fileUpload_";
ColdFusion.FileUpload.create=function(_630,_631,_632,_633,_634,_635,_636,_637,_638,_639,_63a,_63b,_63c,_63d,_63e,_63f,_640,_641,_642,_643,_644,_645,_646,_647,_648,_649,_64a,_64b,_64c,_64d){
var _64e={};
_64e.uploadDivId=_630;
_64e.fileUploadName=fileUploadPrefix+_630;
_64e.url_withoutQuery=_631;
_64e.url_queryString=_632;
_64e.url_CF_cookie=_633;
_64e.url=$FS.constructUrl(_631,_632,_633);
_64e.onCompleteHandler=_63b;
_64e.onUploadCompleteHandler=_63c;
_64e.onErrorHandler=_63d;
_64e.progressbar=_648;
if(_640==null){
_640="";
}
_64e.bgcolor=_640;
if(_641==null){
_641="";
}
_64e.selectcolor=_641;
if(_642==null){
_642="";
}
_64e.rollovercolor=_642;
if(_643==null){
_643="";
}
_64e.textcolor=_643;
if(_646==null){
_646="left";
}
_64e.titletextalign=_646;
if(_644==null){
_644="";
}
_64e.titletextcolor=_644;
if(_645==null){
_645="";
}
_64e.headercolor=_645;
_64e.bgcolor=_640;
_64e.bgcolor=_640;
if(_647==null){
_647="";
}
_64e.fileFilter=_647;
_64e.disableUploadButton=_64a;
if(_64c==null||typeof _64c=="undefined"){
_64c="window";
}
_64e.wmode=_64c;
_64e.stopOnError=_64b;
if(_634==null||typeof _634==="undefined"){
_634=defaultAddButtonLabel;
}
_64e.addIcon=defaultAddIcon;
_64e.addButtonLabel=_634;
if(_636==null||typeof _636==="undefined"){
_636=defaultUploadButtonLabel;
}
_64e.uploadButtonLabel=_636;
_64e.uploadIcon=defaultUploadIcon;
if(_638==null||typeof _638==="undefined"){
_638="File Upload ";
}
_64e.title=_638;
_64e.swfLocation=$FS.defaultSWFLocation;
if(_635==null||typeof _635==="undefined"){
_635=defaultClearButtonLabel;
}
_64e.clearButtonLabel=_635;
_64e.clearIcon=defaultClearIcon;
if(_637==null||typeof _637==="undefined"){
_637=defaultDeleteButtonLabel;
}
_64e.deleteButtonLabel=_637;
_64e.deleteIcon=defaultDeleteIcon;
if(_639==null||!typeof _639==="Number"){
_639=-1;
}
_64e.maxFileSelect=_639;
if(_63a==null||!typeof _63a==="number"){
_63a=defaultUploadSize;
}
_64e.maxUploadSize=_63a;
if(_63e==null||typeof _63e==="undefined"){
_63e=420;
}
_64e.widthInPx=_63e+"px";
_64e.width=_63e;
if(_63f==null||typeof _63f==="undefined"){
_63f=300;
}
_64e.heightInPx=_63f+"px";
_64e.height=_63f;
_64e.align=_64d;
ColdFusion.objectCache[_630]=_64e;
ColdFusion.objectCache[_64e.fileUploadName]=_64e;
var _64f=$FS.constructMarkup(_64e);
var _650=document.getElementById(_630);
_650.innerHTML=_64f;
ColdFusion.Log.info("fileupload.initialized","widget",[_630]);
};
$FS.constructMarkup=function(_651){
var str="";
if(isIE&&isWin&&!isOpera){
str+="<object width=\""+_651.width+"\" height=\""+_651.height+"\"";
str+=" id=\""+_651.fileUploadName+"\" name=\""+_651.playerName+"\" type=\"application/x-shockwave-flash\" classid=\"clsid:d27cdb6e-ae6d-11cf-96b8-444553540000\" ";
str+=" data=\""+_651.swfLocation+"\">";
str+="<param name=\"movie\" value=\""+_651.swfLocation+"\" />";
str+="<param name=\"quality\" value=\""+_651.quality+"\" />";
str+="<param name=\"allowFullScreen\" value=\""+_651.fullScreen+"\" />";
str+="<param name=\"allowScriptAccess\" value=\"sameDomain\" />";
str+="<param name=\"wmode\" value=\""+_651.wmode+"\" />";
str+="<param name=\"flashvars\" value=\"uniqueid="+_651.fileUploadName+"&url="+_651.url+"&addLabel="+_651.addButtonLabel+"&deleteLabel="+_651.deleteButtonLabel;
str+="&clearLabel="+_651.clearButtonLabel+"&uploadLabel="+_651.uploadButtonLabel+"&maxUploadSize="+_651.maxUploadSize+"&maxFileSelect="+_651.maxFileSelect+"&progress="+_651.progressbar;
str+="&stopOnError="+_651.stopOnError+"&hideUpload="+_651.disableUploadButton+"&bgcolor="+_651.bgcolor+"&fileFilter="+_651.fileFilter+"&deleteIcon="+_651.deleteIcon+"&title="+_651.title;
str+="&uploadIcon="+_651.uploadIcon+"&textcolor="+_651.textcolor+"&titletextcolor="+_651.titletextcolor+"&headercolor="+_651.headercolor+"&titletextalign="+_651.titletextalign+"&rollovercolor="+_651.rollovercolor+"&selectcolor="+_651.selectcolor+"\" />";
str+="</object>";
}else{
str="<embed src=\""+_651.swfLocation+"\" allowScriptAccess=\"samedomain\" pluginspage=\"http://www.adobe.com/go/getflashplayer\" type=\"application/x-shockwave-flash\" wmode=\""+_651.wmode+"\"";
str+=" name=\""+_651.fileUploadName+"\" width=\""+_651.width+"\" height=\""+_651.height+"\" quality=\" "+_651.quality+"\"";
str+=" flashvars=\"uniqueid="+_651.fileUploadName+"&url="+_651.url+"&addLabel="+_651.addButtonLabel+"&deleteLabel="+_651.deleteButtonLabel;
str+="&clearLabel="+_651.clearButtonLabel+"&uploadLabel="+_651.uploadButtonLabel+"&maxUploadSize="+_651.maxUploadSize+"&maxFileSelect="+_651.maxFileSelect+"&progress="+_651.progressbar;
str+="&stopOnError="+_651.stopOnError+"&hideUpload="+_651.disableUploadButton+"&bgcolor="+_651.bgcolor+"&fileFilter="+_651.fileFilter+"&deleteIcon="+_651.deleteIcon+"&title="+_651.title;
str+="&uploadIcon="+_651.uploadIcon+"&textcolor="+_651.textcolor+"&titletextcolor="+_651.titletextcolor+"&headercolor="+_651.headercolor+"&titletextalign="+_651.titletextalign+"&rollovercolor="+_651.rollovercolor+"&selectcolor="+_651.selectcolor+"\" />";
}
return str;
};
$FS.constructUrl=function(_653,_654,_655){
var url=_653;
if(_654!=null){
url+="?"+_654;
if(_655!=null){
url+="%26"+_655;
}
}else{
if(_655!=null){
url+="?"+_655;
}
}
return url;
};
coldfusion_FileUploadSwf_complete=function(name,_658){
var _659=$FS.getFileUploadComponent(name);
var _65a=ColdFusion.objectCache[name];
var _65b=_65a.onCompleteHandler;
if(_65b!=null&&typeof _65b=="function"){
_65b.call(this,_658);
}
$FS.addResultToArray(_658,_65a);
};
coldfusion_FileUploadSwf_onError=function(name,_65d){
var _65e=$FS.getFileUploadComponent(name);
var _65f=ColdFusion.objectCache[name];
var _660=_65f.onErrorHandler;
if(_660!=null&&typeof _660=="function"){
_660.call(this,_65d);
}
$FS.addResultToArray(_65d,_65f);
};
coldfusion_FileUploadSwf_UploadCompete=function(name){
var _662=$FS.getFileUploadComponent(name);
var _663=ColdFusion.objectCache[name];
var _664=_663.onUploadCompleteHandler;
var _665=_663.resultArray;
if(_664!=null&&typeof _664=="function"){
_664.call(this,_665);
}
_663.resultArray=new Array();
};
$FS.addResultToArray=function(_666,_667){
var _668=_667.resultArray;
if(_668==null||typeof _668=="undefined"){
_668=_667.resultArray=new Array();
}
_668.push(_666);
};
$FS.cancelUpload=function(name){
var _66a=fileUploadPrefix+name;
var _66b=$FS.getFileUploadComponent(_66a);
if(_66b!=null){
_66b.cancelFileUpload();
}else{
ColdFusion.handleError(null,"fileupload.cancelupload.notfound","widget",[name],null,null,true);
}
ColdFusion.Log.info("fileupload.cancelupload.cancelled","widget",[name]);
};
$FS.getSelectedFiles=function(name){
var _66d=fileUploadPrefix+name;
var _66e=$FS.getFileUploadComponent(_66d);
if(_66e!=null){
return _66e.getSelectedFileArray();
}else{
ColdFusion.handleError(null,"fileupload.getSelectedFiles.notfound","widget",[name],null,null,true);
}
ColdFusion.Log.info("fileupload.getSelectedFiles.selected","widget",[name]);
};
$FS.clearAllFiles=function(name){
var _670=fileUploadPrefix+name;
var _671=$FS.getFileUploadComponent(_670);
if(_671!=null){
_671.clearAllUpload();
}else{
ColdFusion.handleError(null,"fileupload.clearallfiles.notfound","widget",[name],null,null,true);
}
ColdFusion.Log.info("fileupload.clearallfiles.cleared","widget",[name]);
};
$FS.setURL=function(name,src){
var _674=$FS.getFileUploadComponent(fileUploadPrefix+name);
var _675=ColdFusion.objectCache[name];
if(_675==null||typeof (_675)=="undefined"){
ColdFusion.handleError(null,"fileupload.setURL.notfound","widget",[name],null,null,true);
}
if(!src||src.length==0){
ColdFusion.handleError(null,"fileupload.setURL.invalidurl","widget",[name],null,null,true);
}
var _676=null;
if(src.indexOf("?")>0){
_676=src.substring(src.indexOf("?")+1);
_676=escape(_676);
src=src.substring(0,src.indexOf("?"));
}
if(src.charAt(0)!="/"&&src.indexOf("://")<0){
var _677=_675.url_withoutQuery;
_677=unescape(_677);
var _678="";
if(_677||_677.indexOf("/")>-1){
_678=_677.substring(0,_677.lastIndexOf("/")+1);
}
var _679=_678+src;
var _67a=_679.split("/");
var _67b=new Array();
var _67c=0;
for(var i=0;i<_67a.length;i++){
if(_67a[i]==".."){
_67b[--_67c]="";
}else{
_67b[_67c++]=_67a[i];
}
}
src=_67b[0];
for(var i=1;i<_67c;i++){
src=src+"/"+_67b[i];
}
}
var _67e=$FS.constructUrl(src,_676,_675.url_CF_cookie);
_675.url=_67e;
_674.setSrc(_67e);
ColdFusion.Log.info("fileupload.setURL.urlset","widget",[name,_67e]);
};
$FS.startUpload=function(name){
var _680=fileUploadPrefix+name;
var _681=$FS.getFileUploadComponent(_680);
if(_681!=null){
_681.submitUploadForm();
}else{
ColdFusion.handleError(null,"fileupload.startupload.notfound","widget",[name],null,null,true);
}
ColdFusion.Log.info("fileupload.startupload.started","widget",[name]);
};
$FS.getFileUploadComponent=function(name){
if(navigator.appName.indexOf("Microsoft")!=-1){
if(window[name]!=null){
return window[name];
}else{
return document[name];
}
}else{
return document[name];
}
};
