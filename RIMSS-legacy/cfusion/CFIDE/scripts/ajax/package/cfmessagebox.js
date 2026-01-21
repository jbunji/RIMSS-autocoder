/*ADOBE SYSTEMS INCORPORATED
Copyright 2007 Adobe Systems Incorporated
All Rights Reserved.

NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the
terms of the Adobe license agreement accompanying it.  If you have received this file from a
source other than Adobe, then your use, modification, or distribution of it requires the prior
written permission of Adobe.*/
if(!ColdFusion.MessageBox){
ColdFusion.MessageBox={};
}
var $MB=ColdFusion.MessageBox;
var $XB=Ext.MessageBox;
var DEFAULT_OK=$XB.buttonText.ok;
var DEFAULT_NO=$XB.buttonText.no;
var DEFAULT_CANCEL=$XB.buttonText.cancel;
var DEFAULT_YES=$XB.buttonText.yes;
var DEFAULT_ALERT_BUTTON_TYPE=$XB.OK;
var DEFAULT_CONFIRM_BUTTON_TYPE=$XB.YESNO;
var DEFAULT_PROMPT_BUTTON_TYPE=$XB.OKCANCEL;
var CF_BEFORE_SHOW_HANDLER_ADDED=false;
var CURRENT_MESSAGEBOX_ID;
ColdFusion.MessageBox.init=function(_492,type,_494,_495,_496,_497,_498,_499,_49a,_49b,_49c,icon,_49e,x,y,_4a1,_4a2){
var _4a3={messageBoxId:_492,type:type,callBack_Fn:_49c,multiline:_49a,modal:_49b,width:_49e,bodyStyle:_4a2};
if(_494==null||typeof (_494)=="undefined"){
_494="";
}
_494=ColdFusion.Util.replaceAll(_494,"\n","<br>");
_4a3.messageText=_494;
if(_496!=null&&typeof (_496)!="undefined"){
_4a3.label_OK=_496;
}
if(_497!=null&&typeof (_497)!="undefined"){
_4a3.label_NO=_497;
}
if(_499!=null&&typeof (_499)!="undefined"){
_4a3.label_YES=_499;
}
if(_498!=null&&typeof (_498)!="undefined"){
_4a3.label_CANCEL=_498;
}
if(_495==null||typeof (_495)=="undefined"){
type=type.toLowerCase();
if(type=="alert"){
_495="Alert";
}else{
if(type=="confirm"){
_495="Confirm";
}else{
if(type=="prompt"){
_495="Prompt";
}
}
}
}
_4a3.title=_495;
if(_4a1&&typeof (_4a1)=="string"){
_4a3.buttonType=_4a1;
}
if(icon&&typeof (icon)=="string"){
_4a3.icon=icon;
}
if(typeof x=="number"&&x>=0){
_4a3.x=x;
}
if(typeof y=="number"&&y>=0){
_4a3.y=y;
}
ColdFusion.objectCache[_492]=_4a3;
};
$MB.show=function(_4a4){
var _4a5=$MB.getMessageBoxObject(_4a4);
var type=_4a5.type;
type=(new String(type)).toLowerCase();
if(!CF_BEFORE_SHOW_HANDLER_ADDED){
var _4a7=Ext.MessageBox.getDialog();
_4a7.addListener("beforeshow",$MB.beforeShowHandler,_4a5);
CF_BEFORE_SHOW_HANDLER_ADDED=true;
}
CURRENT_MESSAGEBOX_ID=_4a4;
var _4a8=_4a5.buttonType;
var _4a9={ok:DEFAULT_OK,no:DEFAULT_NO,cancel:DEFAULT_CANCEL,yes:DEFAULT_YES};
if(_4a5.label_OK){
_4a9.ok=_4a5.label_OK;
}
if(_4a5.label_YES){
_4a9.yes=_4a5.label_YES;
}
if(_4a5.label_NO){
_4a9.no=_4a5.label_NO;
}
if(_4a5.label_CANCEL){
_4a9.cancel=_4a5.label_CANCEL;
}
Ext.MessageBox.buttonText=_4a9;
if(typeof _4a8!="undefined"){
_4a8=_4a8.toUpperCase();
if(_4a8&&_4a8!=="OKCANCEL"&&_4a8!=="OK"&&_4a8!=="YESNOCANCEL"&&_4a8!=="YESNO"){
ColdFusion.handleError(null,"messagebox.show.invalidbuttontype","widget",[messagebox,_4a8],null,null,true);
}
switch(_4a8){
case "OK":
_4a8=$XB.OK;
break;
case "OKCANCEL":
_4a8=$XB.OKCANCEL;
break;
case "YESNOCANCEL":
_4a8=$XB.YESNOCANCEL;
break;
case "YESNO":
_4a8=$XB.YESNO;
break;
}
}
var icon=_4a5.icon;
var _4ab="";
if(icon&&typeof (icon)==="string"){
icon=icon.toUpperCase();
switch(icon){
case "ERROR":
_4ab=$XB.ERROR;
break;
case "INFO":
_4ab=$XB.INFO;
break;
case "QUESTION":
_4ab=$XB.QUESTION;
break;
case "WARNING":
_4ab=$XB.WARNING;
break;
}
}
var _4ac={title:_4a5.title,msg:_4a5.messageText,fn:_4a5.callBack_Fn,modal:_4a5.modal,icon:_4ab,scope:null};
if(_4a5.width){
_4ac.width=_4a5.width;
if(_4ac.width>600){
_4ac.maxWidth=_4ac.width;
}
if(_4ac.width<100){
_4ac.minWidth=_4ac.width;
}
}
if(type==="alert"){
if(!_4a8){
_4a8=DEFAULT_ALERT_BUTTON_TYPE;
}
_4ac.buttons=_4a8;
$XB.show(_4ac);
}
if(type==="confirm"){
if(!_4a8){
_4a8=DEFAULT_CONFIRM_BUTTON_TYPE;
}
_4ac.buttons=_4a8;
$XB.show(_4ac);
}
if(type==="prompt"){
if(!_4a8){
_4a8=DEFAULT_PROMPT_BUTTON_TYPE;
}
_4ac.buttons=_4a8;
_4ac.prompt=true;
_4ac.multiline=_4a5.multiline;
_4ac.value="",$XB.show(_4ac);
}
ColdFusion.Log.info("messagebox.show.shown","widget",[_4a4]);
};
$MB.create=function(_4ad,type,_4af,_4b0,_4b1,_4b2){
if(_4ad&&typeof _4ad!="string"){
ColdFusion.handleError(null,"messagebox.create.invalidname","widget",null,null,null,true);
return;
}
if(!_4ad||ColdFusion.trim(_4ad)==""){
ColdFusion.handleError(null,"messagebox.create.invalidname","widget",null,null,null,true);
return;
}
var _4b3=ColdFusion.objectCache[_4ad];
if(_4b3!=null||typeof _4b3!="undefined"){
ColdFusion.handleError(null,"messagebox.create.duplicatename","widget",[_4ad],null,null,true);
return;
}
if(_4b0&&typeof _4b0!="string"){
ColdFusion.handleError(null,"messagebox.create.invalidmessage","widget",[_4ad],null,null,true);
return;
}
if(!_4b0||ColdFusion.trim(_4b0)==""){
ColdFusion.handleError(null,"messagebox.create.invalidmessage","widget",[_4ad],null,null,true);
return;
}
if(_4af&&typeof _4af!="string"){
ColdFusion.handleError(null,"messagebox.create.invalidtitle","widget",[_4ad],null,null,true);
return;
}
if(type&&typeof type!="string"){
ColdFusion.handleError(null,"messagebox.create.invalidtype","widget",[_4ad],null,null,true);
return;
}
if(!type||ColdFusion.trim(type)==""){
ColdFusion.handleError(null,"messagebox.create.emptytype","widget",[_4ad],null,null,true);
return;
}
if(_4b1&&typeof _4b1!=="function"){
ColdFusion.handleError(null,"messagebox.create.invalidcallback","widget",[_4ad],null,null,true);
return;
}
var _4b4=DEFAULT_CANCEL;
var _4b5=DEFAULT_NO;
var _4b6=DEFAULT_OK;
var _4b7=DEFAULT_YES;
var _4b8=true;
var _4b9=null;
var _4ba=false;
var icon;
var _4bc;
var x;
var y;
var _4bf;
if(_4b2&&_4b2.labelok){
_4b6=_4b2.labelok;
}
if(_4b2&&_4b2.labelno){
_4b5=_4b2.labelno;
}
if(_4b2&&_4b2.labelyes){
_4b7=_4b2.labelyes;
}
if(_4b2&&_4b2.labelcancel){
_4b4=_4b2.labelcancel;
}
if(_4b2&&typeof _4b2.multiline==="boolean"){
_4ba=_4b2.multiline;
}
if(_4b2&&typeof _4b2.modal==="boolean"){
_4b8=_4b2.modal;
}
if(_4b2&&_4b2.buttontype){
_4b9=_4b2.buttontype;
if(type.toUpperCase()!=="CONFIRM"){
ColdFusion.handleError(null,"messagebox.create.invalidtypeandbuttontypecombination","widget",[_4ad],null,null,true);
}else{
if(_4b9.toUpperCase()!="YESNO"&&_4b9.toUpperCase()!="YESNOCANCEL"){
ColdFusion.handleError(null,"messagebox.create.invalidbuttontype","widget",[_4ad,_4b9],null,null,true);
}
}
}
if(_4b2&&_4b2.width){
_4bc=_4b2.width;
if(_4bc&&typeof _4bc!="number"){
ColdFusion.handleError(null,"messagebox.create.widthnotnumeric","widget",[_4ad,_4bc],null,null,true);
}
}
if(_4b2&&typeof _4b2.x!="undefined "){
if(_4b2.x&&typeof _4b2.x!="number"){
ColdFusion.handleError(null,"messagebox.create.xnotnumeric","widget",[_4ad,_4b2.x],null,null,true);
return;
}
x=_4b2.x;
}
if(_4b2&&typeof _4b2.y!="undefined"){
if(_4b2.y&&typeof _4b2.y!="number"){
ColdFusion.handleError(null,"messagebox.create.ynotnumeric","widget",[_4ad,_4b2.y],null,null,true);
return;
}
y=_4b2.y;
}
if(_4b2&&_4b2.icon){
icon=_4b2.icon;
if(icon){
icon=icon.toUpperCase();
if(icon!="ERROR"&&icon!="INFO"&&icon!="QUESTION"&&icon!="WARNING"){
ColdFusion.handleError(null,"messagebox.create.invalidicon","widget",[_4ad,icon],null,null,true);
}
}
}
if(_4b2&&_4b2.bodystyle){
_4bf=_4b2.bodystyle;
}
$MB.init(_4ad,type,_4b0,_4af,_4b6,_4b5,_4b4,_4b7,_4ba,_4b8,_4b1,icon,_4bc,x,y,_4b9,_4bf);
ColdFusion.Log.info("messagebox.create.created","widget",[_4ad,type]);
};
$MB.updateMessage=function(_4c0,_4c1){
var _4c2=$MB.getMessageBoxObject(_4c0);
_4c2.messageText=_4c1;
ColdFusion.Log.info("messagebox.updatemessage.updated","widget",[_4c0]);
};
$MB.updateTitle=function(_4c3,_4c4){
var _4c5=$MB.getMessageBoxObject(_4c3);
_4c5.title=_4c4;
ColdFusion.Log.info("messagebox.updatetitle.updated","widget",[_4c3]);
};
$MB.update=function(_4c6,_4c7){
var _4c8=$MB.getMessageBoxObject(_4c6);
var _4c9={};
if(!_4c7||typeof _4c7!="object"){
ColdFusion.handleError(null,"messagebox.update.invalidconfigobject","widget",[_4c6],null,null,true);
return;
}
if(_4c7.name&&typeof _4c7.name=="string"){
ColdFusion.handleError(null,"messagebox.update.nameupdatenotallowed","widget",[_4c6],null,null,true);
return;
}
if(_4c7.type&&typeof _4c7.type=="string"){
ColdFusion.handleError(null,"messagebox.update.typeupdatenotallowed","widget",[_4c6],null,null,true);
return;
}
if(_4c7.message){
if(typeof _4c7.message==="string"||typeof _4c7.message=="object"){
_4c9.messageText=_4c7.message;
}else{
ColdFusion.handleError(null,"messagebox.update.invalidmessage","widget",[_4c6],null,null,true);
return;
}
}
if(_4c7.title){
if(typeof _4c7.title==="string"||typeof _4c7.title=="object"){
_4c9.title=_4c7.title;
}else{
ColdFusion.handleError(null,"messagebox.update.invalidtitle","widget",[_4c6],null,null,true);
return;
}
}
if(_4c7.labelok!=null||typeof _4c7.labelok!="undefined"){
if(typeof _4c7.labelok==="string"||typeof _4c7.labelok=="object"){
_4c9.label_OK=_4c7.labelok;
}else{
ColdFusion.handleError(null,"messagebox.update.invalidlabelok","widget",[_4c6],null,null,true);
return;
}
}
if(_4c7.labelno!=null||typeof _4c7.labelno!="undefined"){
if(typeof _4c7.labelno==="string"||typeof _4c7.labelno=="object"){
_4c9.label_NO=_4c7.labelno;
}else{
ColdFusion.handleError(null,"messagebox.update.invalidlabelno","widget",[_4c6],null,null,true);
return;
}
}
if(_4c7.labelyes!=null||typeof _4c7.labelyes!="undefined"){
if(typeof _4c7.labelyes==="string"||typeof _4c7.labelyes=="object"){
_4c9.label_YES=_4c7.labelyes;
}else{
ColdFusion.handleError(null,"messagebox.update.invalidlabelyes","widget",[_4c6],null,null,true);
return;
}
}
if(_4c7.labelcancel!=null||typeof _4c7.labelcancel!="undefined"){
if(typeof _4c7.labelcancel==="string"||typeof _4c7.labelcancel=="object"){
_4c9.label_CANCEL=_4c7.labelcancel;
}else{
ColdFusion.handleError(null,"messagebox.update.invalidlabelcancel","widget",[_4c6],null,null,true);
return;
}
}
if(typeof _4c7.modal=="boolean"){
_4c9.modal=_4c7.modal;
}
if(typeof _4c7.multiline==="boolean"){
if(_4c8.type.toLowerCase()!="prompt"){
ColdFusion.handleError(null,"messagebox.update.invalidtypeformultiline","widget",[_4c6],null,null,true);
return;
}
_4c9.multiline=_4c7.multiline;
}
if(_4c7&&_4c7.width){
if(typeof _4c7.width==="number"||typeof _4c7.width=="object"){
_4c9.width=_4c7.width;
}else{
ColdFusion.handleError(null,"messagebox.update.invalidwidth","widget",[_4c6],null,null,true);
return;
}
}
if(_4c7.icon!=null||typeof _4c7.icon!="undefined"){
if(typeof _4c7.icon==="string"){
icon=_4c7.icon.toUpperCase();
if(icon!="ERROR"&&icon!="INFO"&&icon!="QUESTION"&&icon!="WARNING"){
ColdFusion.handleError(null,"messagebox.update.invalidicon","widget",[_4c6],null,null,true);
return;
}
_4c9.icon=_4c7.icon;
}else{
if(typeof _4c7.icon=="object"&&_4c7.icon==null){
_4c9.icon=null;
}else{
ColdFusion.handleError(null,"messagebox.update.invalidicon","widget",[_4c6],null,null,true);
return;
}
}
}
if(_4c7.callbackhandler!=null||typeof _4c7.callbackhandler!="undefined"){
if(typeof _4c7.callbackhandler==="function"||typeof _4c7.callbackhandler==="object"){
_4c9.callBack_Fn=_4c7.callbackhandler;
}else{
ColdFusion.handleError(null,"messagebox.update.invalidcallbackhandler","widget",[_4c6],null,null,true);
return;
}
}
if(_4c7.x!=null||typeof _4c7.x!="undefined"){
if(typeof _4c7.x==="number"||typeof _4c7.x=="object"){
_4c9.x=_4c7.x;
}else{
ColdFusion.handleError(null,"messagebox.update.xnotnumeric","widget",[_4c6,_4c7.x],null,null,true);
return;
}
}
if(_4c7.y!=null||typeof _4c7.y!="undefined"){
if(typeof _4c7.y==="number"||typeof _4c7.y=="object"){
_4c9.y=_4c7.y;
}else{
ColdFusion.handleError(null,"messagebox.update.ynotnumeric","widget",[_4c6,_4c7.y],null,null,true);
return;
}
}
if(_4c7.bodystyle!=null||typeof _4c7.bodystyle!="undefined"){
if(typeof _4c7.bodystyle==="string"||typeof _4c7.bodystyle=="object"){
_4c9.bodyStyle=_4c7.bodystyle;
}else{
ColdFusion.handleError(null,"messagebox.update.invalidbodystyle","widget",[_4c6],null,null,true);
return;
}
}
if(_4c7.buttontype!=null||typeof _4c7.buttontype!="undefined"){
if(typeof _4c7.buttontype==="string"||typeof _4c7.buttontype==="object"){
buttonType=_4c7.buttontype;
if(_4c8.type.toUpperCase()!=="CONFIRM"){
ColdFusion.handleError(null,"messagebox.update.invalidtypeandbuttontypecombination","widget",[_4c6],null,null,true);
return;
}else{
if(buttonType.toUpperCase()!="YESNO"&&buttonType.toUpperCase()!="YESNOCANCEL"){
ColdFusion.handleError(null,"messagebox.update.invalidbuttontype","widget",[_4c6],null,null,true);
return;
}
}
_4c9.buttonType=_4c7.buttontype;
}else{
ColdFusion.handleError(null,"messagebox.update.invalidbuttontype","widget",[_4c6],null,null,true);
return;
}
}
for(key in _4c9){
_4c8[key]=_4c9[key];
}
ColdFusion.Log.info("messagebox.update.updated","messagebox",[_4c6]);
};
$MB.getMessageBoxObject=function(_4ca){
var _4cb=ColdFusion.objectCache[_4ca];
if(_4cb==null||typeof (_4cb)=="undefined"){
ColdFusion.handleError(null,"messagebox.getmessageboxobject.missingmessageboxid","widget",[_4ca],null,null,true);
}
return _4cb;
};
$MB.isMessageBoxDefined=function(_4cc){
var _4cd=ColdFusion.objectCache[_4cc];
if(_4cd==null||typeof (_4cd)=="undefined"){
return false;
}else{
return true;
}
};
$MB.beforeShowHandler=function(_4ce){
var _4cf=$MB.getMessageBoxObject(CURRENT_MESSAGEBOX_ID);
var _4d0=_4cf.x;
var _4d1=_4cf.y;
var _4d2=_4cf.bodyStyle;
var _4d3=_4ce.body.parent();
var id=_4d3.id;
var ele=document.getElementById(id);
ele.style.cssText=_4d2;
if(_4d0&&_4d1&&typeof _4d0=="number"&&typeof _4d1=="number"&&_4d0>=0&&_4d1>=0){
_4ce.setPosition(_4d0,_4d1);
}else{
_4ce.center();
}
};
