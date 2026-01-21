/*ADOBE SYSTEMS INCORPORATED
Copyright 2007 Adobe Systems Incorporated
All Rights Reserved.

NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the
terms of the Adobe license agreement accompanying it.  If you have received this file from a
source other than Adobe, then your use, modification, or distribution of it requires the prior
written permission of Adobe.*/
if(!ColdFusion.Calendar){
ColdFusion.Calendar={};
}
ColdFusion.Calendar.monthNamesShort=new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec");
ColdFusion.Calendar.monthNamesLong=new Array("January","February","March","April","May","June","July","August","September","October","November","December");
ColdFusion.Calendar.dayNamesShort=new Array("Sun","Mon","Tue","Wed","Thu","Fri","Sat");
ColdFusion.Calendar.dayNamesLong=new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday");
ColdFusion.Calendar.calTableIdCounter=0;
if(navigator.userAgent.toLowerCase().indexOf("safari")>-1){
var set_month=Date.prototype.setMonth;
Date.prototype.setMonth=function(num){
if(num<=-1){
var n=Math.ceil(-num);
var _4dd=Math.ceil(n/12);
var _4de=(n%12)?12-n%12:0;
this.setFullYear(this.getFullYear()-_4dd);
return set_month.call(this,_4de);
}else{
return set_month.apply(this,arguments);
}
};
}
if(!String.escape){
String.escape=function(_4df){
return _4df.replace(/('|\\)/g,"\\$1");
};
}
ColdFusion.Calendar.setUpCalendar=function(_4e0,mask,_4e2,_4e3,_4e4,_4e5,_4e6){
var _4e7=ColdFusion.DOM.getElement(_4e0+_4e5+"_cf_button",_4e5);
var _4e8=ColdFusion.DOM.getElement(_4e0,_4e5);
var _4e9=null;
var _4ea=null;
if(_4e8.value!=""){
_4e9=_4e8.value;
_4ea=_4e9.split("/");
}
var _4eb=_4e0+"_cf_calendar"+ColdFusion.Calendar.calTableIdCounter;
ColdFusion.Calendar.calTableIdCounter++;
var _4ec=ColdFusion.DOM.getElement(_4e0+_4e5+"_cf_container",_4e5);
var _4ed=_4e8.offsetLeft;
ColdFusion.DOM.getElement(_4e0+_4e5+"_cf_container",_4e5).style.left=_4ed;
YAHOO.widget.Calendar.IMG_ROOT=_cf_ajaxscriptsrc+"/resources/yui/";
var _4ee;
if(_4ea&&_4ea[0]&&_4ea[2]){
_4ee=new YAHOO.widget.Calendar(_4eb,_4e0+_4e5+"_cf_container",{close:true,pagedate:_4ea[0]+"/"+_4ea[2]});
}else{
_4ee=new YAHOO.widget.Calendar(_4eb,_4e0+_4e5+"_cf_container",{close:true});
}
_4ee.calendarinputid=_4e0;
_4ee.calendarinput=_4e8;
_4ee.mask=mask;
_4ee.formname=_4e5;
_4ee.cfg.setProperty("MONTHS_LONG",_4e4);
_4ee.cfg.setProperty("WEEKDAYS_SHORT",_4e3);
_4ee.cfg.setProperty("START_WEEKDAY",_4e2);
ColdFusion.objectCache[_4eb+_4e5]=_4ee;
_4ee.select(_4e9);
_4ee.render();
_4ee.hide();
_4ee.selectEvent.subscribe(ColdFusion.Calendar.handleDateSelect,_4ee,true);
YAHOO.util.Event.addListener(_4e0+_4e5+"_cf_button","click",ColdFusion.Calendar.handleCalendarLinkClick,_4ee,true);
if(_4e6!=null){
var year=_4e6.year;
var _4f0=_4e6.month;
var day=_4e6.day;
var _4f2=new Date(year,_4f0.valueOf()-1,day);
_4e8.value=ColdFusion.Calendar.createFormattedOutput(_4e0,mask,year,_4f0,day,_4f2);
}
};
ColdFusion.Calendar.openedCalendarInstance=null;
ColdFusion.Calendar.handleCalendarLinkClick=function(type,args){
var _4f5=args;
if(ColdFusion.Calendar.openedCalendarInstance){
ColdFusion.Calendar.openedCalendarInstance.hide();
}
if(!_4f5.extMask){
var _4f6=ColdFusion.Calendar.convertToExtMask(_4f5.mask);
_4f5.extMask=_4f6;
}
var _4f7=ColdFusion.DOM.getElement(args.calendarinputid,_4f5.formname).value;
var _4f8=null;
if(typeof (_4f7)!="undefined"&&ColdFusion.trim(_4f7)!=""){
_4f8=Date.parseDate(_4f7,_4f5.extMask);
}
if(_4f8!=null){
_4f5.setMonth(_4f8.getMonth());
_4f5.setYear(_4f8.getFullYear());
_4f5.select(_4f8);
_4f5.render();
}
ColdFusion.Calendar.openedCalendarInstance=_4f5;
_4f5.show();
};
ColdFusion.Calendar.handleDateSelect=function(type,args,_4fb){
var _4fc=args[0];
var date=_4fc[0];
var year=date[0],month=date[1],day=date[2];
var _4ff=new Date(year,month.valueOf()-1,day);
var _500=_4fb.calendarinput.value;
_4fb.calendarinput.value=ColdFusion.Calendar.createFormattedOutput(_4fb.calendarinputid,_4fb.mask,year,month,day,_4ff);
ColdFusion.Event.callBindHandlers(_4fb.calendarinputid,null,"change");
_4fb.hide();
var node=document.getElementById(_4fb.calendarinputid);
if(node){
if(node.onchange){
if(node.value!=_500){
node.onchange();
}
}
}
};
ColdFusion.Calendar.convertToExtMask=function(mask){
mask=mask.toUpperCase();
if(mask.indexOf("DD")!=-1){
mask=mask.replace(/DD/g,"d");
}
if(mask.indexOf("D")!=-1){
mask=mask.replace(/D/g,"d");
}
if(mask.indexOf("MMMM")!=-1){
mask=mask.replace(/MMMM/g,"F");
}else{
if(mask.indexOf("MMM")!=-1){
mask=mask.replace(/MMM/g,"M");
}else{
if(mask.indexOf("MM")!=-1){
mask=mask.replace(/MM/g,"m");
}else{
if(mask.indexOf("M")!=-1){
mask=mask.replace(/M/g,"m");
}
}
}
}
if(mask.indexOf("YYYY")!=-1){
mask=mask.replace(/YYYY/g,"Y");
}
if(mask.indexOf("YY")!=-1){
mask=mask.replace(/YY/g,"y");
}
if(mask.indexOf("EEEE")!=-1){
mask=mask.replace(/EEEE/g,"l");
}
if(mask.indexOf("EEE")!=-1){
mask=mask.replace(/EEE/g,"D");
}
if(mask.indexOf("E")!=-1){
mask=mask.replace(/E/g,"w");
}
return mask;
};
ColdFusion.Calendar.createFormattedOutput=function(_503,mask,year,_506,day,date){
mask=mask.toUpperCase();
year=new String(year);
_506=new String(_506);
day=new String(day);
var _509=date.getDay();
if(mask.indexOf("DD")!=-1){
if(day.length==1){
day="0"+day;
}
mask=mask.replace(/DD/g,day);
}
if(mask.indexOf("D"!=-1)){
if(day.length!=-1&&day.charAt(0)=="0"){
day=day.charAt(1);
}
mask=mask.replace(/D/g,day);
}
if(mask.indexOf("MMMM")!=-1){
_506=ColdFusion.Calendar.monthNamesLong[_506.valueOf()-1];
mask=mask.replace(/MMMM/g,_506);
}else{
if(mask.indexOf("MMM")!=-1){
_506=ColdFusion.Calendar.monthNamesShort[_506.valueOf()-1];
mask=mask.replace(/MMM/g,_506);
}else{
if(mask.indexOf("MM")!=-1){
if(_506.length==1){
_506="0"+_506;
}
mask=mask.replace(/MM/g,_506);
}else{
if(mask.indexOf("M")!=-1){
if(_506.length!=-1&&_506.charAt(0)=="0"){
_506=_506.charAt(1);
}
mask=mask.replace(/M/g,_506);
}
}
}
}
if(mask.indexOf("YYYY")!=-1){
mask=mask.replace(/YYYY/g,year);
}
if(mask.indexOf("YY")!=-1){
year=year.substring(2);
mask=mask.replace(/YY/g,year);
}
if(mask.indexOf("EEEE")!=-1){
_509=ColdFusion.Calendar.dayNamesLong[_509.valueOf()];
mask=mask.replace(/EEEE/g,_509);
}
if(mask.indexOf("EEE")!=-1){
_509=ColdFusion.Calendar.dayNamesShort[_509.valueOf()];
mask=mask.replace(/EEE/g,_509);
}
if(mask.indexOf("E")!=-1){
_509=_509.valueOf();
_509=new String(_509);
if(_509.length!=-1&&_509.charAt(0)=="0"&&_509.charAt(1)){
_509=_509.charAt(1);
}
mask=mask.replace(/E/g,_509);
}
return mask;
};
